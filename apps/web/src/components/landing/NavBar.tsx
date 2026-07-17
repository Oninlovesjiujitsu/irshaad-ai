'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Mic, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const navItems = [
  { name: 'Home', href: '/#hero' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Capabilities', href: '/#features' },
  { name: 'Feedback', href: '/#analytics' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isScrollingRef = useRef(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy logic to monitor sections on the home page
  useEffect(() => {
    if (pathname !== '/') return;

    const sections = ['hero', 'how-it-works', 'features', 'analytics'];
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -55% 0px', // Trigger when section is in the primary viewing area
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      return pathname === '/' && activeSection === sectionId;
    }
    return pathname === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.substring(2);
      const el = document.getElementById(id);
      if (el) {
        isScrollingRef.current = true;
        setActiveSection(id);
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'py-3 bg-[#051109]/50 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.15)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/#hero"
          onClick={(e) => handleNavClick(e, '/#hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(133,255,0,0.15)] group-hover:shadow-[0_0_25px_rgba(133,255,0,0.25)] transition-all duration-300">
            <Mic className="w-5 h-5 text-black font-bold" />
          </div>
          <span className="relative text-xl font-extrabold z-10 tracking-tight text-white">
            Irshaad <span className="text-primary">AI</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = isLinkActive(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative text-sm font-semibold py-1.5 transition-all duration-300 cursor-pointer ${isActive ? 'text-primary font-bold' : 'text-foreground/75 hover:text-foreground'
                    }`}
                >
                  {item.name}
                  {/* Sliding underline */}
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </a>
              );
            })}
          </div>

          <div className="h-4 w-px bg-white/[0.08]" />

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-foreground/75 hover:text-foreground transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-medium transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-foreground/75 hover:text-foreground transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Practice Free
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen((p) => !p)}
            className="p-2 text-foreground z-50 cursor-pointer rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] transition-all"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#051109]/75 backdrop-blur-2xl border-b border-white/[0.08] py-6 px-6 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            {navItems.map((item) => {
              const isActive = isLinkActive(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`text-base font-bold py-1 transition-all duration-300 cursor-pointer ${isActive ? 'text-primary' : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {item.name}
                </a>
              );
            })}

            <div className="w-full h-px bg-white/[0.08] my-2" />

            {/* Auth Buttons for Mobile */}
            <div className="flex flex-col items-center gap-4 w-full">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-base font-bold text-slate-300 hover:text-white transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full max-w-[200px] py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-base font-bold text-slate-300 hover:text-white transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:shadow-glow transition-all duration-300 w-full max-w-[200px] text-center"
                  >
                    Practice Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
