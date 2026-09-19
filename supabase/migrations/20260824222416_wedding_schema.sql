/*
# Wedding website schema

1. New Tables
- `rsvps` — one RSVP row per authenticated guest.
  - `id`, `user_id`, `full_name`, `email`, `attending`, `number_of_guests`,
    `meal_preference`, `dietary_notes`, `message`, `created_at`, `updated_at`
- `special_notes` — heartfelt notes from guests to the couple.
  - `id`, `user_id`, `author_name`, `note`, `created_at`
- `guest_photos` — metadata for photos uploaded to the wedding-photos storage bucket.
  - `id`, `user_id`, `uploader_name`, `storage_path`, `caption`, `is_couple_upload`, `created_at`

2. Security
- RLS enabled on all three tables.
- RSVP: owner-scoped CRUD (auth.uid() = user_id), one per user via UNIQUE(user_id).
- Notes & Photos: SELECT open to all authenticated (shared wedding community),
  INSERT/UPDATE/DELETE owner-scoped.

3. Storage
- Public bucket `wedding-photos` for guest/couple uploads.
- Authenticated can upload; anyone can read; owners can update/delete.
*/

CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  attending text NOT NULL CHECK (attending IN ('yes','no','maybe')),
  number_of_guests int NOT NULL DEFAULT 1,
  meal_preference text,
  dietary_notes text,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_rsvp" ON rsvps;
CREATE POLICY "select_own_rsvp" ON rsvps FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_rsvp" ON rsvps;
CREATE POLICY "insert_own_rsvp" ON rsvps FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_rsvp" ON rsvps;
CREATE POLICY "update_own_rsvp" ON rsvps FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_rsvp" ON rsvps;
CREATE POLICY "delete_own_rsvp" ON rsvps FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS special_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  note text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE special_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_notes" ON special_notes;
CREATE POLICY "select_all_notes" ON special_notes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_note" ON special_notes;
CREATE POLICY "insert_own_note" ON special_notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_note" ON special_notes;
CREATE POLICY "update_own_note" ON special_notes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_note" ON special_notes;
CREATE POLICY "delete_own_note" ON special_notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS guest_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  uploader_name text NOT NULL,
  storage_path text NOT NULL,
  caption text,
  is_couple_upload boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guest_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_photos" ON guest_photos;
CREATE POLICY "select_all_photos" ON guest_photos FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_photo" ON guest_photos;
CREATE POLICY "insert_own_photo" ON guest_photos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_photo" ON guest_photos;
CREATE POLICY "update_own_photo" ON guest_photos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_photo" ON guest_photos;
CREATE POLICY "delete_own_photo" ON guest_photos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated can upload wedding photos" ON storage.objects;
CREATE POLICY "Authenticated can upload wedding photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Anyone can read wedding photos" ON storage.objects;
CREATE POLICY "Anyone can read wedding photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Owners can delete wedding photos" ON storage.objects;
CREATE POLICY "Owners can delete wedding photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'wedding-photos' AND owner = auth.uid());

DROP POLICY IF EXISTS "Owners can update wedding photos" ON storage.objects;
CREATE POLICY "Owners can update wedding photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'wedding-photos' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'wedding-photos' AND owner = auth.uid());
