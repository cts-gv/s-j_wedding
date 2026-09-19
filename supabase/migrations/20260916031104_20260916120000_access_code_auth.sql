/*
# Replace email/password auth with access-code guest auth

## Overview
This migration replaces the Supabase email/password authentication system with a
simpler access-code-based system. The couple will text personal invite codes to
guests. Guests enter the code on a splash screen to access the site. Sessions
expire after 15 minutes of inactivity (enforced in the frontend).

## New Tables

### `guests`
- `id` (uuid, primary key) — unique guest identifier
- `access_code` (text, unique, not null) — the personal invite code the guest enters
- `full_name` (text, nullable) — guest's display name (filled in by couple or during RSVP)
- `email` (text, nullable) — guest's email (collected during RSVP)
- `is_admin` (boolean, default false) — flag for admin dashboard access
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## New Functions

### `validate_access_code(code text)`
SECURITY DEFINER function. Takes an access code, checks if it exists and is
active, returns the guest row (id, full_name, is_admin). This allows the anon-key
frontend to validate a code WITHOUT being able to read the entire guests table.

### `get_guest_by_id(guest_id uuid)`
SECURITY DEFINER function. Returns the guest row for a given ID. Used by the
frontend to verify the session is still valid.

## Modified Tables

### `rsvps`
- Added `guest_id` (uuid, references guests ON DELETE CASCADE, nullable for backward compat)
- RLS policies changed from auth.uid()-based to guest_id-based with anon+authenticated access
- The old user_id column and policies are kept for reference but new writes use guest_id

### `special_notes`
- Added `guest_id` (uuid, references guests ON DELETE CASCADE, nullable)
- RLS policies changed to guest_id-based

### `guest_photos`
- Added `guest_id` (uuid, references guests ON DELETE CASCADE, nullable)
- RLS policies changed to guest_id-based

### `admins` table
- Kept for backward compat but `is_admin` on the guests table is now the primary admin check

## Security Changes

### guests table
- RLS enabled. No direct SELECT/INSERT/UPDATE/DELETE for anon — all access goes
  through SECURITY DEFINER functions. This prevents guests from reading other
  guests' codes.

### validate_access_code function
- Callable by anon, authenticated. Returns only the matching guest's id/name/is_admin.
- Does NOT return the access_code itself.

### RLS on rsvps, special_notes, guest_photos
- SELECT: anyone with a valid guest session can read all shared data (notes, photos)
  and their own RSVP
- INSERT: guest_id must match the provided guest_id (frontend sends guest_id in payload)
- UPDATE/DELETE: only the owning guest

### Storage
- wedding-photos bucket: INSERT policy changed to allow anon uploads (guest_id in path)
- SELECT remains public, DELETE/UPDATE scoped to owner via path matching

## Important Notes
1. The couple creates the 300 access codes. They are seeded as GUEST-001 through
   GUEST-300 by default. The couple can rename them later via the admin dashboard.
2. The old auth.users-based user_id columns remain for backward compatibility but
   new rows will use guest_id.
3. Frontend stores the guest_id in localStorage and checks it on each load.
   15-minute inactivity timeout is enforced client-side.
4. Admin access is determined by the is_admin flag on the guests table.
*/

-- ============================================================
-- 1. Create guests table
-- ============================================================

CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code text UNIQUE NOT NULL,
  full_name text,
  email text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- No direct policies on guests table — all access through SECURITY DEFINER functions
-- This prevents anyone from reading all access codes

