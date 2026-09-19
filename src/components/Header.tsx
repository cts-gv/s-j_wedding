import { useEffect, useState } from 'react';
import { Menu, X, Heart, LogOut, Shield } from 'lucide-react';
import { useAccess } from '@/context/AccessContext';

interface HeaderProps {
  onOpenAdmin?: () => void;
}

const NAV_LINKS = [
  { label: 'Our Story', href: '#story' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'In Memory', href: '#memory' },
  { label: 'Wedding Party', href: '#party' },
  { label: 'Venue', href: '#venue' },
  { label: 'Travel', href: '#travel' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'Notes', href: '#notes' },
  { label: 'After Party', href: '#after' },
];

export function Header({ onOpenAdmin }: HeaderProps = {}) {
  const { guest, lock } = useAccess();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`flex items-center gap-2 transition-colors ${
            scrolled ? 'text-wine-700' : 'text-cream-50'
          }`}
        >
          <Heart size={20} className="text-gold-500" fill="currentColor" />
          <span className="font-display text-xl tracking-wide">
            Sunshine <span className="text-gold-500 font-light">&amp;</span> Jose
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`text-sm font-body font-medium transition-colors hover:text-gold-500 ${
                scrolled ? 'text-warmgray-600' : 'text-cream-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {guest?.is_admin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-sm font-body font-medium bg-sapphire-600 hover:bg-sapphire-700 text-cream-50 rounded-full px-4 py-2 transition-colors"
            >
              <Shield size={15} />
              Admin
            </button>
          )}
          {guest?.full_name && (
            <span
              className={`text-sm font-body ${
                scrolled ? 'text-warmgray-600' : 'text-cream-100'
              }`}
            >
              {guest.full_name}
            </span>
          )}
          <button
            onClick={lock}
            className={`flex items-center gap-1.5 text-sm font-body font-medium rounded-full px-4 py-2 transition-colors ${
              scrolled
                ? 'text-wine-700 hover:bg-wine-50'
                : 'bg-cream-50/15 text-cream-50 hover:bg-cream-50/25'
            }`}
          >
            <LogOut size={15} />
            Exit
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`lg:hidden ${scrolled ? 'text-wine-700' : 'text-cream-50'}`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? 'max-h-[720px] mt-3' : 'max-h-0'
        }`}
      >
        <nav className="bg-cream-50 rounded-2xl mx-4 shadow-xl border border-cream-200 p-4 flex flex-col gap-1">
          {guest?.full_name && (
            <>
              <div className="px-4 pt-1 pb-2">
                <p className="text-xs font-body uppercase tracking-wider text-warmgray-500">
                  Signed in as
                </p>
                <p className="font-display text-lg text-wine-700 leading-tight">
                  {guest.full_name}
                </p>
              </div>
              <div className="h-px bg-cream-200 mb-1" />
            </>
          )}
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left px-4 py-2.5 rounded-lg font-body text-warmgray-700 hover:bg-cream-100 hover:text-wine-700 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="h-px bg-cream-200 my-2" />
          {guest?.is_admin && onOpenAdmin && (
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left px-4 py-2.5 rounded-lg font-body text-sapphire-700 hover:bg-sapphire-50 transition-colors flex items-center gap-2"
            >
              <Shield size={16} /> Admin Dashboard
            </button>
          )}
          <button
            onClick={() => {
              setMenuOpen(false);
              lock();
            }}
            className="text-left px-4 py-2.5 rounded-lg font-body text-wine-700 hover:bg-wine-50 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} /> Exit Site
          </button>
        </nav>
      </div>
    </header>
  );
}
