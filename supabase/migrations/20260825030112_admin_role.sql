/*
# Admin role support for wedding website

1. New Tables
- `admins` — maps an auth.users id to an admin flag.
  - `user_id` (uuid, primary key, references auth.users ON DELETE CASCADE)
  - `created_at` (timestamptz)

2. New Functions
- `is_admin()` — returns true if the calling auth.uid() exists in the admins table.
  SECURITY DEFINER, stable, callable by authenticated. Used in RLS policies so
  admin users can read ALL rsvps and special_notes (not just their own).

3. Security changes
- RLS enabled on `admins` (owner can read own row).
- `rsvps` gets a new admin SELECT policy allowing is_admin() to read all rows.
- `special_notes` gets a new admin SELECT policy allowing is_admin() to read all rows.

4. Important notes
- To grant admin access, insert a row: INSERT INTO admins (user_id) VALUES ('<auth-user-id>');
- The existing owner-scoped policies remain intact; admin policies are additive.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_admin" ON admins;
CREATE POLICY "select_own_admin" ON admins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- is_admin() helper: checks if current user is in admins table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Admin can read ALL rsvps (additive to existing owner-scoped policy)
DROP POLICY IF EXISTS "admin_select_all_rsvps" ON rsvps;
CREATE POLICY "admin_select_all_rsvps" ON rsvps FOR SELECT
  TO authenticated USING (public.is_admin());

-- Admin can read ALL special_notes (additive to existing policy)
DROP POLICY IF EXISTS "admin_select_all_notes" ON special_notes;
CREATE POLICY "admin_select_all_notes" ON special_notes FOR SELECT
  TO authenticated USING (public.is_admin());

-- Admin can read ALL guest_photos metadata (additive)
DROP POLICY IF EXISTS "admin_select_all_photos" ON guest_photos;
CREATE POLICY "admin_select_all_photos" ON guest_photos FOR SELECT
  TO authenticated USING (public.is_admin());
