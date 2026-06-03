/* ============================================================
  main.js – Shared JavaScript for Business Bureau website
  Loaded on every page. Keep this file in the same folder
  as all HTML files.

  Contents:
    1. Dark mode flash prevention (inline in <head>, but also
       here as a fallback for any late-loading scenario)
    2. Hamburger / mobile menu toggle
    3. PDF iframe loading overlay (citizens-charter.html)
    4. Settings dropdown + Dark mode toggle (shared across pages)
    5. Copyright year auto-update
============================================================ */


/* ── 1. Dark mode: apply class BEFORE paint to prevent flash ──
   This is also inlined in each <head> as a tiny script for instant
   application, but we also run it here as a safety net.           */
(function applyDarkModeEarly() {
  if (localStorage.getItem('bb-dark') === '1') {
    document.documentElement.classList.add('dark-early');
    document.body && document.body.classList.add('dark');
  }
})();


/* ── 2. Hamburger / Mobile Menu ──
   Works on all pages. Requires:
     - <button id="hamburger"> with three <span> children
     - <nav id="mobileMenu"> with class="mobile-menu"
     - Links inside mobileMenu should have class="mobile-link"
*/
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
})();


/* ── 3. PDF iframe loading overlay ──
   Only active when #pdfFrame exists (citizens-charter.html).
   Shows a loading state, fades out after iframe loads.
   Handles iOS/Safari fallback.
*/
(function initPdfLoader() {
  const frame    = document.getElementById('pdfFrame');
  const overlay  = document.getElementById('pdfLoadingOverlay');
  const fallback = document.getElementById('pdfFallback');
  if (!frame) return;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    frame.style.display    = 'none';
    if (fallback) fallback.style.display = 'block';
    if (overlay)  overlay.style.display  = 'none';
    return;
  }

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const safariNotice = document.getElementById('safariNotice');
  if (isSafari && safariNotice) {
    safariNotice.style.display = 'inline-block';
  }

  if (overlay) {
    frame.addEventListener('load', () => {
      overlay.style.opacity    = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { overlay.style.display = 'none'; }, 420);
    });

    setTimeout(() => {
      if (frame.clientHeight < 10) {
        frame.style.display    = 'none';
        if (fallback) fallback.style.display = 'block';
        if (overlay)  overlay.style.display  = 'none';
      }
    }, 2000);
  }
})();


/* ── 4. Settings dropdown + Dark mode toggle (shared) ──
   Requires on each page:
     Desktop: #settingsBtn, #settingsDropdown
     Desktop dark toggle: #darkModeToggle
     Mobile dark toggle:  #darkModeToggleMobile  (inside mobile menu)
*/
(function initSettings() {
  const settingsBtn      = document.getElementById('settingsBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const darkToggle       = document.getElementById('darkModeToggle');
  const darkToggleMobile = document.getElementById('darkModeToggleMobile');

  /* ── Dark mode: persist across pages ── */
  function applyDark(on) {
    document.body.classList.toggle('dark', on);
    [darkToggle, darkToggleMobile].forEach(btn => {
      if (btn) btn.setAttribute('aria-checked', String(on));
    });
    localStorage.setItem('bb-dark', on ? '1' : '0');
  }

  /* Load saved preference on page load */
  const saved = localStorage.getItem('bb-dark');
  if (saved === '1') applyDark(true);

  function handleDarkToggle() {
    applyDark(!document.body.classList.contains('dark'));
  }
  if (darkToggle)       darkToggle.addEventListener('click', handleDarkToggle);
  if (darkToggleMobile) darkToggleMobile.addEventListener('click', handleDarkToggle);

  /* ── Settings dropdown open/close ── */
  if (!settingsBtn || !settingsDropdown) return;

  function openSettings() {
    settingsDropdown.classList.add('open');
    settingsBtn.setAttribute('aria-expanded', 'true');
    settingsDropdown.setAttribute('aria-hidden', 'false');
  }
  function closeSettings() {
    settingsDropdown.classList.remove('open');
    settingsBtn.setAttribute('aria-expanded', 'false');
    settingsDropdown.setAttribute('aria-hidden', 'true');
  }

  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsDropdown.classList.contains('open') ? closeSettings() : openSettings();
  });

  document.addEventListener('click', (e) => {
    if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
      closeSettings();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });
})();


/* ── 5. Copyright year auto-update ──
   Finds any element with id="copyrightYear" and sets its text
   to the current year. Add id="copyrightYear" to the year span
   in each footer.
*/
(function updateCopyrightYear() {
  const el = document.getElementById('copyrightYear');
  if (el) el.textContent = new Date().getFullYear();
})();
