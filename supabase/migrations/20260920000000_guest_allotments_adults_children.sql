/*
# Guest allotments: adults + children, meal preference removed

## Overview
Each access code now has an allotment of how many ADULTS and how many CHILDREN
(12 and under) the guest may RSVP for. The RSVP form uses these limits, and a
database trigger enforces them so they can't be bypassed.

## Changes
1. guests: new columns `max_adults` (default 1) and `max_children` (default 0).
2. rsvps: new columns `adults` and `children`. `number_of_guests` is kept and
   always equals adults + children (so older data and reports keep working).
3. Existing RSVPs are backfilled (all counted as adults), and any guest whose
   existing RSVP is bigger than the default allotment is raised to fit it.
4. validate_access_code() / get_guest_by_id() also return max_adults / max_children.
5. Trigger `enforce_rsvp_allotment` rejects an RSVP that exceeds the allotment.
6. The old `meal_preference` column is left in place (unused) so no data is lost.

Safe to run more than once.
*/

-- 1. Allotments on guests
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS max_adults integer NOT NULL DEFAULT 1;
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS max_children integer NOT NULL DEFAULT 0;

-- 2. Adults / children on rsvps
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS adults integer NOT NULL DEFAULT 1;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS children integer NOT NULL DEFAULT 0;

-- 3. Backfill existing RSVPs (old "number of guests" -> adults)
UPDATE public.rsvps
SET adults = number_of_guests, children = 0
WHERE adults = 1 AND children = 0 AND number_of_guests > 1;

UPDATE public.guests g
SET max_adults = GREATEST(g.max_adults, r.adults),
    max_children = GREATEST(g.max_children, r.children)
FROM public.rsvps r
WHERE r.guest_id = g.id;

-- 4. RPCs return the allotment
DROP FUNCTION IF EXISTS public.validate_access_code(text);
CREATE FUNCTION public.validate_access_code(input_code text)
RETURNS TABLE(id uuid, full_name text, is_admin boolean, welcome_note text, max_adults integer, max_children integer)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT g.id, g.full_name, g.is_admin, g.welcome_note, g.max_adults, g.max_children
  FROM public.guests g
  WHERE g.access_code = upper(trim(input_code))
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.validate_access_code(text) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.get_guest_by_id(uuid);
CREATE FUNCTION public.get_guest_by_id(guest_id uuid)
RETURNS TABLE(id uuid, full_name text, is_admin boolean, welcome_note text, max_adults integer, max_children integer)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT g.id, g.full_name, g.is_admin, g.welcome_note, g.max_adults, g.max_children
  FROM public.guests g
  WHERE g.id = guest_id
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_guest_by_id(uuid) TO anon, authenticated;

-- 5. Enforce the allotment on every RSVP save
CREATE OR REPLACE FUNCTION public.enforce_rsvp_allotment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_adults integer;
  allowed_children integer;
BEGIN
  IF NEW.adults < 0 OR NEW.children < 0 THEN
    RAISE EXCEPTION 'Guest counts cannot be negative.';
  END IF;

  IF NEW.guest_id IS NOT NULL THEN
    SELECT max_adults, max_children INTO allowed_adults, allowed_children
    FROM public.guests WHERE id = NEW.guest_id;

    IF FOUND THEN
      IF NEW.adults > allowed_adults THEN
        RAISE EXCEPTION 'Your invitation allows up to % adult(s).', allowed_adults;
      END IF;
      IF NEW.children > allowed_children THEN
        RAISE EXCEPTION 'Your invitation allows up to % child(ren).', allowed_children;
      END IF;
    END IF;
  END IF;

  NEW.number_of_guests := NEW.adults + NEW.children;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_rsvp_allotment ON public.rsvps;
CREATE TRIGGER enforce_rsvp_allotment
  BEFORE INSERT OR UPDATE ON public.rsvps
  FOR EACH ROW EXECUTE FUNCTION public.enforce_rsvp_allotment();
