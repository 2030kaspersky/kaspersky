'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import Monogram from './Monogram';

type Props = {
  homePrefix?: string;
  observeSections?: boolean;
};

const navItems = [
  ['الرئيسية', 'home'],
  ['المشاريع', 'projects'],
  ['الخدمات', 'services'],
  ['الهوية الرقمية', 'identity'],
  ['أحدث الأعمال', 'latest'],
  ['تواصل', 'contact'],
];

export default function SiteHeader({
  homePrefix = '',
  observeSections = false,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    setLight(document.documentElement.classList.contains('light'));
  }, []);

  const scrollToSection = (id: string, behavior: ScrollBehavior = 'smooth') => {
    const target = document.getElementById(id);
    if (!target) return false;
    const headerOffset = 88;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior });
    return true;
  };

  useEffect(() => {
    if (!observeSections || homePrefix) return;
    const syncHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (!id) return;
      const run = () => scrollToSection(id, 'auto');
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(run)));
      } else {
        window.setTimeout(run, 80);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [observeSections, homePrefix]);

  useEffect(() => {
    if (!observeSections) return;
    const elements = navItems
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.08, 0.3, 0.6] }
    );
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [observeSections]);

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle('light', next);
    localStorage.setItem('portal-theme', next ? 'light' : 'dark');
  };

  const hrefFor = (id: string) =>
    id === 'home' ? homePrefix || '#home' : homePrefix + '#' + id;

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (homePrefix) return;
    event.preventDefault();
    const hash = '#' + id;
    window.history.pushState(null, '', hash);
    setMenuOpen(false);
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[color:var(--background-alpha)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a
          href={hrefFor('home')}
          onClick={event => handleNavClick(event, 'home')}
          className="flex min-w-0 items-center gap-3"
          aria-label="العودة إلى الرئيسية"
        >
          <Monogram className="h-11 w-11 shrink-0 text-[var(--primary)]" />
          <span className="min-w-0 leading-tight">
            <strong className="block truncate text-sm sm:text-base">
              الحسن الرقمي
            </strong>
            <span
              className="block truncate text-xs text-[var(--muted)]"
              dir="ltr"
            >
              alhassanm.sa
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="التنقل الرئيسي"
        >
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={hrefFor(id)}
              onClick={event => handleNavClick(event, id)}
              className={
                'rounded-md px-3 py-2 text-sm transition ' +
                (observeSections && active === id
                  ? 'bg-[var(--soft)] text-[var(--foreground)]'
                  : 'text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--foreground)]')
              }
            >
              {label}
            </a>
          ))}
          <a
            href='/gallery/'
            className='rounded-md px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--foreground)]'
          >
            معرض الأعمال
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="icon-button"
            aria-label={light ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
          >
            {light ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMenuOpen(value => !value)}
            className="icon-button lg:hidden"
            aria-expanded={menuOpen}
            aria-label="فتح قائمة التنقل"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 lg:hidden"
          aria-label="تنقل الجوال"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={hrefFor(id)}
                onClick={event => handleNavClick(event, id)}
                className="rounded-md px-3 py-3 text-sm text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--foreground)]"
              >
                {label}
              </a>
            ))}
            <a
              href='/gallery/'
              onClick={() => setMenuOpen(false)}
              className='rounded-md px-3 py-3 text-sm text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--foreground)]'
            >
              معرض الأعمال
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
