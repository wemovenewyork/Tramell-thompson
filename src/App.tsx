import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

import heroImg from './assets/img_00.jpg';
import bioBgImg from './assets/img_01.png';
import bioPortraitImg from './assets/img_02.jpg';

// ── HOOKS ──────────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCounter() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('[data-count]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.target || '0');
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const start = performance.now();
          const startVal = target > 100 ? target - 30 : 0;
          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(startVal + (target - startVal) * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── LOADER ────────────────────────────────────────────────────────────────

function Loader({ hidden }: { hidden: boolean }) {
  return (
    <div className={`loader${hidden ? ' hidden' : ''}`} id="loader">
      <div className="loader-brand">Tramell <span>Thompson</span></div>
      <div className="loader-bar"><div className="loader-fill" /></div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────

const navLinks: { id: string; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'book', label: 'Book Tramell' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
];

function Nav({ scrolled, activeSection }: { scrolled: boolean; activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  }

  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <nav id="mainNav" role="navigation" aria-label="Main navigation" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-brand" onClick={e => { e.preventDefault(); scrollTo('home'); }}>
          Tramell <span>Thompson</span>
        </a>
        <div className="nav-links">
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} className={activeSection === l.id ? 'active' : ''}
              onClick={e => { e.preventDefault(); scrollTo(l.id); }}>
              {l.label}
            </a>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>&times;</button>
        {navLinks.map(l => (
          <a key={l.id} href={`#${l.id}`} onClick={e => { e.preventDefault(); scrollTo(l.id); }}>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────

function Hero({ loaded }: { loaded: boolean }) {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
  }

  return (
    <section className={`hero${loaded ? ' loaded' : ''}`} id="home" role="banner">
      <div className="hero-photo" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="hero-overlay" />
      <div className="hero-vignette" />
      <div className="hero-content">
        <p className="hero-eyebrow">Labor Leader &bull; Advocate &bull; Speaker</p>
        <h1>
          <span className="first-name">Tramell</span>
          <span className="last-name">Thompson</span>
        </h1>
        <p className="hero-tagline">Founder of <span>Progressive Action</span> &bull; NYC</p>
        <div className="hero-cta">
          <a href="#book" className="cta-btn cta-primary" onClick={e => { e.preventDefault(); scrollTo('book'); }}>Book Tramell</a>
          <a href="#about" className="cta-btn cta-secondary" onClick={e => { e.preventDefault(); scrollTo('about'); }}>About Tramell</a>
        </div>
        <div className="hero-social">
          <a href="https://www.facebook.com/ProgressiveActionTV" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
          <a href="https://x.com/progressiveact" target="_blank" rel="noreferrer" aria-label="X">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
          <a href="https://www.youtube.com/channel/UCcGj78lfiLuDPxujO2AaHHw" target="_blank" rel="noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a1628" /></svg>
          </a>
          <a href="https://www.instagram.com/progressiveaction/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
          </a>
          <a href="https://www.linkedin.com/in/tramell-thompson-057626206" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </section>
  );
}

// ── PRESS (credibility on Home) ───────────────────────────────────────────

const pressItems = [
  { href: 'https://nycitylens.com/attacks-transit-workers-stir-fear-frustration/', name: 'NY City Lens', type: 'Feature Article', icon: <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" /></svg> },
  { href: 'https://teachersforchoice.org/2021/08/13/trammel-thompson-speaking-at-teachers-for-choice-august-25th-nyc-protest-at-city-hall/', name: 'Teachers for Choice', type: 'Speaker Feature', icon: <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
  { href: 'https://www.facebook.com/ProgressiveActionTV', name: 'Progressive Action TV', type: 'Original Platform', icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg> },
  { href: 'https://podcasts.apple.com/us/podcast/progressive-action/id1114434174', name: 'Apple Podcasts', type: 'Podcast Feature', icon: <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg> },
];

function Press() {
  return (
    <section className="press">
      <div className="press-inner">
        <p className="section-label reveal">As Seen In</p>
        <h2 className="section-title reveal">Press &amp; Media</h2>
        <div className="press-logos reveal">
          {pressItems.map((p, i) => (
            <a key={i} href={p.href} target="_blank" rel="noreferrer" className="press-item">
              <div className="press-icon">{p.icon}</div>
              <span className="press-name">{p.name}</span>
              <span className="press-type">{p.type}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────

function About() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!bgRef.current) return;
      const rect = bgRef.current.parentElement!.getBoundingClientRect();
      bgRef.current.style.transform = `translateY(${rect.top * 0.15}px)`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bio parallax-section" id="about">
      <div ref={bgRef} className="parallax-bg" style={{ backgroundImage: `url(${bioBgImg})` }} />
      <div className="bio-grid">
        <div className="bio-image-wrap reveal">
          <img src={bioPortraitImg} alt="Tramell Thompson" className="bio-image" />
        </div>
        <div className="bio-text reveal">
          <p className="section-label">About</p>
          <h2 className="section-title">The Voice of<br />the Workers</h2>
          <p>In 2015, Tramell Thompson channeled his lifelong dedication to progress and justice into founding Progressive Action — a groundbreaking force that reshapes the boundaries of labor and community advocacy in New York City. As an NYC subway conductor and TWU Local 100 member, Tramell doesn't just talk about change — he lives it on the front lines every single day.</p>
          <p>Progressive Action has grown into far more than a labor movement. It is the collective voice of transit workers, community members, and everyday New Yorkers demanding fairness, safety, and dignity. From organizing rallies at City Hall to addressing the MTA Board on behalf of pregnant workers denied light duty, Tramell has proven that action speaks louder than words.</p>
          <p>A political strategist, labor consultant, and media personality, Tramell leads Progressive Action TV — recognized as the largest television platform dedicated to labor issues in New York City — reaching audiences across YouTube, Facebook, and X. His podcast tackles the critical issues of our time: worker safety, union accountability, economic justice, and systemic reform.</p>
          <div className="bio-stats">
            <div>
              <div className="bio-stat-num" data-count data-target="2015">2015</div>
              <div className="bio-stat-label">Founded PA</div>
            </div>
            <div>
              <div className="bio-stat-num">NYC</div>
              <div className="bio-stat-label">Brooklyn Born</div>
            </div>
            <div>
              <div className="bio-stat-num" data-count data-target="10" data-suffix="+">0</div>
              <div className="bio-stat-label">Years Advocacy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── BOOK TRAMELL ──────────────────────────────────────────────────────────

// Drop in a Calendly / scheduling URL here to enable the "Schedule directly" button.
const SCHEDULING_URL = '';

function Book({ showToast }: { showToast: (msg: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    type: 'interview',
    date: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Please enter your name';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Please enter a valid email';
    if (!form.message.trim()) errs.message = 'Please add a few details';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  }

  function copyEmail(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText('ProgressiveAction100@gmail.com')
      .then(() => showToast('Email copied to clipboard!'))
      .catch(() => { window.location.href = 'mailto:ProgressiveAction100@gmail.com'; });
  }

  return (
    <section className="contact" id="book">
      <div className="contact-inner">
        <p className="section-label reveal">Book Tramell</p>
        <h2 className="section-title reveal">Interviews, Speaking &amp; Appearances</h2>
        <p className="contact-desc reveal">
          Booking Tramell for an interview, podcast, panel, rally, or speaking engagement?
          Send the details below and his team will get back to you quickly.
        </p>

        {SCHEDULING_URL && (
          <div className="reveal" style={{ textAlign: 'center', margin: '0 0 32px' }}>
            <a href={SCHEDULING_URL} target="_blank" rel="noreferrer" className="cta-btn cta-primary">
              Schedule Directly
            </a>
          </div>
        )}

        <a className="contact-email reveal" onClick={copyEmail} href="mailto:ProgressiveAction100@gmail.com">
          ProgressiveAction100@gmail.com
        </a>

        {submitted ? (
          <div className="form-success visible reveal">
            <strong>Request sent!</strong> Tramell or his team will get back to you shortly.
          </div>
        ) : (
          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="bfName">Your Name</label>
              <input type="text" id="bfName" placeholder="Full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              {errors.name && <div className="field-error show">{errors.name}</div>}
            </div>
            <div>
              <label htmlFor="bfEmail">Email</label>
              <input type="email" id="bfEmail" placeholder="you@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <div className="field-error show">{errors.email}</div>}
            </div>
            <div>
              <label htmlFor="bfOrg">Organization / Outlet</label>
              <input type="text" id="bfOrg" placeholder="Company, podcast, publication" value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="bfType">Booking Type</label>
              <select id="bfType" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="interview">Interview</option>
                <option value="podcast">Podcast Appearance</option>
                <option value="speaking">Speaking Engagement</option>
                <option value="panel">Panel / Town Hall</option>
                <option value="media">Media Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="full-width">
              <label htmlFor="bfDate">Preferred Date</label>
              <input type="date" id="bfDate" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="full-width">
              <label htmlFor="bfMessage">Details</label>
              <textarea id="bfMessage" placeholder="Topic, format, audience size, location, deadlines..." required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              {errors.message && <div className="field-error show">{errors.message}</div>}
            </div>
            <div className="full-width" style={{ textAlign: 'center' }}>
              <button type="submit" className="form-submit">Send Booking Request</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────

const faqs = [
  { q: 'How do I book Tramell for an interview or speaking event?', a: 'Fill out the booking form on this page with the date, format, and details. Tramell or his team will follow up directly to confirm availability and logistics. You can also email ProgressiveAction100@gmail.com.' },
  { q: 'What kinds of events does Tramell speak at?', a: 'Rallies, press conferences, panel discussions, town halls, union meetings, podcasts, news interviews, and community events — anywhere a clear voice on labor, transit, and worker rights is needed.' },
  { q: 'How quickly will I hear back after submitting a request?', a: 'Most booking requests get a response within 1–3 business days. For time-sensitive media bookings, note the deadline in the details field and email directly so it gets flagged.' },
  { q: 'Is Tramell available for travel or remote appearances?', a: 'Yes. Tramell is based in Brooklyn, NYC and regularly does in-person events across the tri-state area, plus remote interviews and podcast appearances anywhere.' },
  { q: 'What topics does Tramell cover?', a: 'Labor rights and union accountability, transit worker safety, workers\' compensation, political strategy, community organizing, and the work of Progressive Action.' },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="faq" id="faq">
      <div className="faq-inner">
        <p className="section-label reveal" style={{ textAlign: 'center' }}>FAQ</p>
        <h2 className="section-title reveal" style={{ textAlign: 'center' }}>Common Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item reveal${openIdx === i ? ' open' : ''}`}>
            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              {f.q}
              <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <div className="faq-answer">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer role="contentinfo">
      <p className="ft-tag">&ldquo;Complaints take a backseat to action.&rdquo;</p>
      <p>&copy; 2026 Tramell Thompson &bull; Progressive Action &bull; Brooklyn, NYC</p>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────

export default function App() {
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bttVisible, setBttVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useReveal();
  useCounter();

  useEffect(() => {
    const t = setTimeout(() => { setLoaderHidden(true); setHeroLoaded(true); }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
      setBttVisible(window.scrollY > 500);
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      const pos = window.scrollY + 100;
      let current = 'home';
      sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
      setActiveSection(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  return (
    <>
      <Loader hidden={loaderHidden} />
      <div className={`toast${toastVisible ? ' show' : ''}`}>{toast}</div>
      <Nav scrolled={scrolled} activeSection={activeSection} />
      <main id="main-content">
        <Hero loaded={heroLoaded} />
        <Press />
        <About />
        <Book showToast={showToast} />
        <FAQ />
      </main>
      <Footer />
      <button
        className={`back-to-top${bttVisible ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
    </>
  );
}
