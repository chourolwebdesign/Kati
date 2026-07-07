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
    // Encode query for Google Maps embed
    const q = encodeURIComponent('St.-Koloman-Weg, 93055 Regensburg');
    const iframe = document.createElement('iframe');
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.google.com/maps?q=${q}&output=embed`;

    mapTwoClick.innerHTML = '';
    mapTwoClick.appendChild(iframe);
  });
}

// Kurzanfrage per E-Mail (öffnet Mail-App)
const emailQuickForm = document.getElementById('emailQuick');
const emailQuickName = document.getElementById('emailQuickName');
const emailQuickSuccess = document.getElementById('emailQuickSuccess');

if (emailQuickForm) {
  emailQuickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (emailQuickName?.value || '').trim();
    const subject = encodeURIComponent('Anfrage – KATI Außenanlagen & Dienstleistungen');
    const body = encodeURIComponent(
      `Hallo KATI,\n\nmein Name ist ${name || '[Name]'} und ich habe eine Anfrage.\n\nOrt: \nWas soll gemacht werden?: \nWunschtermin: \n\nViele Grüße\n${name || ''}`
    );
    window.location.href = `mailto:Oktaykati88@gmail.com?subject=${subject}&body=${body}`;
    if (emailQuickSuccess) emailQuickSuccess.textContent = 'E-Mail wird geöffnet…';
  });
}

// Friendly success message for Hero Netlify Form
(function heroSuccess() {
  const heroForm = document.forms['kati-schnellanfrage'];
  const heroSuccessEl = document.getElementById('heroSuccess');
  if (!heroForm || !heroSuccessEl) return;
  heroForm.addEventListener('submit', () => {
    heroSuccessEl.textContent = 'Danke! Ihre Anfrage wurde gesendet. Wir melden uns schnell zurück.';
  });
})();

// Modals (Impressum/Datenschutz)
const openButtons = document.querySelectorAll('[data-modal-open]');
const closeSelectors = '[data-modal-close]';

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('modal-open');
  // focus close button
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

document.querySelectorAll(closeSelectors).forEach((el) => {
  el.addEventListener('click', () => {
    const modal = el.closest('.modal');
    closeModal(modal);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const modal = document.querySelector('.modal.is-open');
  if (modal) closeModal(modal);
});




function fixHeaderOffset() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;
  document.documentElement.style.setProperty(
    '--topbar-height',
    `${topbar.offsetHeight}px`
  );
}
window.addEventListener('load', fixHeaderOffset);
window.addEventListener('resize', fixHeaderOffset);



function fixHeaderHeights() {
  const topbar = document.querySelector('.topbar');
  const header = document.querySelector('.header');
  if (topbar) {
    document.documentElement.style.setProperty('--topbar-height', `${topbar.offsetHeight}px`);
  }
  if (header) {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }
  const spacer = (topbar?.offsetHeight || 0) + (header?.offsetHeight || 0);
  document.body.style.paddingTop = spacer + 'px';
}
window.addEventListener('load', fixHeaderHeights);
window.addEventListener('resize', fixHeaderHeights);


/* ===== SET CSS VARS FOR TOPBAR + HEADER HEIGHT ===== */
function setStickyHeights(){
  const topbar = document.querySelector('.topbar');
  const header = document.querySelector('.header');
  if(topbar){
    document.documentElement.style.setProperty('--topbar-height', `${topbar.offsetHeight}px`);
  }
  if(header){
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }
}
window.addEventListener('load', setStickyHeights);
window.addEventListener('resize', setStickyHeights);
