/*
# Add photo approval workflow

## Overview
Guest-uploaded photos now require approval from the couple before they appear
in the public gallery. The couple can approve or reject photos from the admin
dashboard.

## Changes
1. New column: `guest_photos.is_approved` (boolean, default false)
   - Guest uploads default to false (pending review)
   - Couple uploads (is_couple_upload = true) default to true
2. Backfill: existing guest_photos rows are set to is_approved = true so
   previously uploaded photos remain visible.

## Security
- No RLS policy changes. The frontend filters by is_approved when displaying
  the public gallery. Admin sees all photos regardless of approval status.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_photos' AND column_name = 'is_approved') THEN
    ALTER TABLE guest_photos ADD COLUMN is_approved boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Backfill existing photos as approved so nothing disappears
UPDATE guest_photos SET is_approved = true WHERE is_approved = false AND is_couple_upload = true;

-- Set couple uploads to auto-approved going forward via a trigger
CREATE OR REPLACE FUNCTION public.auto_approve_couple_photos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_couple_upload = true THEN
    NEW.is_approved = true;
  END IF;
  RETURN NEW;
END;
$$;

GRANT EXECUTE ON FUNCTION public.auto_approve_couple_photos() TO anon, authenticated;

DROP TRIGGER IF EXISTS trg_auto_approve_couple_photos ON guest_photos;

CREATE TRIGGER trg_auto_approve_couple_photos
  BEFORE INSERT ON guest_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_approve_couple_photos();
