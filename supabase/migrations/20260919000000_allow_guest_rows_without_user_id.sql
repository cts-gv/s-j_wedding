/*
# Let access-code guests save RSVPs, notes and photos

## Problem
The original schema required a Supabase login user on every row (`user_id NOT NULL`).
Guests now sign in with an access code instead, so there is no Supabase user and
`user_id` is empty. Saving an RSVP, a note or a photo failed with:
  null value in column "user_id" of relation "rsvps" violates not-null constraint

## Fix
Make `user_id` optional on the three tables guests write to. Rows are tied to a guest
through `guest_id`, which is what the app already sends.

Safe to run more than once.
*/

ALTER TABLE IF EXISTS public.rsvps         ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.special_notes ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.guest_photos  ALTER COLUMN user_id DROP NOT NULL;
