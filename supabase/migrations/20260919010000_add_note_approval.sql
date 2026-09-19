/*
# Add approval workflow for guest notes

## Overview
Notes to the couple now need approval before they are shown to other guests,
just like guest photos.

## Changes
1. New column: `special_notes.is_approved` (boolean, NOT NULL, default false)
   - New notes start as pending (false).
2. Notes that already exist when this runs are marked approved, so nothing
   disappears. The backfill only happens the first time the column is created,
   so running this file again will NOT approve pending notes.

## Security
- Same approach as photos: the site hides unapproved notes and the admin
  dashboard approves or rejects them. No RLS policy changes.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'special_notes' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE public.special_notes ADD COLUMN is_approved boolean NOT NULL DEFAULT false;
    UPDATE public.special_notes SET is_approved = true;
  END IF;
END $$;
