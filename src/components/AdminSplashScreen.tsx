import { useState, useEffect } from 'react';
import { Heart, Loader2, KeyRound, AlertCircle, Shield } from 'lucide-react';
import { useAccess } from '@/context/AccessContext';
import { WEDDING_DATE_DISPLAY } from '@/constants';

const SPLASH_BG =
  'https://images.pexels.com/photos/15313106/pexels-photo-15313106.jpeg?auto=compress&cs=tinysrgb&w=1600';

export function AdminSplashScreen() {
  const { unlock } = useAccess();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && code.trim()) {
        void handleSubmit();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleSubmit() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    const { error: err } = await unlock(code.trim());
    setLoading(false);
    if (err) {
      setError(err);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={SPLASH_BG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warmgray-900/70 via-warmgray-900/60 to-warmgray-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-cream-50/95 backdrop-blur-md rounded-3xl shadow-2xl border border-cream-200 overflow-hidden">
          {/* Header */}
          <div className="bg-sapphire-800 px-6 py-7 text-center text-cream-50">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart size={20} className="text-gold-400" fill="currentColor" />
              <span className="font-display text-xl tracking-wide">
                Sunshine <span className="text-gold-400 font-light">&amp;</span> Jose
              </span>
              <Heart size={20} className="text-gold-400" fill="currentColor" />
            </div>
            <p className="text-gold-300 text-xs uppercase tracking-[0.3em]">
              {WEDDING_DATE_DISPLAY}
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8 sm:px-8 sm:py-9">
            <div className="text-center mb-6">
              <div className="h-14 w-14 mx-auto rounded-full bg-sapphire-100 flex items-center justify-center mb-4">
                <Shield size={26} className="text-sapphire-700" />
              </div>
              <h2 className="font-display text-2xl text-sapphire-800">Admin Dashboard</h2>
              <p className="mt-2.5 text-warmgray-500 font-body text-sm leading-relaxed">
                Enter the admin access code to manage RSVPs, guest codes, and photos.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block">
                  <span className="block text-xs font-body font-medium text-warmgray-600 mb-1.5 uppercase tracking-wide">
                    Admin Code
                  </span>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Admin code"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-warmgray-800 font-body text-base text-center tracking-widest uppercase focus:outline-none focus:border-sapphire-400 focus:ring-2 focus:ring-sapphire-200 transition"
                  />
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-wine-700 bg-wine-50 rounded-lg px-4 py-2.5 border border-wine-200">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="font-body">{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !code.trim()}
                className="w-full bg-sapphire-700 hover:bg-sapphire-800 disabled:opacity-60 text-cream-50 font-body font-medium rounded-full py-3.5 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <KeyRound size={18} />
                )}
                Enter Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
