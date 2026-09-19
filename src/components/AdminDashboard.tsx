import { useEffect, useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Heart,
  Loader2,
  LogOut,
  StickyNote,
  KeyRound,
  Search,
  Shield,
  Copy,
  Check,
  Camera,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAccess, type Guest as AccessGuest } from '@/context/AccessContext';
import type { Rsvp, SpecialNote, Guest, GuestPhoto } from '@/types';

interface AdminDashboardProps {
  onBack: () => void;
}

type Tab = 'overview' | 'rsvps' | 'notes' | 'guests' | 'photos';

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { guest } = useAccess();
  const [tab, setTab] = useState<Tab>('overview');
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [notes, setNotes] = useState<SpecialNote[]>([]);
  const [guestsList, setGuestsList] = useState<Guest[]>([]);
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: rsvpData }, { data: noteData }, { data: guestData }, { data: photoData }] = await Promise.all([
      supabase.from('rsvps').select('*').order('created_at', { ascending: false }),
      supabase.from('special_notes').select('*').order('created_at', { ascending: false }),
      supabase.from('guests').select('*').order('access_code', { ascending: true }),
      supabase.from('guest_photos').select('*').order('created_at', { ascending: false }),
    ]);
    setRsvps((rsvpData as Rsvp[]) ?? []);
    setNotes((noteData as SpecialNote[]) ?? []);
    setGuestsList((guestData as Guest[]) ?? []);
    setPhotos((photoData as GuestPhoto[]) ?? []);
    setLoading(false);
  }

  const attending = rsvps.filter((r) => r.attending === 'yes');
  const declined = rsvps.filter((r) => r.attending === 'no');
  const maybe = rsvps.filter((r) => r.attending === 'maybe');
  const totalGuests = attending.reduce((sum, r) => sum + r.number_of_guests, 0);

  const stats = [
    { label: 'Total RSVPs', value: rsvps.length, icon: Users, color: 'sapphire' },
    { label: 'Attending', value: attending.length, icon: CheckCircle2, color: 'emerald' },
    { label: 'Declined', value: declined.length, icon: XCircle, color: 'wine' },
    { label: 'Maybe', value: maybe.length, icon: HelpCircle, color: 'gold' },
    { label: 'Total Guests', value: totalGuests, icon: Calendar, color: 'sapphire' },
    { label: 'Notes', value: notes.length, icon: Heart, color: 'wine' },
    { label: 'Access Codes', value: guestsList.length, icon: KeyRound, color: 'gold' },
    { label: 'Codes Used', value: guestsList.filter((g) => g.full_name).length, icon: Check, color: 'emerald' },
    { label: 'Pending Photos', value: photos.filter((p) => !p.is_approved).length, icon: Clock, color: 'gold' },
    { label: 'Pending Notes', value: notes.filter((n) => !n.is_approved).length, icon: Clock, color: 'gold' },
  ];

  const statColors: Record<string, string> = {
    wine: 'bg-wine-50 text-wine-700 border-wine-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sapphire: 'bg-sapphire-50 text-sapphire-700 border-sapphire-200',
    gold: 'bg-gold-50 text-gold-700 border-gold-200',
  };

  if (!guest?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100/60">
        <div className="text-center">
          <Shield size={40} className="mx-auto text-warmgray-300" />
          <p className="mt-4 text-warmgray-500 font-body">Admin access required.</p>
          <button
            onClick={onBack}
            className="mt-4 text-wine-600 hover:text-wine-700 font-body text-sm underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100/60">
      {/* Top bar */}
      <div className="bg-warmgray-900 text-cream-50 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl sm:text-2xl">Admin Dashboard</h1>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-cream-200 hover:text-cream-50 font-body text-sm transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-cream-50 rounded-full p-1.5 max-w-lg shadow-sm border border-cream-200 overflow-x-auto">
          {([
            { id: 'overview' as Tab, label: 'Overview' },
            { id: 'rsvps' as Tab, label: 'RSVPs' },
            { id: 'notes' as Tab, label: 'Notes' },
            { id: 'photos' as Tab, label: 'Photos' },
            { id: 'guests' as Tab, label: 'Guest Codes' },
          ]).map((t) => {
            const pendingCount =
              t.id === 'notes'
                ? notes.filter((n) => !n.is_approved).length
                : t.id === 'photos'
                  ? photos.filter((p) => !p.is_approved).length
                  : 0;
            return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-full py-2 text-sm font-body font-medium transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'bg-wine-600 text-cream-50 shadow'
                  : 'text-warmgray-500 hover:bg-cream-100'
              }`}
            >
              {t.label}
              {pendingCount > 0 && (
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-medium ${
                    tab === t.id ? 'bg-cream-50 text-wine-700' : 'bg-gold-500 text-white'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-wine-500" size={32} />
          </div>
        ) : tab === 'overview' ? (
          <Overview stats={stats} statColors={statColors} />
        ) : tab === 'rsvps' ? (
          <RsvpTable rsvps={rsvps} />
        ) : tab === 'notes' ? (
          <NoteReview notes={notes} onReload={loadData} />
        ) : tab === 'photos' ? (
          <PhotoReview photos={photos} onReload={loadData} guest={guest} />
        ) : (
          <GuestCodesManager guests={guestsList} onReload={loadData} />
        )}
      </div>
    </div>
  );
}

interface OverviewProps {
  stats: { label: string; value: number; icon: React.ElementType; color: string }[];
  statColors: Record<string, string>;
}

function Overview({ stats, statColors }: OverviewProps) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-5 border ${statColors[stat.color]} shadow-sm`}
          >
            <stat.icon size={24} className="mb-3" />
            <p className="font-display text-3xl font-medium">{stat.value}</p>
            <p className="mt-1 font-body text-xs uppercase tracking-wide opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-cream-50 rounded-2xl p-6 border border-cream-200 shadow-sm">
        <h3 className="font-display text-xl text-wine-700 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-body">
            <span className="text-warmgray-500">Attending guests (including plus-ones)</span>
            <span className="font-medium text-emerald-700">
              {stats.find((s) => s.label === 'Total Guests')?.value ?? 0}
            </span>
          </div>
          <div className="h-px bg-cream-200" />
          <div className="flex items-center justify-between text-sm font-body">
            <span className="text-warmgray-500">Still pending / maybe</span>
            <span className="font-medium text-gold-700">
              {stats.find((s) => s.label === 'Maybe')?.value ?? 0}
            </span>
          </div>
          <div className="h-px bg-cream-200" />
          <div className="flex items-center justify-between text-sm font-body">
            <span className="text-warmgray-500">Notes for the couple</span>
            <span className="font-medium text-wine-700">
              {stats.find((s) => s.label === 'Notes')?.value ?? 0}
            </span>
          </div>
          <div className="h-px bg-cream-200" />
          <div className="flex items-center justify-between text-sm font-body">
            <span className="text-warmgray-500">Access codes assigned</span>
            <span className="font-medium text-sapphire-700">
              {stats.find((s) => s.label === 'Codes Used')?.value ?? 0} / {stats.find((s) => s.label === 'Access Codes')?.value ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  if (rsvps.length === 0) {
    return (
      <p className="text-center text-warmgray-400 font-body text-sm py-16">
        No RSVPs yet.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto bg-cream-50 rounded-2xl border border-cream-200 shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-cream-200 bg-cream-100/50">
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500">Name</th>
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 hidden sm:table-cell">Email</th>
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500">Status</th>
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500">Guests</th>
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 hidden md:table-cell">Meal</th>
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 hidden md:table-cell">Dietary</th>
            <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 hidden lg:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((rsvp) => (
            <tr key={rsvp.id} className="border-b border-cream-200 last:border-0 hover:bg-cream-100/40 transition-colors">
              <td className="px-4 py-3 font-body text-sm text-warmgray-800 font-medium">{rsvp.full_name}</td>
              <td className="px-4 py-3 font-body text-sm text-warmgray-500 hidden sm:table-cell">{rsvp.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={rsvp.attending} />
              </td>
              <td className="px-4 py-3 font-body text-sm text-warmgray-600">{rsvp.number_of_guests}</td>
              <td className="px-4 py-3 font-body text-sm text-warmgray-500 hidden md:table-cell">{rsvp.meal_preference ?? '—'}</td>
              <td className="px-4 py-3 font-body text-sm text-warmgray-500 hidden md:table-cell">{rsvp.dietary_notes ?? '—'}</td>
              <td className="px-4 py-3 font-body text-sm text-warmgray-400 hidden lg:table-cell">
                {new Date(rsvp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: Rsvp['attending'] }) {
  const config = {
    yes: { label: 'Attending', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    no: { label: 'Declined', cls: 'bg-wine-50 text-wine-700 border-wine-200' },
    maybe: { label: 'Maybe', cls: 'bg-gold-50 text-gold-700 border-gold-200' },
  };
  const c = config[status];
  return (
    <span className={`inline-block text-xs font-body font-medium px-2.5 py-1 rounded-full border ${c.cls}`}>
      {c.label}
    </span>
  );
}

function NoteReview({ notes, onReload }: { notes: SpecialNote[]; onReload: () => void }) {
  const [acting, setActing] = useState<string | null>(null);

  const pending = notes.filter((n) => !n.is_approved);
  const approved = notes.filter((n) => n.is_approved);

  async function approve(id: string) {
    setActing(id);
    await supabase.from('special_notes').update({ is_approved: true }).eq('id', id);
    setActing(null);
    onReload();
  }

  async function reject(id: string) {
    setActing(id);
    await supabase.from('special_notes').delete().eq('id', id);
    setActing(null);
    onReload();
  }

  async function revoke(id: string) {
    setActing(id);
    await supabase.from('special_notes').update({ is_approved: false }).eq('id', id);
    setActing(null);
    onReload();
  }

  function NoteCard({ note }: { note: SpecialNote }) {
    return (
      <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200 shadow-sm flex flex-col">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-9 w-9 rounded-full bg-wine-100 flex items-center justify-center">
            <StickyNote size={16} className="text-wine-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-body text-sm font-medium text-warmgray-800">{note.author_name}</p>
              {note.is_approved ? (
                <span className="flex items-center gap-1 bg-emerald-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  Approved
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-gold-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
                  <Clock size={12} />
                  Pending
                </span>
              )}
            </div>
            <p className="font-body text-xs text-warmgray-400">
              {new Date(note.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="mt-2.5 font-body text-sm text-warmgray-600 italic leading-relaxed">{note.note}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {note.is_approved ? (
            <button
              onClick={() => revoke(note.id)}
              disabled={acting === note.id}
              className="flex-1 text-xs font-body font-medium bg-cream-100 hover:bg-cream-200 text-warmgray-600 rounded-full py-2 transition-colors disabled:opacity-60"
            >
              {acting === note.id ? '...' : 'Unapprove'}
            </button>
          ) : (
            <>
              <button
                onClick={() => approve(note.id)}
                disabled={acting === note.id}
                className="flex-1 text-xs font-body font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {acting === note.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Approve
              </button>
              <button
                onClick={() => reject(note.id)}
                disabled={acting === note.id}
                className="flex-1 text-xs font-body font-medium bg-wine-600 hover:bg-wine-700 text-white rounded-full py-2 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {acting === note.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <p className="text-center text-warmgray-400 font-body text-sm py-16">
        No notes yet.
      </p>
    );
  }

  return (
    <div>
      {/* Pending notes */}
      {pending.length > 0 && (
        <div className="mb-10">
          <h3 className="font-display text-lg text-wine-700 flex items-center gap-2">
            <Clock size={18} className="text-gold-600" />
            Pending Review
          </h3>
          <p className="mt-1 mb-4 font-body text-sm text-warmgray-500">
            {pending.length} note{pending.length !== 1 ? 's' : ''} need{pending.length === 1 ? 's' : ''} your approval before appearing in the Special Notes section. Rejecting a note deletes it.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {pending.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {/* Approved notes */}
      <div>
        <h3 className="font-display text-lg text-wine-700 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          Approved Notes
        </h3>
        <p className="mt-1 mb-4 font-body text-sm text-warmgray-500">
          {approved.length} note{approved.length !== 1 ? 's' : ''} currently visible in the Special Notes section.
        </p>
        {approved.length === 0 ? (
          <p className="text-center text-warmgray-400 font-body text-sm py-8">No approved notes yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {approved.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuestCodesManager({ guests, onReload }: { guests: Guest[]; onReload: () => void }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);

  const PAGE_SIZE = 100;

  const filtered = guests.filter(
    (g) =>
      g.access_code.toLowerCase().includes(search.toLowerCase()) ||
      (g.full_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const pageStart = safePage * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageEnd);

  function onSearchChange(value: string) {
    setSearch(value);
    setPage(0);
  }

  async function saveName(guestId: string) {
    setUpdating(true);
    await supabase.from('guests').update({ full_name: editName || null, updated_at: new Date().toISOString() }).eq('id', guestId);
    setUpdating(false);
    setEditingId(null);
    onReload();
  }

  async function saveCode(guestId: string) {
    const trimmed = editCode.trim().toUpperCase();
    if (!trimmed) {
      setCodeError('Code cannot be empty.');
      return;
    }
    if (!/^[A-Z0-9]{1,20}$/.test(trimmed)) {
      setCodeError('Only letters and numbers, up to 20 characters.');
      return;
    }
    setUpdating(true);
    setCodeError(null);
    const { error } = await supabase
      .from('guests')
      .update({ access_code: trimmed, updated_at: new Date().toISOString() })
      .eq('id', guestId);
    setUpdating(false);
    if (error) {
      setCodeError('That code is already in use. Try a different one.');
      return;
    }
    setEditingId(null);
    setEditCode('');
    onReload();
  }

  async function saveNote(guestId: string) {
    setUpdating(true);
    await supabase.from('guests').update({ welcome_note: editNote || null, updated_at: new Date().toISOString() }).eq('id', guestId);
    setUpdating(false);
    setNoteModalId(null);
    onReload();
  }

  async function toggleAdmin(g: Guest) {
    await supabase.from('guests').update({ is_admin: !g.is_admin, updated_at: new Date().toISOString() }).eq('id', g.id);
    onReload();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-5 relative max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by code or name..."
          className="w-full rounded-full border border-cream-300 bg-cream-50 pl-10 pr-4 py-2.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-2 focus:ring-wine-200 transition"
        />
      </div>

      <p className="text-sm text-warmgray-400 font-body mb-4">
        Showing {pageItems.length > 0 ? pageStart + 1 : 0}–{Math.min(pageEnd, filtered.length)} of {filtered.length} code{filtered.length !== 1 ? 's' : ''}
        {search && ` (filtered from ${guests.length})`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto bg-cream-50 rounded-2xl border border-cream-200 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cream-200 bg-cream-100/50">
              <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500">Access Code</th>
              <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500">Guest Name</th>
              <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 hidden md:table-cell">Welcome Note</th>
              <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 text-center">Admin</th>
              <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-warmgray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((g) => (
              <tr key={g.id} className="border-b border-cream-200 last:border-0 hover:bg-cream-100/40 transition-colors">
                <td className="px-4 py-3">
                  {editingCodeId === g.id ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editCode}
                          onChange={(e) => { setEditCode(e.target.value.toUpperCase()); setCodeError(null); }}
                          placeholder="New code"
                          autoCapitalize="characters"
                          spellCheck={false}
                          className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-warmgray-800 font-body text-sm font-mono uppercase focus:outline-none focus:border-wine-400 focus:ring-1 focus:ring-wine-200 w-32"
                          autoFocus
                        />
                        <button
                          onClick={() => saveCode(g.id)}
                          disabled={updating}
                          className="text-xs font-body text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingCodeId(null); setCodeError(null); }}
                          className="text-xs font-body text-warmgray-400 hover:text-warmgray-600"
                        >
                          Cancel
                        </button>
                      </div>
                      {codeError && (
                        <span className="text-xs text-wine-600 font-body">{codeError}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-warmgray-800 font-medium font-mono">{g.access_code}</span>
                      <button
                        onClick={() => copyCode(g.access_code)}
                        className="text-warmgray-400 hover:text-wine-600 transition-colors"
                        aria-label="Copy code"
                      >
                        {copiedCode === g.access_code ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === g.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Guest name"
                        className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-1 focus:ring-wine-200"
                        autoFocus
                      />
                      <button
                        onClick={() => saveName(g.id)}
                        disabled={updating}
                        className="text-xs font-body text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-body text-warmgray-400 hover:text-warmgray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="font-body text-sm text-warmgray-600">
                      {g.full_name ?? <span className="text-warmgray-300 italic">Unassigned</span>}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {g.welcome_note ? (
                    <span className="font-body text-sm text-warmgray-600 line-clamp-2 max-w-xs">
                      {g.welcome_note}
                    </span>
                  ) : (
                    <span className="text-warmgray-300 italic text-sm">No note</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleAdmin(g)}
                    className={`inline-block text-xs font-body font-medium px-2.5 py-1 rounded-full border transition-colors ${
                      g.is_admin
                        ? 'bg-sapphire-50 text-sapphire-700 border-sapphire-200'
                        : 'bg-cream-100 text-warmgray-400 border-cream-200 hover:text-warmgray-600'
                    }`}
                  >
                    {g.is_admin ? 'Admin' : 'No'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId !== g.id && editingCodeId !== g.id && (
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setNoteModalId(g.id);
                          setEditNote(g.welcome_note ?? '');
                        }}
                        className="text-xs font-body text-gold-700 hover:text-gold-800 font-medium"
                      >
                        Note
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(g.id);
                          setEditName(g.full_name ?? '');
                        }}
                        className="text-xs font-body text-wine-600 hover:text-wine-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setEditingCodeId(g.id);
                          setEditCode(g.access_code);
                          setCodeError(null);
                        }}
                        className="text-xs font-body text-sapphire-600 hover:text-sapphire-700 font-medium"
                      >
                        Code
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="flex items-center gap-1.5 text-sm font-body font-medium text-warmgray-600 hover:text-wine-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="text-sm font-body text-warmgray-400">
            Page {safePage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="flex items-center gap-1.5 text-sm font-body font-medium text-warmgray-600 hover:text-wine-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Note editor modal */}
      {noteModalId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-warmgray-900/50 backdrop-blur-sm"
            onClick={() => setNoteModalId(null)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md bg-cream-50 rounded-2xl shadow-2xl border border-cream-200 overflow-hidden">
            <div className="bg-wine-700 px-5 py-4 text-cream-50 flex items-center justify-between">
              <h4 className="font-display text-lg">Welcome Note</h4>
              <button
                onClick={() => setNoteModalId(null)}
                className="text-cream-200 hover:text-cream-50 text-sm font-body"
              >
                Cancel
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs font-body text-warmgray-400 mb-2">
                This message will appear to the guest right after they enter their access code.
              </p>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={5}
                placeholder="Write a personal welcome message for this guest..."
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-2 focus:ring-wine-200 transition resize-none"
                autoFocus
              />
              <div className="mt-4 flex items-center justify-end gap-3">
                {editNote && (
                  <button
                    onClick={() => setEditNote('')}
                    className="text-xs font-body text-warmgray-400 hover:text-wine-600 transition-colors"
                  >
                    Clear note
                  </button>
                )}
                <button
                  onClick={() => saveNote(noteModalId)}
                  disabled={updating}
                  className="bg-wine-600 hover:bg-wine-700 disabled:opacity-60 text-cream-50 font-body font-medium rounded-full px-6 py-2.5 text-sm transition-colors"
                >
                  {updating ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoReview({ photos, onReload, guest }: { photos: GuestPhoto[]; onReload: () => void; guest: AccessGuest | null }) {
  const [acting, setActing] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pending = photos.filter((p) => !p.is_approved);
  const approved = photos.filter((p) => p.is_approved);

  const getUrl = (path: string) =>
    supabase.storage.from('wedding-photos').getPublicUrl(path).data.publicUrl;

  async function handleUpload(file: File) {
    if (!guest) return;
    setUploading(true);
    setUploadError(null);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `couple/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('wedding-photos')
      .upload(path, file, { contentType: file.type });
    if (upErr) {
      setUploadError('Could not upload the photo. Please try again.');
      setUploading(false);
      return;
    }
    const { error: dbErr } = await supabase.from('guest_photos').insert({
      guest_id: guest.id,
      uploader_name: guest.full_name ?? 'Sunshine & Jose',
      storage_path: path,
      caption: caption || null,
      is_couple_upload: true,
      is_approved: true,
    });
    setUploading(false);
    if (dbErr) {
      setUploadError('Photo uploaded but could not save. Please try again.');
      return;
    }
    setCaption('');
    setShowUpload(false);
    onReload();
  }

  async function approve(id: string) {
    setActing(id);
    await supabase.from('guest_photos').update({ is_approved: true }).eq('id', id);
    setActing(null);
    onReload();
  }

  async function reject(id: string, storagePath: string) {
    setActing(id);
    await supabase.storage.from('wedding-photos').remove([storagePath]);
    await supabase.from('guest_photos').delete().eq('id', id);
    setActing(null);
    onReload();
  }

  async function revoke(id: string) {
    setActing(id);
    await supabase.from('guest_photos').update({ is_approved: false }).eq('id', id);
    setActing(null);
    onReload();
  }

  function PhotoCard({ photo }: { photo: GuestPhoto }) {
    return (
      <div className="bg-cream-50 rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="relative">
          <img
            src={getUrl(photo.storage_path)}
            alt={photo.caption || `Photo by ${photo.uploader_name}`}
            className="w-full h-48 object-cover"
          />
          {photo.is_approved ? (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Approved
            </div>
          ) : (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-gold-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
              <Clock size={12} />
              Pending
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="font-body text-sm text-warmgray-700 font-medium">{photo.uploader_name}</p>
          <p className="font-body text-xs text-warmgray-400 mt-0.5">
            {new Date(photo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {photo.is_approved ? (
              <button
                onClick={() => revoke(photo.id)}
                disabled={acting === photo.id}
                className="flex-1 text-xs font-body font-medium bg-cream-100 hover:bg-cream-200 text-warmgray-600 rounded-full py-2 transition-colors disabled:opacity-60"
              >
                {acting === photo.id ? '...' : 'Unapprove'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => approve(photo.id)}
                  disabled={acting === photo.id}
                  className="flex-1 text-xs font-body font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {acting === photo.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => reject(photo.id, photo.storage_path)}
                  disabled={acting === photo.id}
                  className="flex-1 text-xs font-body font-medium bg-wine-600 hover:bg-wine-700 text-white rounded-full py-2 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {acting === photo.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <Camera size={40} className="mx-auto text-warmgray-300" />
        <p className="mt-4 text-warmgray-400 font-body text-sm">
          No photos uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Upload button */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg text-wine-700">Manage Photos</h3>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 bg-wine-600 hover:bg-wine-700 text-cream-50 font-body font-medium rounded-full px-5 py-2 text-sm transition-colors"
        >
          <Upload size={15} />
          Upload Photo
        </button>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-warmgray-900/50 backdrop-blur-sm"
            onClick={() => setShowUpload(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md bg-cream-50 rounded-2xl shadow-2xl border border-cream-200 overflow-hidden">
            <div className="bg-wine-700 px-5 py-4 text-cream-50 flex items-center justify-between">
              <h4 className="font-display text-lg">Upload a Photo</h4>
              <button
                onClick={() => setShowUpload(false)}
                className="text-cream-200 hover:text-cream-50"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <label className="block">
                <span className="text-xs font-body text-warmgray-400 mb-1.5 block">Caption (optional)</span>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a short caption..."
                  className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-2 focus:ring-wine-200 transition mb-4"
                />
              </label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-cream-300 rounded-xl py-8 px-4 cursor-pointer hover:border-wine-400 transition-colors">
                {uploading ? (
                  <Loader2 size={28} className="animate-spin text-wine-500" />
                ) : (
                  <Upload size={28} className="text-warmgray-300" />
                )}
                <span className="font-body text-sm text-warmgray-500">
                  {uploading ? 'Uploading...' : 'Click to choose a photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUpload(file);
                  }}
                />
              </label>
              {uploadError && (
                <p className="mt-3 text-sm text-wine-700 bg-wine-50 rounded-lg px-4 py-2 border border-wine-200 font-body">
                  {uploadError}
                </p>
              )}
              <p className="mt-3 text-xs text-warmgray-400 font-body text-center">
                Couple uploads are approved instantly and appear in the After Wedding Party section right away.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending photos */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display text-lg text-wine-700 mb-1">
            Awaiting Review
          </h3>
          <p className="text-sm text-warmgray-400 font-body mb-4">
            {pending.length} photo{pending.length !== 1 ? 's' : ''} need{pending.length === 1 ? 's' : ''} your approval before appearing in the After Wedding Party section.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pending.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      )}

      {/* Approved photos */}
      <div>
        <h3 className="font-display text-lg text-wine-700 mb-1">
          Approved Photos
        </h3>
        <p className="text-sm text-warmgray-400 font-body mb-4">
          {approved.length} photo{approved.length !== 1 ? 's' : ''} currently visible in the After Wedding Party section.
        </p>
        {approved.length === 0 ? (
          <p className="text-sm text-warmgray-400 font-body italic py-6 text-center bg-cream-50 rounded-xl border border-cream-200">
            No approved photos yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {approved.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
