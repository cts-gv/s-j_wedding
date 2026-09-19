import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, PartyPopper, Heart } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useAccess } from '@/context/AccessContext';
import { supabase } from '@/lib/supabase';
import { MEAL_OPTIONS, type Attending, type Rsvp } from '@/types';
import { WEDDING_DATE_DISPLAY, RSVP_DEADLINE } from '@/constants';

export function Rsvp() {
  const { guest } = useAccess();
  const [existing, setExisting] = useState<Rsvp | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<Attending>('yes');
  const [guests, setGuests] = useState(1);
  const [meal, setMeal] = useState('');
  const [dietary, setDietary] = useState('');

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
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('guest_id', guest.id)
      .maybeSingle();
    if (data) {
      const r = data as Rsvp;
      setExisting(r);
      setFullName(r.full_name);
      setEmail(r.email);
      setAttending(r.attending);
      setGuests(r.number_of_guests);
      setMeal(r.meal_preference ?? '');
      setDietary(r.dietary_notes ?? '');
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const payload = {
      guest_id: guest.id,
      full_name: fullName,
      email,
      attending,
      number_of_guests: guests,
      meal_preference: attending === 'yes' ? meal || null : null,
      dietary_notes: dietary || null,
      updated_at: new Date().toISOString(),
    };

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
      const { error: err } = await supabase.from('rsvps').insert(payload);
      if (err) {
        setError(err.message);
        setSubmitting(false);
        return;
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
              Kindly Respond
            </p>
            <h2 className="text-4xl sm:text-5xl text-cream-50 font-display font-medium text-balance">
              RSVP
            </h2>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold-400/60" />
              <Heart size={14} className="text-gold-400" fill="currentColor" />
              <span className="h-px w-10 bg-gold-400/60" />
            </div>
            <p className="mt-5 text-cream-200/70 font-body text-base max-w-lg mx-auto">
              Please let us know if you&apos;ll be joining us by {RSVP_DEADLINE}.
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
                    ? "We can't wait to celebrate with you!"
                    : 'Thank you for letting us know.'}
                </h3>
                <p className="mt-2 text-warmgray-500 font-body text-sm">
                  Your RSVP has been received. You can update it anytime before {RSVP_DEADLINE}.
                </p>
                {attending === 'yes' && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-gold-600 font-body text-sm">
                    <PartyPopper size={18} />
                    See you on {WEDDING_DATE_DISPLAY}
                  </div>
                )}
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-sm text-wine-600 hover:text-wine-700 font-body underline"
                >
                  Edit my response
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
                    You&apos;ve already submitted an RSVP — update it below.
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Full name">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Email">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </FormField>
                </div>

                <FormField label="Will you be attending?">
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
                        {opt === 'yes' ? 'Joyfully Accept' : opt === 'no' ? 'Regretfully Decline' : 'Maybe'}
                      </button>
                    ))}
                  </div>
                </FormField>

                {attending !== 'no' && (
                  <>
                    <FormField label="Number of guests (including yourself)">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={guests}
                        onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                        className={`${inputCls} max-w-24`}
                      />
                    </FormField>

                    <FormField label="Meal preference">
                      <select
                        value={meal}
                        onChange={(e) => setMeal(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select a meal...</option>
                        {MEAL_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Dietary restrictions or allergies (optional)">
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="e.g. gluten-free, nut allergy"
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
                  {existing ? 'Update RSVP' : 'Submit RSVP'}
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
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-2 focus:ring-wine-200 transition';

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
