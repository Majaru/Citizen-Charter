/* ============================================================
  main.js – Shared JavaScript for Business Bureau website
  Loaded on every page. Keep this file in the same folder
  as all HTML files.

  Contents:
    1. Hamburger / mobile menu toggle
    2. PDF iframe loading overlay (citizens-charter.html)
============================================================ */

/* ── 1. Hamburger / Mobile Menu ──
   Works on all pages. Requires:
     - <button id="hamburger"> with three <span> children
     - <nav id="mobileMenu"> with class="mobile-menu"
     - Links inside mobileMenu should have class="mobile-link"
*/
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  /* Toggle open/close when hamburger is clicked */
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  /* Auto-close when a nav link inside the mobile menu is tapped */
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Close when clicking anywhere outside the nav */
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* Close with Escape key */
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


/* ── 2. PDF iframe loading overlay ──
   Only runs on citizens-charter.html.
   Shows a loading state while the PDF iframe loads,
   then fades it out once the iframe fires its load event.
   Also handles iOS/Safari fallback.
*/
(function initPdfLoader() {
  const frame   = document.getElementById('pdfFrame');
  const overlay = document.getElementById('pdfLoadingOverlay');
  const fallback = document.getElementById('pdfFallback');
  if (!frame) return;

  /* iOS: PDFs don't render in iframes — show fallback download button */
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    frame.style.display    = 'none';
    if (fallback) fallback.style.display = 'block';
    if (overlay)  overlay.style.display  = 'none';
    return;
  }

  /* Show Safari warning (page jumping unreliable in Safari desktop) */
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const safariNotice = document.getElementById('safariNotice');
  if (isSafari && safariNotice) {
    safariNotice.style.display = 'inline-block';
  }

  /* Fade out loading overlay once the iframe has loaded */
  if (overlay) {
    frame.addEventListener('load', () => {
      overlay.style.opacity    = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { overlay.style.display = 'none'; }, 420);
    });

    /* Generic fallback: if iframe collapses after 2s, show download button */
    setTimeout(() => {
      if (frame.clientHeight < 10) {
        frame.style.display    = 'none';
        if (fallback) fallback.style.display = 'block';
        if (overlay)  overlay.style.display  = 'none';
      }
    }, 2000);
  }
})();
