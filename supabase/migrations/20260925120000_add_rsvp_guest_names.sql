/*
# Named guests on each RSVP + per-person check-in

## Overview
Today one RSVP row just stores a headcount (`adults` / `children`). The couple
wants each RSVP to also capture the actual NAME of every person coming under
that access code (the respondent plus everyone in their party). Those names
need to show up in the admin dashboard and let door staff check people in by
name at the security check-in page.

## New Tables

### `rsvp_guests`
One row per named person attached to an RSVP.
- `id` (uuid, pk)
- `rsvp_id` (uuid, references rsvps ON DELETE CASCADE) — which RSVP this person belongs to
- `guest_id` (uuid, references guests ON DELETE CASCADE) — denormalized household/access-code id,
  copied from the parent RSVP so the check-in page can query check-in state with a single join
- `full_name` (text, not null)
- `guest_type` ('adult' | 'child')
- `sort_order` (int) — preserves the order names were entered in
- `created_at`

### `checkin_events` (created here if it doesn't already exist)
This table is used by /public/checkin/index.html but had no migration file in
the repo (it was likely created by hand in the Supabase SQL editor). This
migration adds it with `CREATE TABLE IF NOT EXISTS` so running it is safe
whether or not it already exists, and then adds the new `rsvp_guest_id` column
so a check-in can be tied to one specific named guest instead of just being an
anonymous headcount tick against the household.

## Behavior changes
- A person can only be checked in once: a partial unique index on
  `checkin_events.rsvp_guest_id` (where not null) prevents double check-ins
  of the same named guest.
- Old-style household-level check-ins (`rsvp_guest_id IS NULL`) keep working
  exactly as before, so parties that RSVP'd before this feature shipped (or
  who never filled in names) still check in fine as an anonymous headcount.

## Security
Same permissive, access-code-based model as the rest of this app (no real
auth session — RLS is effectively open and the app enforces access on the
client + via SECURITY DEFINER RPCs). `rsvp_guests` and `checkin_events` get
the same anon/authenticated "true" policies as `rsvps`, `guests`, etc.

Safe to run more than once.
*/

-- ============================================================
-- 1. rsvp_guests table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.rsvp_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rsvp_id uuid NOT NULL REFERENCES public.rsvps(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  guest_type text NOT NULL DEFAULT 'adult' CHECK (guest_type IN ('adult', 'child')),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rsvp_guests_rsvp_id_idx ON public.rsvp_guests(rsvp_id);
CREATE INDEX IF NOT EXISTS rsvp_guests_guest_id_idx ON public.rsvp_guests(guest_id);

ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_rsvp_guests" ON public.rsvp_guests;
CREATE POLICY "select_all_rsvp_guests" ON public.rsvp_guests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_rsvp_guests" ON public.rsvp_guests;
CREATE POLICY "insert_rsvp_guests" ON public.rsvp_guests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_rsvp_guests" ON public.rsvp_guests;
CREATE POLICY "update_rsvp_guests" ON public.rsvp_guests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_rsvp_guests" ON public.rsvp_guests;
CREATE POLICY "delete_rsvp_guests" ON public.rsvp_guests FOR DELETE
  TO anon, authenticated USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvp_guests TO anon, authenticated;

-- ============================================================
-- 2. checkin_events table (create if it doesn't already exist)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.checkin_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  checked_in_at timestamptz DEFAULT now()
);

ALTER TABLE public.checkin_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_checkin_events" ON public.checkin_events;
CREATE POLICY "select_all_checkin_events" ON public.checkin_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_checkin_events" ON public.checkin_events;
CREATE POLICY "insert_checkin_events" ON public.checkin_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_checkin_events" ON public.checkin_events;
CREATE POLICY "update_checkin_events" ON public.checkin_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_checkin_events" ON public.checkin_events;
CREATE POLICY "delete_checkin_events" ON public.checkin_events FOR DELETE
  TO anon, authenticated USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkin_events TO anon, authenticated;

-- ============================================================
-- 3. Link check-ins to a specific named guest
-- ============================================================

ALTER TABLE public.checkin_events
  ADD COLUMN IF NOT EXISTS rsvp_guest_id uuid REFERENCES public.rsvp_guests(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS checkin_events_rsvp_guest_id_idx ON public.checkin_events(rsvp_guest_id);

-- A named guest can only be checked in once at a time.
DROP INDEX IF EXISTS checkin_events_rsvp_guest_id_unique;
CREATE UNIQUE INDEX checkin_events_rsvp_guest_id_unique
  ON public.checkin_events (rsvp_guest_id)
  WHERE rsvp_guest_id IS NOT NULL;
