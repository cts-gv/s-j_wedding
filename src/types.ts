export type Attending = 'yes' | 'no' | 'maybe';

export interface Rsvp {
  id: string;
  guest_id: string | null;
  full_name: string;
  email: string;
  attending: Attending;
  /** Always adults + children (kept in sync by a database trigger). */
  number_of_guests: number;
  adults: number;
  children: number;
  dietary_notes: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpecialNote {
  id: string;
  guest_id: string | null;
  author_name: string;
  note: string;
  is_approved: boolean;
  created_at: string;
}

export interface GuestPhoto {
  id: string;
  guest_id: string | null;
  uploader_name: string;
  storage_path: string;
  caption: string | null;
  is_couple_upload: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Guest {
  id: string;
  access_code: string;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  welcome_note: string | null;
  /** How many adults this access code may RSVP for. */
  max_adults: number;
  /** How many children (12 and under) this access code may RSVP for. */
  max_children: number;
  created_at: string;
  updated_at: string;
}
