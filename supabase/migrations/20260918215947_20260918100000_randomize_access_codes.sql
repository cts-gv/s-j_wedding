/*
# Replace sequential access codes with random 6-char alphanumeric codes

## Overview
Replace all SUNSHINE-XXX codes with randomly generated 6-character
alphanumeric codes (A-Z, 0-9, no ambiguous chars like O/0/I/1).
The admin code SUNSHINEADMIN is left untouched.

## Implementation
Uses a PL/pgSQL block to generate unique codes and update each guest row.
Excludes ambiguous characters (0, O, 1, I, L) for readability.
*/
DO $$
DECLARE
  g RECORD;
  new_code TEXT;
  chars TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  attempts INT;
BEGIN
  FOR g IN SELECT id FROM guests WHERE access_code != 'SUNSHINEADMIN' ORDER BY access_code LOOP
    attempts := 0;
    LOOP
      new_code := '';
      FOR i IN 1..6 LOOP
        new_code := new_code || substr(chars, floor(random() * length(chars))::int + 1, 1);
      END LOOP;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM guests WHERE access_code = new_code AND id != g.id);
      attempts := attempts + 1;
      IF attempts > 100 THEN
        RAISE EXCEPTION 'Could not generate unique code after 100 attempts';
      END IF;
    END LOOP;
    UPDATE guests SET access_code = new_code, updated_at = now() WHERE id = g.id;
  END LOOP;
END $$;
