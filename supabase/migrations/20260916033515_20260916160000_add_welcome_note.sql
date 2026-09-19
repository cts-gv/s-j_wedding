/*
# Add welcome_note column to guests table

## Overview
Adds a `welcome_note` text column to the `guests` table so the couple can write
a personalized welcome message for each guest. When a guest enters their access
code on the splash screen, they'll see this note before entering the site.

## Changes
1. New column: `guests.welcome_note` (text, nullable)
2. Updated `validate_access_code()` to also return `welcome_note`
3. Updated `get_guest_by_id()` to also return `welcome_note`

## Security
- No RLS policy changes. The welcome_note is returned only for the validated
  guest's own row, same as full_name and is_admin.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'welcome_note') THEN
    ALTER TABLE guests ADD COLUMN welcome_note text;
  END IF;
END $$;

DROP FUNCTION IF EXISTS public.validate_access_code(text);
CREATE FUNCTION public.validate_access_code(input_code text)
RETURNS TABLE(id uuid, full_name text, is_admin boolean, welcome_note text)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT g.id, g.full_name, g.is_admin, g.welcome_note
  FROM public.guests g
  WHERE g.access_code = upper(trim(input_code))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.validate_access_code(text) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.get_guest_by_id(uuid);
CREATE FUNCTION public.get_guest_by_id(guest_id uuid)
RETURNS TABLE(id uuid, full_name text, is_admin boolean, welcome_note text)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT g.id, g.full_name, g.is_admin, g.welcome_note
  FROM public.guests g
  WHERE g.id = guest_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_by_id(uuid) TO anon, authenticated;
