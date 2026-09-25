import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, PartyPopper, Heart } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useAccess } from '@/context/AccessContext';
import { supabase } from '@/lib/supabase';
import type { Attending, GuestType, Rsvp, RsvpGuest } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

/** Grow or shrink a list of names to `size`, keeping whatever was already typed. */
function resizeNames(names: string[], size: number): string[] {
  if (size === names.length) return names;
  if (size < names.length) return names.slice(0, size);
  return [...names, ...Array.from({ length: size - names.length }, () => '')];
}

export function Rsvp() {
  const { guest } = useAccess();
  const { t, weddingDate, rsvpDeadline } = useLanguage();
  const [existing, setExisting] = useState<Rsvp | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<Attending>('yes');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  // How many of each this access code is allowed (set by the couple in the admin dashboard)
  const [maxAdults, setMaxAdults] = useState(guest?.max_adults ?? 1);
  const [maxChildren, setMaxChildren] = useState(guest?.max_children ?? 0);
  const [dietary, setDietary] = useState('');
  // Name of every adult / child coming under this access code (index 0 of
  // adultNames is assumed to be the person filling out the form, unless they
  // type something different).
  const [adultNames, setAdultNames] = useState<string[]>(['']);
  const [childNames, setChildNames] = useState<string[]>([]);

  useEffect(() => {
    if (!guest) {
      setLoading(false);
      return;
    }
    if (guest.full_name) setFullName(guest.full_name);
    void loadRsvp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest]);

  async function loadRsvp() {
    if (!guest) return;
    setLoading(true);

    // Always use the latest allotment, in case the couple changed it since sign-in.
    let allowedAdults = guest.max_adults ?? 1;
    let allowedChildren = guest.max_children ?? 0;
    const { data: fresh } = await supabase.rpc('get_guest_by_id', { guest_id: guest.id });
    if (fresh && fresh.length > 0) {
      allowedAdults = fresh[0].max_adults ?? allowedAdults;
      allowedChildren = fresh[0].max_children ?? allowedChildren;
    }
    setMaxAdults(allowedAdults);
    setMaxChildren(allowedChildren);
    setAdults((a) => Math.min(a, allowedAdults));
    setChildren((c) => Math.min(c, allowedChildren));

    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('guest_id', guest.id)
      .maybeSingle();
    if (data) {
      const r = data as Rsvp;
      const finalAdults = Math.min(r.adults ?? 1, allowedAdults);
      const finalChildren = Math.min(r.children ?? 0, allowedChildren);
      setExisting(r);
      setFullName(r.full_name);
      setEmail(r.email);
      setAttending(r.attending);
      setAdults(finalAdults);
      setChildren(finalChildren);
      setDietary(r.dietary_notes ?? '');

      const { data: members } = await supabase
        .from('rsvp_guests')
        .select('*')
        .eq('rsvp_id', r.id)
        .order('sort_order', { ascending: true });
      const list = (members as RsvpGuest[] | null) ?? [];
      const loadedAdults = list.filter((m) => m.guest_type === 'adult').map((m) => m.full_name);
      const loadedChildren = list.filter((m) => m.guest_type === 'child').map((m) => m.full_name);
      setAdultNames(resizeNames(loadedAdults.length ? loadedAdults : [r.full_name], finalAdults));
      setChildNames(resizeNames(loadedChildren, finalChildren));
    } else {
      setAdultNames(resizeNames([''], adults));
      setChildNames(resizeNames([], children));
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const attendingCount = attending !== 'no';
    if (attendingCount && adults + children < 1) {
      setError(t('Please select at least one guest.', 'Por favor selecciona al menos un invitado.'));
      setSubmitting(false);
      return;
    }
    if (attendingCount && adults > maxAdults) {
      setError(t(`Your invitation allows up to ${maxAdults} adult(s).`, `Tu invitación permite hasta ${maxAdults} adulto(s).`));
      setSubmitting(false);
      return;
    }
    if (attendingCount && children > maxChildren) {
      setError(t(`Your invitation allows up to ${maxChildren} child(ren).`, `Tu invitación permite hasta ${maxChildren} niño(s).`));
      setSubmitting(false);
      return;
    }

    // The first adult defaults to the person filling out the form if they
    // left that slot blank.
    const finalAdultNames = adultNames.map((n, i) => (i === 0 && !n.trim() ? fullName : n.trim()));
    const finalChildNames = childNames.map((n) => n.trim());

    if (attendingCount && (finalAdultNames.some((n) => !n) || finalChildNames.some((n) => !n))) {
      setError(t('Please enter a name for every guest.', 'Por favor ingresa el nombre de cada invitado.'));
      setSubmitting(false);
      return;
    }

    const payload = {
      guest_id: guest.id,
      full_name: fullName,
      email,
      attending,
      adults: attendingCount ? adults : 0,
      children: attendingCount ? children : 0,
      number_of_guests: attendingCount ? adults + children : 0,
      dietary_notes: dietary || null,
      updated_at: new Date().toISOString(),
    };

    let rsvpId = existing?.id;

    if (existing) {
      const { error: err } = await supabase
        .from('rsvps')
        .update(payload)
        .eq('id', existing.id);
      if (err) {
        setError(err.message);
        setSubmitting(false);
        return;
      }
    } else {
      const { data: inserted, error: err } = await supabase
        .from('rsvps')
        .insert(payload)
        .select('id')
        .single();
      if (err) {
        setError(err.message);
        setSubmitting(false);
        return;
      }
      rsvpId = inserted?.id;
    }

    // Replace the guest-name list with whatever was just submitted. Simplest
    // way to keep it in sync on edits, and RSVP parties are small so this is
    // cheap.
    if (rsvpId) {
      await supabase.from('rsvp_guests').delete().eq('rsvp_id', rsvpId);
      if (attendingCount) {
        const rows: Omit<RsvpGuest, 'id' | 'created_at'>[] = [
          ...finalAdultNames.map((full_name, i) => ({
            rsvp_id: rsvpId as string,
            guest_id: guest.id,
            full_name,
            guest_type: 'adult' as GuestType,
            sort_order: i,
          })),
          ...finalChildNames.map((full_name, i) => ({
            rsvp_id: rsvpId as string,
            guest_id: guest.id,
            full_name,
            guest_type: 'child' as GuestType,
            sort_order: finalAdultNames.length + i,
          })),
        ];
        if (rows.length) {
          const { error: guestsErr } = await supabase.from('rsvp_guests').insert(rows);
          if (guestsErr) {
            setError(guestsErr.message);
            setSubmitting(false);
            return;
          }
        }
      }
    }

    setSuccess(true);
    setSubmitting(false);
    void loadRsvp();
  };

  return (
    <section id="rsvp" className="py-24 sm:py-32 bg-wine-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-gold-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-wine-400/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-gold-400 uppercase tracking-widest-2 text-xs font-body font-medium mb-3">
              {t('Kindly Respond', 'Te pedimos responder')}
            </p>
            <h2 className="text-4xl sm:text-5xl text-cream-50 font-display font-medium text-balance">
              {t('RSVP', 'Confirmar asistencia')}
            </h2>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold-400/60" />
              <Heart size={14} className="text-royal-300" fill="currentColor" />
              <span className="h-px w-10 bg-gold-400/60" />
            </div>
            <p className="mt-5 text-cream-200/70 font-body text-base max-w-lg mx-auto">
              {t(
                `Please let us know if you'll be joining us by ${rsvpDeadline}.`,
                `Por favor avísanos si nos acompañarás a más tardar el ${rsvpDeadline}.`,
              )}
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-gold-400" size={32} />
            </div>
          ) : success ? (
            <Reveal>
              <div className="bg-cream-50 rounded-2xl p-8 sm:p-10 text-center shadow-xl">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
                <h3 className="mt-4 font-display text-2xl text-wine-700">
                  {attending === 'yes'
                    ? t("We can't wait to celebrate with you!", '¡No podemos esperar para celebrar contigo!')
                    : t('Thank you for letting us know.', 'Gracias por avisarnos.')}
                </h3>
                <p className="mt-2 text-warmgray-500 font-body text-sm">
                  {t(
                    `Your RSVP has been received. You can update it anytime before ${rsvpDeadline}.`,
                    `Recibimos tu confirmación. Puedes actualizarla en cualquier momento antes del ${rsvpDeadline}.`,
                  )}
                </p>
                {attending === 'yes' && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-gold-600 font-body text-sm">
                    <PartyPopper size={18} />
                    {t('See you on', 'Nos vemos el')} {weddingDate}
                  </div>
                )}
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-sm text-wine-600 hover:text-wine-700 font-body underline"
                >
                  {t('Edit my response', 'Editar mi respuesta')}
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form
                onSubmit={handleSubmit}
                className="bg-cream-50 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6"
              >
                {existing && (
                  <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
                    {t(
                      "You've already submitted an RSVP — update it below.",
                      'Ya enviaste tu confirmación; puedes actualizarla aquí abajo.',
                    )}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label={t('Full name', 'Nombre completo')}>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label={t('Email', 'Correo electrónico')}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </FormField>
                </div>

                <FormField label={t('Will you be attending?', '¿Asistirás?')}>
                  <div className="grid grid-cols-3 gap-3">
                    {(['yes', 'maybe', 'no'] as Attending[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAttending(opt)}
                        className={`rounded-full py-2.5 text-sm font-body font-medium capitalize transition-all ${
                          attending === opt
                            ? 'bg-wine-600 text-cream-50 shadow'
                            : 'bg-cream-100 text-warmgray-500 hover:bg-cream-200'
                        }`}
                      >
                        {opt === 'yes'
                          ? t('Joyfully Accept', 'Acepto con gusto')
                          : opt === 'no'
                            ? t('Regretfully Decline', 'Lamento no poder asistir')
                            : t('Maybe', 'Tal vez')}
                      </button>
                    ))}
                  </div>
                </FormField>

                {attending !== 'no' && (
                  <>
                    <p className="text-sm text-royal-800 bg-royal-50 rounded-lg px-4 py-2 border border-royal-200 font-body">
                      {t(
                        `Your invitation includes up to ${maxAdults} adult${maxAdults === 1 ? '' : 's'} and ${maxChildren} child${maxChildren === 1 ? '' : 'ren'} (12 and under), including yourself.`,
                        `Tu invitación incluye hasta ${maxAdults} adulto${maxAdults === 1 ? '' : 's'} y ${maxChildren} niño${maxChildren === 1 ? '' : 's'} (12 años o menos), contándote a ti.`,
                      )}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label={t('Adults (including you)', 'Adultos (contándote a ti)')}>
                        <select
                          value={adults}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            setAdults(n);
                            setAdultNames((prev) => resizeNames(prev, n));
                          }}
                          className={inputCls}
                        >
                          {Array.from({ length: maxAdults + 1 }, (_, n) => n).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label={t('Children (12 and under)', 'Niños (12 años o menos)')}>
                        <select
                          value={children}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            setChildren(n);
                            setChildNames((prev) => resizeNames(prev, n));
                          }}
                          disabled={maxChildren === 0}
                          className={`${inputCls} disabled:opacity-60`}
                        >
                          {Array.from({ length: maxChildren + 1 }, (_, n) => n).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>

                    {(adults > 0 || children > 0) && (
                      <FormField
                        label={t(
                          'Who is coming? Please list every guest by name.',
                          '¿Quiénes vienen? Enumera a cada invitado por su nombre.',
                        )}
                      >
                        <div className="space-y-2.5">
                          {adultNames.map((name, i) => (
                            <div key={`adult-${i}`} className="flex items-center gap-2">
                              <span className="text-xs font-body text-warmgray-400 w-20 shrink-0">
                                {t('Adult', 'Adulto')} {i + 1}
                              </span>
                              <input
                                type="text"
                                required={i !== 0}
                                value={name}
                                placeholder={
                                  i === 0
                                    ? t('Defaults to your name above', 'Usa tu nombre de arriba si lo dejas vacío')
                                    : t('Full name', 'Nombre completo')
                                }
                                onChange={(e) =>
                                  setAdultNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
                                }
                                className={inputCls}
                              />
                            </div>
                          ))}
                          {childNames.map((name, i) => (
                            <div key={`child-${i}`} className="flex items-center gap-2">
                              <span className="text-xs font-body text-warmgray-400 w-20 shrink-0">
                                {t('Child', 'Niño')} {i + 1}
                              </span>
                              <input
                                type="text"
                                required
                                value={name}
                                placeholder={t('Full name', 'Nombre completo')}
                                onChange={(e) =>
                                  setChildNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
                                }
                                className={inputCls}
                              />
                            </div>
                          ))}
                        </div>
                      </FormField>
                    )}

                    <FormField
                      label={t(
                        'Dietary restrictions or allergies (optional)',
                        'Restricciones alimentarias o alergias (opcional)',
                      )}
                    >
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder={t('e.g. gluten-free, nut allergy', 'p. ej. sin gluten, alergia a las nueces')}
                        className={inputCls}
                      />
                    </FormField>
                  </>
                )}

                {error && (
                  <p className="text-sm text-wine-700 bg-wine-50 rounded-lg px-4 py-2 border border-wine-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-wine-600 hover:bg-wine-700 disabled:opacity-60 text-cream-50 font-body font-medium rounded-full py-3.5 transition-colors flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {existing
                    ? t('Update RSVP', 'Actualizar confirmación')
                    : t('Submit RSVP', 'Enviar confirmación')}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-200 transition';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-body font-medium text-warmgray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}
