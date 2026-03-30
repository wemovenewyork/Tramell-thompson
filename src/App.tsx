import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

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

function Nav({ scrolled, activeSection }: { scrolled: boolean; activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ['home', 'bio', 'gallery', 'services', 'events', 'media', 'faq', 'contact'];

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
      <a href="#bio" className="skip-link">Skip to content</a>
      <nav id="mainNav" role="navigation" aria-label="Main navigation" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-brand" onClick={e => { e.preventDefault(); scrollTo('home'); }}>
          Tramell <span>Thompson</span>
        </a>
        <div className="nav-links">
          {links.map(l => (
            <a key={l} href={`#${l}`} className={activeSection === l ? 'active' : ''}
              onClick={e => { e.preventDefault(); scrollTo(l); }}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>&times;</button>
        {links.map(l => (
          <a key={l} href={`#${l}`} onClick={e => { e.preventDefault(); scrollTo(l); }}>
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}
      </div>
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────

function Hero({ loaded }: { loaded: boolean }) {
  const [notifyDone, setNotifyDone] = useState(false);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
  }

  return (
    <section className={`hero${loaded ? ' loaded' : ''}`} id="home" role="banner">
      <div className="hero-photo" />
      <div className="hero-overlay" />
      <div className="hero-vignette" />
      <div className="hero-content">
        <p className="hero-eyebrow">Labor Leader &bull; Advocate &bull; Consultant</p>
        <h1>
          <span className="first-name">Tramell</span>
          <span className="last-name">Thompson</span>
        </h1>
        <p className="hero-tagline">Founder of <span>Progressive Action</span> &bull; NYC</p>
        <div className="hero-cta">
          <a href="#services" className="cta-btn cta-primary" onClick={e => { e.preventDefault(); scrollTo('services'); }}>Book a Consultation</a>
          <a href="#media" className="cta-btn cta-secondary" onClick={e => { e.preventDefault(); scrollTo('media'); }}>Watch Progressive Action TV</a>
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
        <div className="hero-notify">
          <form className="hero-notify-form" onSubmit={e => { e.preventDefault(); setNotifyDone(true); }}>
            <div className="hero-notify-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <input type="email" placeholder="Get notified — enter your email" required disabled={notifyDone} />
            <button type="submit" className={notifyDone ? 'done' : ''}>{notifyDone ? 'Signed Up!' : 'Notify Me'}</button>
          </form>
        </div>
      </div>
      <div className="hero-scroll">
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </section>
  );
}

// ── BIO ───────────────────────────────────────────────────────────────────

function Bio() {
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
    <section className="bio parallax-section" id="bio">
      <div ref={bgRef} className="parallax-bg" style={{ backgroundImage: "url('/images/img_01.png')" }} />
      <div className="bio-grid">
        <div className="bio-image-wrap reveal">
          <img src="/images/img_02.jpg" alt="Tramell Thompson" className="bio-image" />
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

// ── GALLERY ───────────────────────────────────────────────────────────────

const galleryImages = [
  { src: '/images/img_03.jpg', title: 'The Advocate', caption: 'NYC streets — ready for action' },
  { src: '/images/img_04.png', title: 'The Strategist', caption: 'Behind the scenes at events' },
  { src: '/images/img_05.jpg', title: 'The Community', caption: 'Fighting for working people' },
];

function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => ((i ?? 0) - 1 + galleryImages.length) % galleryImages.length);
      if (e.key === 'ArrowRight') setLightboxIdx(i => ((i ?? 0) + 1) % galleryImages.length);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  return (
    <section className="gallery" id="gallery">
      <div className="gallery-inner">
        <p className="section-label reveal">Gallery</p>
        <h2 className="section-title reveal">On the Ground</h2>
        <div className="gallery-grid reveal">
          {galleryImages.map((img, i) => (
            <div key={i} className="gallery-item" onClick={() => setLightboxIdx(i)}>
              <img src={img.src} alt={`Tramell Thompson — ${img.title}`} />
              <div className="gallery-caption-overlay">
                <span>{img.title}</span>
                <p>{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`lightbox${lightboxIdx !== null ? ' open' : ''}`} onClick={() => setLightboxIdx(null)}>
        <button className="lightbox-close" onClick={() => setLightboxIdx(null)}>&times;</button>
        {lightboxIdx !== null && (
          <img src={galleryImages[lightboxIdx].src} alt="Gallery image" onClick={e => e.stopPropagation()} />
        )}
        <div className="lightbox-nav" onClick={e => e.stopPropagation()}>
          <button onClick={() => setLightboxIdx(i => ((i ?? 0) - 1 + galleryImages.length) % galleryImages.length)}>
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => setLightboxIdx(i => ((i ?? 0) + 1) % galleryImages.length)}>
            <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
          </button>
        </div>
        {lightboxIdx !== null && (
          <div className="lightbox-counter">{lightboxIdx + 1} / {galleryImages.length}</div>
        )}
      </div>
    </section>
  );
}

// ── SERVICES ──────────────────────────────────────────────────────────────

const services = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    title: 'Union Contract Issues',
    desc: 'Navigate the complexities of union contracts with precision and fairness, fostering collaboration between workers and management.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: 'Organizational Leadership',
    desc: 'Build stronger unions and organizations from the ground up — strategic guidance for shop stewards, chapter leaders, and union officers.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6 6l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    title: 'Workers\' Comp Guidance',
    desc: 'Expert guidance through workers\' compensation claims, helping injured workers understand their rights and navigate the system.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    title: 'Political Strategy',
    desc: 'Develop winning political strategies for labor candidates, ballot initiatives, and community campaigns with proven results.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    title: 'Speaking Engagements',
    desc: 'Powerful keynotes and panel appearances at rallies, conferences, town halls, and union meetings that motivate and mobilize.',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    title: 'Media & Communications',
    desc: 'Craft your labor message for maximum impact — media training, press strategy, and digital communications for unions and advocates.',
  },
];

function Services() {
  return (
    <section className="services" id="services">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p className="section-label reveal">What I Do</p>
        <h2 className="section-title reveal">Consultation Services</h2>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={i} className="service-card reveal">
            <div className="service-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PRICING ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>;
}

function Pricing() {
  return (
    <section className="pricing">
      <div className="pricing-inner">
        <p className="section-label reveal">Invest In Your Team</p>
        <h2 className="section-title reveal">Consultation Packages</h2>
        <div className="pricing-grid">
          <div className="price-card featured reveal">
            <div className="price-tier">Personal Session</div>
            <div className="price-amount">1:1 <span>/ 1 Hour Zoom</span></div>
            <p className="price-desc">One-on-one consultation tailored to your specific labor, union, or organizational challenge.</p>
            <ul className="price-features">
              <li><CheckIcon /> 60-minute private Zoom session</li>
              <li><CheckIcon /> Union contract &amp; bylaw review</li>
              <li><CheckIcon /> Workers&apos; comp guidance</li>
              <li><CheckIcon /> Political strategy session</li>
              <li><CheckIcon /> Follow-up email summary</li>
            </ul>
            <a href="mailto:ProgressiveAction100@gmail.com" className="price-btn">Book Now</a>
          </div>
          <div className="price-card reveal">
            <div className="price-tier">Group Session</div>
            <div className="price-amount">Group <span>/ 10+ Members</span></div>
            <p className="price-desc">Collective consultation for union chapters, organizations, or advocacy groups seeking strategic guidance.</p>
            <ul className="price-features">
              <li><CheckIcon /> 90-minute group Zoom session</li>
              <li><CheckIcon /> Collective bargaining strategy</li>
              <li><CheckIcon /> Membership mobilization</li>
              <li><CheckIcon /> Leadership development</li>
              <li><CheckIcon /> Full session recording</li>
            </ul>
            <a href="mailto:ProgressiveAction100@gmail.com" className="price-btn outline">Book Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MOVEMENT ──────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
    title: 'Labor Rights',
    desc: 'Fighting for worker safety, fair contracts, and union accountability',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: 'Community Power',
    desc: 'Uniting neighborhoods and building collective strength across NYC',
  },
  {
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    title: 'Political Action',
    desc: 'Turning organizing energy into electoral victories and policy change',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
    title: 'Media & Voice',
    desc: 'Amplifying worker stories through Progressive Action TV and podcast',
  },
];

function Movement() {
  return (
    <section className="movement" id="movement">
      <div className="movement-inner">
        <p className="section-label reveal">The Movement</p>
        <h2 className="section-title reveal">Progressive Action</h2>
        <p className="movement-desc reveal">More than a labor movement — it's a collective voice for change. Progressive Action transcends the workplace to touch the very fabric of our communities, proving that shared struggles demand unified action.</p>
      </div>
      <div className="movement-pillars">
        {pillars.map((p, i) => (
          <div key={i} className="pillar reveal">
            <div className="pillar-icon">{p.icon}</div>
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── EVENTS ────────────────────────────────────────────────────────────────

const events = [
  { month: 'Apr', day: '12', year: '2026', title: 'Transit Workers Safety Rally', desc: 'City Hall, Manhattan — Progressive Action leads a rally demanding stronger protections for MTA workers' },
  { month: 'Apr', day: '26', year: '2026', title: 'Progressive Action Community Town Hall', desc: 'Brooklyn Community Board — Open forum on transit worker rights and local labor issues' },
  { month: 'May', day: '10', year: '2026', title: 'Labor Consultation Workshop', desc: 'Online via Zoom — Group consultation session open to TWU Local 100 members' },
  { month: 'May', day: '18', year: '2026', title: 'Progressive Action TV Live Broadcast', desc: 'YouTube Live — Monthly broadcast covering the latest in NYC labor and politics' },
];

function Events() {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
  }
  return (
    <section className="events" id="events">
      <div className="events-inner">
        <p className="section-label reveal">Upcoming</p>
        <h2 className="section-title reveal">Events &amp; Appearances</h2>
        <div className="events-list">
          {events.map((ev, i) => (
            <div key={i} className="event-row reveal">
              <div className="event-date">
                <div className="event-month">{ev.month}</div>
                <div className="event-day">{ev.day}</div>
                <div className="event-year">{ev.year}</div>
              </div>
              <div className="event-details">
                <h3>{ev.title}</h3>
                <p>{ev.desc}</p>
              </div>
              <a href="#contact" className="event-tag" onClick={e => { e.preventDefault(); scrollTo('contact'); }}>RSVP</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── MEDIA ─────────────────────────────────────────────────────────────────

const videos = [
  { id: 'jgjEFylzUto', title: 'Mayor Eric Adams In Trouble? MTA Assaults & More', date: 'Nov 2023' },
  { id: 'cDD2v_b9meE', title: 'Interview With Maia Chaka — First Black Woman NFL Referee', date: 'Feb 2022' },
  { id: 'rPOq2aBB2y4', title: 'Progressive Action: TWU Local 100 Union Update', date: 'Jan 2022' },
  { id: 'ZGJa9HrfHKc', title: 'MTA Board Meeting — Pregnant Workers\' Rights', date: 'Dec 2021' },
];

function Media() {
  return (
    <section className="media" id="media">
      <div className="media-inner">
        <p className="section-label reveal">Watch</p>
        <h2 className="section-title reveal">Progressive Action TV</h2>
        <div className="media-grid">
          {videos.map((v, i) => (
            <div key={i} className="media-card reveal">
              <iframe
                className="video-embed"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
              <div className="media-info">
                <h3>{v.title}</h3>
                <p>Progressive Action TV &bull; {v.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="yt-banner">
        <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a1628" /></svg>
        <span>Subscribe to Progressive Action TV</span>
        <a href="https://www.youtube.com/channel/UCcGj78lfiLuDPxujO2AaHHw" target="_blank" rel="noreferrer">Watch on YouTube &rarr;</a>
      </div>
    </section>
  );
}

// ── PODCAST ───────────────────────────────────────────────────────────────

function Podcast() {
  return (
    <section className="podcast">
      <div className="podcast-inner">
        <div className="live-indicator reveal"><span className="live-dot" />New Episodes Weekly</div>
        <div className="podcast-badge reveal">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          Podcast
        </div>
        <p className="section-label reveal">Listen</p>
        <h2 className="section-title reveal">The Progressive Action Show</h2>
        <p className="podcast-desc reveal">Co-hosted by MTA workers Tramell Thompson and Jermell Wilson out of NYC. Covering labor issues, social justice, union politics, and the real challenges facing working people — with real solutions.</p>
        <div className="podcast-platforms reveal">
          <a href="https://podcasts.apple.com/us/podcast/progressive-action/id1114434174" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
            Apple Podcasts
          </a>
          <a href="https://open.spotify.com/show/progressive-action" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" /><path d="M8 13.5c2.5-1 5.5-1 8 0M7 10.5c3-1.5 7-1.5 10 0M9 16.5c2-0.7 4-0.7 6 0" /></svg>
            Spotify
          </a>
          <a href="https://www.youtube.com/channel/UCcGj78lfiLuDPxujO2AaHHw" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /></svg>
            YouTube
          </a>
        </div>
      </div>
    </section>
  );
}

// ── BLOG ──────────────────────────────────────────────────────────────────

const blogPosts = [
  { img: '/images/img_06.png', date: 'Nov 2, 2023', title: 'Mayor Eric Adams In Trouble? MTA Assaults & More', desc: 'Breaking down the latest on City Hall politics and the ongoing crisis of assaults against MTA workers.' },
  { img: '/images/img_07.jpg', date: 'Feb 18, 2022', title: 'Interview With the First Black Woman NFL Referee', desc: 'An exclusive sit-down with trailblazer Maia Chaka on breaking barriers and leading with courage.' },
  { img: '/images/img_08.jpg', date: 'Jan 16, 2022', title: 'Addressing the MTA Board on Pregnant Workers\' Rights', desc: 'Tramell takes the fight directly to the MTA Board, demanding light duty accommodations for pregnant transit workers.' },
];

function Blog() {
  return (
    <section className="blog">
      <div className="blog-inner">
        <p className="section-label reveal">Latest</p>
        <h2 className="section-title reveal">News &amp; Updates</h2>
        <div className="blog-grid">
          {blogPosts.map((post, i) => (
            <a key={i} href="https://tramellthompson.com/" target="_blank" rel="noreferrer" className="blog-card reveal">
              <img src={post.img} alt="Blog" className="blog-thumb" />
              <div className="blog-body">
                <div className="blog-date">{post.date}</div>
                <h3>{post.title}</h3>
                <p>{post.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────

const testimonials = [
  { text: "Tramell is the most fearless labor leader I've encountered. He doesn't wait for permission to fight for what's right — he just acts. Progressive Action has changed the conversation around transit worker safety.", author: 'Transit Worker', role: 'TWU Local 100 Member' },
  { text: 'When we needed someone to stand up and speak truth at City Hall, Tramell was there. His ability to mobilize people and bring attention to labor issues is unmatched. A true community champion.', author: 'Community Organizer', role: 'Brooklyn, NYC' },
  { text: 'Thompson is a fearless neighborhood and labor leader whose progressive track record speaks for itself. He was calling out systemic failures years before it became popular to do so.', author: 'Community Ally', role: 'Labor Advocacy Partner' },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-inner">
        <p className="section-label reveal" style={{ textAlign: 'center' }}>Testimonials</p>
        <h2 className="section-title reveal" style={{ textAlign: 'center' }}>What People Are Saying</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card reveal">
              <p className="testimonial-text">{t.text}</p>
              <p className="testimonial-author">{t.author}</p>
              <p className="testimonial-role">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRESS ─────────────────────────────────────────────────────────────────

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

// ── FAQ ───────────────────────────────────────────────────────────────────

const faqs = [
  { q: 'What happens during a consultation session?', a: "Each session is a focused Zoom call where Tramell reviews your specific situation — whether it's a union contract dispute, organizational challenge, workers' comp question, or mobilization strategy. You'll leave with a clear action plan tailored to your needs." },
  { q: 'Who are consultations for?', a: "Anyone navigating labor issues — union members, shop stewards, chapter leaders, HR professionals, employers looking to improve worker relations, or community organizers building movements. Both individual and group sessions are available." },
  { q: 'How do I book a session?', a: "Choose your package (personal 1:1 or group 10+) from the Consultation Packages section, click \"Book Now,\" complete the payment through the booking page, then email ProgressiveAction100@gmail.com to schedule your date and time." },
  { q: 'Can I book Tramell for a speaking engagement?', a: "Absolutely. Tramell speaks at rallies, press conferences, panel discussions, town halls, union meetings, and community events. Use the contact form or email directly to discuss your event details and availability." },
  { q: 'How can I support Progressive Action?', a: "You can donate through the website, subscribe to the newsletter, follow Progressive Action on social media, share episodes of Progressive Action TV, attend events, or simply spread the word. Every bit of support strengthens the movement." },
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

// ── CONTACT ───────────────────────────────────────────────────────────────

function Contact({ showToast }: { showToast: (msg: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'consultation', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Please enter your name';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Please enter a valid email';
    if (!form.message.trim()) errs.message = 'Please enter a message';
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
    <section className="contact" id="contact">
      <div className="contact-inner">
        <p className="section-label reveal">Get In Touch</p>
        <h2 className="section-title reveal">Let&apos;s Connect</h2>
        <a className="contact-email reveal" onClick={copyEmail} href="mailto:ProgressiveAction100@gmail.com">
          ProgressiveAction100@gmail.com
        </a>
        <p className="contact-desc reveal">For consultation bookings, speaking engagements, media inquiries, and collaboration.</p>

        {submitted ? (
          <div className="form-success visible reveal">
            <strong>Message sent!</strong> Tramell or his team will get back to you shortly.
          </div>
        ) : (
          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cfName">Your Name</label>
              <input type="text" id="cfName" placeholder="Full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              {errors.name && <div className="field-error show">{errors.name}</div>}
            </div>
            <div>
              <label htmlFor="cfEmail">Email</label>
              <input type="email" id="cfEmail" placeholder="you@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <div className="field-error show">{errors.email}</div>}
            </div>
            <div className="full-width">
              <label htmlFor="cfSubject">Subject</label>
              <select id="cfSubject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                <option value="consultation">Consultation Booking</option>
                <option value="speaking">Speaking Engagement</option>
                <option value="media">Media Inquiry</option>
                <option value="collaboration">Collaboration</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="full-width">
              <label htmlFor="cfMessage">Message</label>
              <textarea id="cfMessage" placeholder="Tell Tramell what you need..." required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              {errors.message && <div className="field-error show">{errors.message}</div>}
            </div>
            <div className="full-width" style={{ textAlign: 'center' }}>
              <button type="submit" className="form-submit">Send Message</button>
            </div>
          </form>
        )}

        <div className="newsletter-strip">
          <h3>Stay in the Loop</h3>
          <p>Get updates on events, episodes, and labor news from Progressive Action.</p>
          <form className="newsletter-form" onSubmit={e => { e.preventDefault(); setNewsletterDone(true); }}>
            <input type="email" placeholder="Your email address" required disabled={newsletterDone} />
            <button type="submit" style={newsletterDone ? { background: '#27ae60', borderColor: '#27ae60' } : {}}>
              {newsletterDone ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          <div className="social-links">
            <a href="https://www.facebook.com/ProgressiveActionTV" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://x.com/progressiveact" target="_blank" rel="noreferrer" aria-label="X">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.youtube.com/channel/UCcGj78lfiLuDPxujO2AaHHw" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
            </a>
            <a href="https://www.instagram.com/progressiveaction/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/tramell-thompson-057626206" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>
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
        <Bio />
        <Gallery />
        <Services />
        <Pricing />
        <Movement />
        <Events />
        <Media />
        <Podcast />
        <Blog />
        <Testimonials />
        <Press />
        <FAQ />
        <Contact showToast={showToast} />
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
