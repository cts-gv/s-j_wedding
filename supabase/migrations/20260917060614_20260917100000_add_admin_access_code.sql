/*
# Add separate admin access code

## Overview
The couple currently uses SUNSHINE-001 (a guest code) to access the admin
dashboard. This creates a dedicated admin entry that doesn't consume a guest
slot, so all 300 guest codes remain available for guests.

## Changes
1. Insert a new row in guests with access_code 'SUNSHINEADMIN', is_admin = true,
   and full_name = 'Sunshine & Jose'. This code is for admin dashboard access
   only — it won't be part of the guest code pool.
2. Remove is_admin from SUNSHINE-001 so it goes back to being a regular guest
   code.
*/

-- Insert the dedicated admin code
INSERT INTO guests (access_code, full_name, is_admin)
VALUES ('SUNSHINEADMIN', 'Sunshine & Jose', true)
ON CONFLICT (access_code) DO UPDATE
  SET is_admin = true,
      full_name = 'Sunshine & Jose',
      updated_at = now();

-- Restore SUNSHINE-001 as a regular guest code
UPDATE guests SET is_admin = false, updated_at = now()
WHERE access_code = 'SUNSHINE-001';
