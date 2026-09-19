import { useState, useEffect } from 'react';
import { AccessProvider, useAccess } from '@/context/AccessContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { SplashScreen } from '@/components/SplashScreen';
import { AdminSplashScreen } from '@/components/AdminSplashScreen';
import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { GuestWelcome } from '@/components/sections/GuestWelcome';
import { Story } from '@/components/sections/Story';
import { Gallery } from '@/components/sections/Gallery';
import { InMemory } from '@/components/sections/InMemory';
import { WeddingParty } from '@/components/sections/WeddingParty';
import { Venue } from '@/components/sections/Venue';
import { Travel } from '@/components/sections/Travel';
import { Rsvp } from '@/components/sections/Rsvp';
import { Notes } from '@/components/sections/Notes';
import { AfterParty } from '@/components/sections/AfterParty';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';

function useIsAdminRoute() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    typeof window !== 'undefined' && window.location.hash === '#admin',
  );

  useEffect(() => {
    function onHashChange() {
      setIsAdminRoute(window.location.hash === '#admin');
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return isAdminRoute;
}

function AppContent() {
  const { guest, loading, lock } = useAccess();
  const isAdminRoute = useIsAdminRoute();

  function adminSignOut() {
    lock();
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="h-10 w-10 rounded-full border-2 border-wine-200 border-t-wine-600 animate-spin" />
      </div>
    );
  }

  // Admin route: separate login flow, goes straight to dashboard
  if (isAdminRoute) {
    if (!guest) {
      return <AdminSplashScreen />;
    }
    if (guest.is_admin) {
      return <AdminDashboard onBack={adminSignOut} />;
    }
    // Non-admin logged in on #admin route — show access denied
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100/60">
        <div className="text-center">
          <p className="text-warmgray-500 font-body">This area is for the couple only.</p>
          <button
            onClick={adminSignOut}
            className="mt-4 text-wine-600 hover:text-wine-700 font-body text-sm underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Guest site
  if (!guest) {
    return <SplashScreen />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <GuestWelcome />
        <Story />
        <Gallery />
        <InMemory />
        <WeddingParty />
        <Venue />
        <Travel />
        <Rsvp />
        <Notes />
        <AfterParty />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AccessProvider>
        <AppContent />
      </AccessProvider>
    </LanguageProvider>
  );
}

export default App;
