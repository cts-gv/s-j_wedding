import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';

export interface Guest {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  welcome_note: string | null;
  max_adults: number;
  max_children: number;
}

export interface UnlockResult {
  /** English error message (used by the admin login). */
  error: string | null;
  /** Machine-readable reason, so the guest splash screen can show it in the guest's language. */
  errorCode?: 'generic' | 'invalid';
}

interface AccessContextValue {
  guest: Guest | null;
  loading: boolean;
  unlock: (code: string) => Promise<UnlockResult>;
  lock: () => void;
  refreshActivity: () => void;
}

const ACCESS_CONTEXT = createContext<AccessContextValue | undefined>(undefined);

const STORAGE_KEY = 'wedding_guest';
const ACTIVITY_KEY = 'wedding_last_activity';
const TIMEOUT_MS = 15 * 60 * 1000;

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'wheel',
];

export function AccessProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lock = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    setGuest(null);
  }, []);

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      lock();
    }, TIMEOUT_MS);
  }, [lock]);

  const refreshActivity = useCallback(() => {
    if (guest) {
      localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      startTimeout();
    }
  }, [guest, startTimeout]);

  // On mount: check if a valid guest session exists in localStorage
  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    const lastActivity = Number(localStorage.getItem(ACTIVITY_KEY) ?? '0');
    const elapsed = Date.now() - lastActivity;

    if (!storedId) {
      setLoading(false);
      return;
    }

    // If more than 15 minutes have passed since last activity, expire the session
    if (elapsed >= TIMEOUT_MS) {
      lock();
      setLoading(false);
      return;
    }

    // Validate the stored guest ID against the database
    supabase
      .rpc('get_guest_by_id', { guest_id: storedId })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          lock();
        } else {
          const g = data[0] as Guest;
          setGuest(g);
          startTimeout();
        }
        setLoading(false);
      });
  }, [lock, startTimeout]);

  // Listen for user activity to reset the timeout
  useEffect(() => {
    if (!guest) return;

    const onActivity = () => {
      refreshActivity();
    };

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true }),
    );

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
    };
  }, [guest, refreshActivity]);

  // Check timeout on cross-tab changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && !e.newValue) {
        setGuest(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const unlock = useCallback(
    async (code: string): Promise<UnlockResult> => {
      const { data, error } = await supabase.rpc('validate_access_code', {
        input_code: code,
      });

      if (error) return { error: 'Something went wrong. Please try again.', errorCode: 'generic' };
      if (!data || data.length === 0) {
        return {
          error: 'That access code is not valid. Please check and try again.',
          errorCode: 'invalid',
        };
      }

      const g = data[0] as Guest;
      localStorage.setItem(STORAGE_KEY, g.id);
      localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      setGuest(g);
      startTimeout();
      return { error: null };
    },
    [startTimeout],
  );

  return (
    <ACCESS_CONTEXT.Provider value={{ guest, loading, unlock, lock, refreshActivity }}>
      {children}
    </ACCESS_CONTEXT.Provider>
  );
}

export function useAccess() {
  const ctx = useContext(ACCESS_CONTEXT);
  if (!ctx) throw new Error('useAccess must be used within AccessProvider');
  return ctx;
}
