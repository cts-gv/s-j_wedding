/*
# Fix admin dashboard access

## Problems
1. The `guests` table has RLS enabled with NO policies, which blocks all direct
   SELECT/INSERT/UPDATE/DELETE from the anon client. The admin dashboard tries
   to read and update the guests table directly, so it gets empty results and
   silent write failures.
2. None of the 300 seeded access codes have `is_admin = true`, so no guest can
   reach the admin dashboard — the header never shows the Admin button.

## Fixes
1. Add permissive RLS policies on `guests` for all CRUD operations, matching
   the same pattern used on rsvps, special_notes, and guest_photos. This is
   consistent with the app's security model (no auth session, client-side
   admin check via the is_admin flag returned by SECURITY DEFINER functions).
2. Set the first access code (SUNSHINE-001) as admin so the couple can access
   the dashboard immediately. They can toggle other codes as admin from within
   the dashboard.
*/

-- Add permissive policies on guests table (same pattern as other tables)
CREATE POLICY "select_all_guests" ON guests FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_guest" ON guests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_guest" ON guests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_guest" ON guests FOR DELETE
  TO anon, authenticated USING (true);

-- Set the first code as admin so the couple can access the dashboard
UPDATE guests SET is_admin = true, updated_at = now()
WHERE access_code = 'SUNSHINE-001';
