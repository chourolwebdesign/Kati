// Mobile nav
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Active nav link while scrolling
(function activeNav() {
  const links = document.querySelectorAll('.nav__menu a[href^="#"]:not(.btn)');
  const sections = [...links]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const byId = {};
  links.forEach(a => { byId[a.getAttribute('href').slice(1)] = a; });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = byId[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();

// Scroll reveal
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// Cookie banner (minimal)
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const COOKIE_KEY = 'kati_cookie_notice_ok_v1';

try {
  const ok = localStorage.getItem(COOKIE_KEY);
  if (!ok && cookieBanner) cookieBanner.style.display = 'block';

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, '1');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }
} catch (_) {
  // If localStorage is blocked, just don't show anything intrusive.
  if (cookieBanner) cookieBanner.style.display = 'none';
}

// 2-click Google Maps
const loadMapBtn = document.getElementById('loadMap');
const mapTwoClick = document.getElementById('mapTwoClick');

if (loadMapBtn && mapTwoClick) {
  loadMapBtn.addEventListener('click', () => {
    const q = encodeURIComponent('St.-Koloman-Weg 3, 93055 Regensburg');
    const iframe = document.createElement('iframe');
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.google.com/maps?q=${q}&output=embed`;

    mapTwoClick.innerHTML = '';
    mapTwoClick.appendChild(iframe);
  });
}

// Anfrage per E-Mail (öffnet Mail-App mit fertig ausgefüllter Nachricht)
const emailQuickForm = document.getElementById('emailQuick');

if (emailQuickForm) {
  emailQuickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('emailQuickName')?.value || '').trim();
    const phone = (document.getElementById('emailQuickPhone')?.value || '').trim();
    const service = (document.getElementById('emailQuickService')?.value || '').trim();
    const message = (document.getElementById('emailQuickMessage')?.value || '').trim();

    const subject = encodeURIComponent(
      service ? `Anfrage: ${service} – KATI Außenanlagen & Dienstleistungen`
              : 'Anfrage – KATI Außenanlagen & Dienstleistungen'
    );
    const body = encodeURIComponent(
      `Hallo KATI,\n\n` +
      `mein Name ist ${name || '[Name]'} und ich habe eine Anfrage.\n\n` +
      (service ? `Leistung: ${service}\n` : '') +
      (phone ? `Telefon: ${phone}\n` : '') +
      `\n${message}\n\n` +
      `Viele Grüße\n${name || ''}`
    );
    window.location.href = `mailto:info@katiaußenanlagen.de?subject=${subject}&body=${body}`;

    const success = document.getElementById('emailQuickSuccess');
    if (success) success.textContent = 'Ihr E-Mail-Programm wird geöffnet …';
  });
}

// Gallery lightbox
(function lightbox() {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const items = [...document.querySelectorAll('.gallery-item img')];
  if (!box || !img || !items.length) return;

  let current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    img.src = items[current].src;
    img.alt = items[current].alt || '';
  }
  function open(i) {
    show(i);
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
  }
  function close() {
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
  }

  items.forEach((el, i) => {
    el.closest('.gallery-item').addEventListener('click', () => open(i));
  });
  document.getElementById('lightboxClose')?.addEventListener('click', close);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => show(current - 1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// Modals (Impressum/Datenschutz)
const openButtons = document.querySelectorAll('[data-modal-open]');

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('modal-open');
  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('modal-open');
}

openButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-modal-open');
    if (id) openModal(id);
  });
});

document.querySelectorAll('[data-modal-close]').forEach((el) => {
  el.addEventListener('click', () => closeModal(el.closest('.modal')));
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const modal = document.querySelector('.modal.is-open');
  if (modal) closeModal(modal);
});

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