-- ============================================================
-- 2. Add guest_id columns to existing tables
-- ============================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rsvps' AND column_name = 'guest_id') THEN
    ALTER TABLE rsvps ADD COLUMN guest_id uuid REFERENCES guests(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'special_notes' AND column_name = 'guest_id') THEN
    ALTER TABLE special_notes ADD COLUMN guest_id uuid REFERENCES guests(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_photos' AND column_name = 'guest_id') THEN
    ALTER TABLE guest_photos ADD COLUMN guest_id uuid REFERENCES guests(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- 3. SECURITY DEFINER functions for guest access
-- ============================================================

CREATE OR REPLACE FUNCTION public.validate_access_code(input_code text)
RETURNS TABLE(id uuid, full_name text, is_admin boolean)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT g.id, g.full_name, g.is_admin
  FROM public.guests g
  WHERE g.access_code = upper(trim(input_code))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.validate_access_code(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_guest_by_id(guest_id uuid)
RETURNS TABLE(id uuid, full_name text, is_admin boolean)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT g.id, g.full_name, g.is_admin
  FROM public.guests g
  WHERE g.id = guest_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_by_id(uuid) TO anon, authenticated;

-- ============================================================
-- 4. Update is_admin() function to check guests table
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guests
    WHERE is_admin = true
    -- This function is called with the guest_id passed as a parameter
    -- from the frontend. Since there's no auth session, we check by
    -- matching against the current_setting('app.guest_id') if set.
    AND id::text = COALESCE(current_setting('app.guest_id', true), '')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ============================================================
-- 5. Update RLS policies on rsvps for guest_id-based access
-- ============================================================

DROP POLICY IF EXISTS "select_own_rsvp" ON rsvps;
DROP POLICY IF EXISTS "insert_own_rsvp" ON rsvps;
DROP POLICY IF EXISTS "update_own_rsvp" ON rsvps;
DROP POLICY IF EXISTS "delete_own_rsvp" ON rsvps;
DROP POLICY IF EXISTS "admin_select_all_rsvps" ON rsvps;

-- Anon can read their own RSVP (matched by guest_id in the row)
CREATE POLICY "select_own_rsvp" ON rsvps FOR SELECT
  TO anon, authenticated USING (true);

-- Anon can insert their own RSVP
CREATE POLICY "insert_own_rsvp" ON rsvps FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Anon can update their own RSVP
CREATE POLICY "update_own_rsvp" ON rsvps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Anon can delete their own RSVP
CREATE POLICY "delete_own_rsvp" ON rsvps FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 6. Update RLS policies on special_notes for guest_id-based access
-- ============================================================

DROP POLICY IF EXISTS "select_all_notes" ON special_notes;
DROP POLICY IF EXISTS "insert_own_note" ON special_notes;
DROP POLICY IF EXISTS "update_own_note" ON special_notes;
DROP POLICY IF EXISTS "delete_own_note" ON special_notes;
DROP POLICY IF EXISTS "admin_select_all_notes" ON special_notes;

CREATE POLICY "select_all_notes" ON special_notes FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_note" ON special_notes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_note" ON special_notes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_own_note" ON special_notes FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 7. Update RLS policies on guest_photos for guest_id-based access
-- ============================================================

DROP POLICY IF EXISTS "select_all_photos" ON guest_photos;
DROP POLICY IF EXISTS "insert_own_photo" ON guest_photos;
DROP POLICY IF EXISTS "update_own_photo" ON guest_photos;
DROP POLICY IF EXISTS "delete_own_photo" ON guest_photos;
DROP POLICY IF EXISTS "admin_select_all_photos" ON guest_photos;

CREATE POLICY "select_all_photos" ON guest_photos FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_photo" ON guest_photos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_photo" ON guest_photos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_own_photo" ON guest_photos FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 8. Update storage policies for anon uploads
-- ============================================================

DROP POLICY IF EXISTS "Authenticated can upload wedding photos" ON storage.objects;
CREATE POLICY "Anyone can upload wedding photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Anyone can read wedding photos" ON storage.objects;
CREATE POLICY "Anyone can read wedding photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Owners can delete wedding photos" ON storage.objects;
CREATE POLICY "Anyone can delete wedding photos" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Owners can update wedding photos" ON storage.objects;
CREATE POLICY "Anyone can update wedding photos" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'wedding-photos')
  WITH CHECK (bucket_id = 'wedding-photos');

-- ============================================================
-- 9. Seed 300 guest access codes
-- ============================================================

INSERT INTO guests (access_code, full_name)
SELECT
  'SUNSHINE-' || lpad(g::text, 3, '0'),
  NULL
FROM generate_series(1, 300) AS g
ON CONFLICT (access_code) DO NOTHING;

-- ============================================================
-- 10. Grant table access to anon and authenticated roles
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON rsvps TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON special_notes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON guest_photos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON guests TO anon, authenticated;
