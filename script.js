/* ================================================================
   KEVIN DEV — script.js
   Clean Code Edition — Robert C. Martin principles applied:
   ─ Single Responsibility per function
   ─ Intention-revealing names
   ─ No magic numbers (named constants)
   ─ No side effects in pure helpers
   ─ Functions under 20 lines where possible
   ─ High-level orchestration at the top, details below
   ================================================================ */

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS — no magic numbers scattered in code
   ───────────────────────────────────────────────────────────────── */
const THEME_STORAGE_KEY    = 'kevin-porto-theme';
const NAVBAR_SCROLL_OFFSET = 50;    // px before navbar darkens
const SCROLL_TOP_THRESHOLD = 400;   // px before scroll-to-top appears
const SECTION_ACTIVE_OFFSET = 120;  // px offset for active nav detection
const NAVBAR_HEIGHT_OFFSET  = -72;  // Lenis scrollTo offset for sticky nav

const TYPEWRITER_TYPE_SPEED    = 120; // ms per character while typing
const TYPEWRITER_DELETE_SPEED  = 40;  // ms per character while deleting
const TYPEWRITER_PAUSE_AFTER   = 2000; // ms pause after full phrase
const TYPEWRITER_PAUSE_BEFORE  = 500;  // ms pause before next phrase starts

const PHOTO_REVEAL_RADIUS = 100; // px radius of the hover reveal circle
const PHOTO_SOFT_EDGE     = 15;  // px feather at reveal edge
const PHOTO_EASE_FACTOR   = 0.15; // lerp factor for smooth radius animation

const COUNTER_DURATION_MS  = 1800; // ms for stat counter animation
const COUNTER_INTERSECTION = 0.4;  // how much of stats strip must be visible

const TILT_CONFIGS = [
  { selector: '.portfolio-card-v2', max: 8,  speed: 400, perspective: 800,  glare: true, maxGlare: 0.15, scale: 1.04  },
  { selector: '.card-custom',       max: 5,  speed: 500, perspective: 1000, glare: true, maxGlare: 0.08, scale: 1.02  },
  { selector: '.org-card-v2',       max: 6,  speed: 400, perspective: 900,  glare: true, maxGlare: 0.1,  scale: 1.025 },
  { selector: '.cert-card-masonry', max: 5,  speed: 600, perspective: 1000, glare: true, maxGlare: 0.07, scale: 1.015 },
  { selector: '.workflow-card',     max: 6,  speed: 400, perspective: 900,  glare: true, maxGlare: 0.1,  scale: 1.03  },
];

const TYPEWRITER_PHRASES = [
  'Vibe Coder → Production Ready',
  'AI-Assisted Full-Stack Dev',
  'Laravel & CodeIgniter Builder',
  'HANSCO Digital Founder',
];

const WHATSAPP_NUMBER = '6289616682955';

/* ─────────────────────────────────────────────────────────────────
   1. LENIS — smooth scroll engine
   ───────────────────────────────────────────────────────────────── */
const lenis = new Lenis({
  duration:           1.2,
  easing:             (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation:        'vertical',
  gestureOrientation: 'vertical',
  smoothWheel:        true,
  wheelMultiplier:    1,
  touchMultiplier:    2,
  infinite:           false,
});

function startRafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(startRafLoop);
}
requestAnimationFrame(startRafLoop);

/* ─────────────────────────────────────────────────────────────────
   2. TYPEWRITER
   ───────────────────────────────────────────────────────────────── */
function createTypewriterState() {
  return { phraseIndex: 0, charIndex: 0, isDeleting: false };
}

function getNextTypewriterSpeed(state) {
  if (state.isDeleting)              return TYPEWRITER_DELETE_SPEED;
  const phrase = TYPEWRITER_PHRASES[state.phraseIndex];
  if (state.charIndex === phrase.length) return TYPEWRITER_PAUSE_AFTER;
  if (state.charIndex === 0)         return TYPEWRITER_PAUSE_BEFORE;
  return TYPEWRITER_TYPE_SPEED;
}

function advanceTypewriterState(state) {
  const phrase = TYPEWRITER_PHRASES[state.phraseIndex];
  const next   = { ...state };

  if (state.isDeleting) {
    next.charIndex--;
    if (next.charIndex === 0) {
      next.isDeleting  = false;
      next.phraseIndex = (state.phraseIndex + 1) % TYPEWRITER_PHRASES.length;
    }
  } else {
    next.charIndex++;
    if (next.charIndex === phrase.length) {
      next.isDeleting = true;
    }
  }

  return next;
}

function renderTypewriterFrame(element, state) {
  const phrase = TYPEWRITER_PHRASES[state.phraseIndex];
  element.innerHTML =
    phrase.substring(0, state.charIndex) +
    '<span class="typing-cursor">|</span>';
}

function startTypewriter(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let state = createTypewriterState();

  function tick() {
    renderTypewriterFrame(element, state);
    const delay = getNextTypewriterSpeed(state);
    state = advanceTypewriterState(state);
    setTimeout(tick, delay);
  }

  tick();
}

/* ─────────────────────────────────────────────────────────────────
   3. SCROLL REVEAL
   ───────────────────────────────────────────────────────────────── */
function createRevealObserver() {
  return new IntersectionObserver(
    (entries) => entries.forEach(revealEntryIfVisible),
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );
}

function revealEntryIfVisible(entry) {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('active');
  revealObserver.unobserve(entry.target);
}

const revealObserver = createRevealObserver();
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ─────────────────────────────────────────────────────────────────
   4. NAVBAR — scroll state + active link highlight
   ───────────────────────────────────────────────────────────────── */
const navbar   = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function markNavbarScrolled(scrollPosition) {
  navbar.classList.toggle('scrolled', scrollPosition > NAVBAR_SCROLL_OFFSET);
}

function findActiveSection(scrollY) {
  let activeId = '';
  sections.forEach((section) => {
    const top    = section.offsetTop - SECTION_ACTIVE_OFFSET;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      activeId = section.getAttribute('id');
    }
  });
  return activeId;
}

function highlightActiveNavLink(activeSectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === '#' + activeSectionId;
    link.classList.toggle('active', isActive);
  });
}

lenis.on('scroll', ({ scroll }) => {
  markNavbarScrolled(scroll);
  highlightActiveNavLink(findActiveSection(scroll));
});

highlightActiveNavLink(findActiveSection(window.scrollY));

/* ─────────────────────────────────────────────────────────────────
   5. SCROLL-TO-TOP BUTTON
   ───────────────────────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTopBtn');

function updateScrollTopVisibility(scrollPosition) {
  scrollTopBtn.classList.toggle('visible', scrollPosition > SCROLL_TOP_THRESHOLD);
}

lenis.on('scroll', ({ scroll }) => updateScrollTopVisibility(scroll));

scrollTopBtn.addEventListener('click', () => {
  lenis.scrollTo(0, { duration: 1.4 });
});

/* ─────────────────────────────────────────────────────────────────
   6. NAV ANCHOR CLICKS — smooth scroll via Lenis
   ───────────────────────────────────────────────────────────────── */
const navbarCollapse = document.getElementById('navbarNav');

function isHashLink(href) {
  return href && href.startsWith('#');
}

function closeMobileMenuIfOpen() {
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
  }
}

function scrollToSection(href) {
  const target = document.querySelector(href);
  if (!target) return;
  lenis.scrollTo(target, { offset: NAVBAR_HEIGHT_OFFSET, duration: 1.2 });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!isHashLink(href)) return;

    e.preventDefault();
    scrollToSection(href);
    closeMobileMenuIfOpen();
  });
});

/* ─────────────────────────────────────────────────────────────────
   7. PORTFOLIO FILTER
   ───────────────────────────────────────────────────────────────── */
const filterButtons  = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

function showPortfolioItem(item) {
  item.style.display = 'block';
  requestAnimationFrame(() => {
    item.style.opacity   = '0';
    item.style.transform = 'scale(0.9) translateY(20px)';
    requestAnimationFrame(() => {
      item.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      item.style.opacity    = '1';
      item.style.transform  = 'scale(1) translateY(0)';
    });
  });
}

function hidePortfolioItem(item) {
  item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  item.style.opacity    = '0';
  item.style.transform  = 'scale(0.85) translateY(10px)';
  setTimeout(() => { item.style.display = 'none'; }, 260);
}

function itemMatchesFilter(item, filter) {
  return filter === 'all' || item.getAttribute('data-category') === filter;
}

function applyPortfolioFilter(activeFilter) {
  portfolioItems.forEach((item) => {
    if (itemMatchesFilter(item, activeFilter)) {
      showPortfolioItem(item);
    } else {
      hidePortfolioItem(item);
    }
  });
  setTimeout(reinitTiltOnVisibleCards, 300);
}

function reinitTiltOnVisibleCards() {
  const isTouchDevice = !window.matchMedia('(hover: hover)').matches;
  if (isTouchDevice || typeof VanillaTilt === 'undefined') return;

  const visibleCards = document.querySelectorAll(
    ".portfolio-item:not([style*='display: none']) .portfolio-card-v2"
  );
  VanillaTilt.init(visibleCards, {
    max: 8, speed: 400, perspective: 800,
    glare: true, 'max-glare': 0.15, scale: 1.04, gyroscope: false,
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyPortfolioFilter(btn.getAttribute('data-filter'));
  });
});

/* ─────────────────────────────────────────────────────────────────
   8. STATS COUNTER
   ───────────────────────────────────────────────────────────────── */
function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

function animateNumberTo(element, targetValue) {
  const startTime = performance.now();

  function updateFrame(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
    element.textContent = Math.round(easeOutCubic(progress) * targetValue);
    if (progress < 1) {
      requestAnimationFrame(updateFrame);
    } else {
      element.textContent = targetValue;
    }
  }

  requestAnimationFrame(updateFrame);
}

function animateAllCountersInElement(element) {
  element.querySelectorAll('.stat-number').forEach((counter) => {
    const targetValue = parseInt(counter.getAttribute('data-target'), 10);
    animateNumberTo(counter, targetValue);
  });
}

function waitForRevealThenAnimate(revealParent, element) {
  function checkAndAnimate() {
    if (revealParent.classList.contains('active')) {
      animateAllCountersInElement(element);
    } else {
      requestAnimationFrame(checkAndAnimate);
    }
  }
  checkAndAnimate();
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const revealParent = entry.target.closest('.reveal');
      const isRevealed   = !revealParent || revealParent.classList.contains('active');

      if (isRevealed) {
        animateAllCountersInElement(entry.target);
      } else {
        waitForRevealThenAnimate(revealParent, entry.target);
      }

      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: COUNTER_INTERSECTION }
);

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

/* ─────────────────────────────────────────────────────────────────
   9. CONTACT FORM — builds WhatsApp deep-link from form values
   ───────────────────────────────────────────────────────────────── */
function readContactFormValues() {
  return {
    name:    document.getElementById('cf-name').value,
    email:   document.getElementById('cf-email').value,
    subject: document.getElementById('cf-subject').value,
    message: document.getElementById('cf-message').value,
  };
}

function buildWhatsAppUrl({ name, email, subject, message }) {
  const text =
    `Halo Kevin, saya ${encodeURIComponent(name)} (${encodeURIComponent(email)}).` +
    `\n\nSubjek: ${encodeURIComponent(subject)}` +
    `\n\n${encodeURIComponent(message)}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function setSubmitButtonLoading(btn, isLoading) {
  btn.querySelector('.btn-submit-text').style.display  = isLoading ? 'none'   : 'inline';
  btn.querySelector('.btn-submit-loading').style.display = isLoading ? 'inline' : 'none';
  btn.disabled = isLoading;
}

function handleContactFormSubmit(e) {
  e.preventDefault();

  const btn    = e.target.querySelector('button[type="submit"]');
  const values = readContactFormValues();

  setSubmitButtonLoading(btn, true);
  window.open(buildWhatsAppUrl(values), '_blank');
  e.target.reset();
  setSubmitButtonLoading(btn, false);
}

/* ─────────────────────────────────────────────────────────────────
   10. THEME — dark / light toggle with localStorage persistence
   ───────────────────────────────────────────────────────────────── */
function getStoredTheme() {
  try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; }
}

function saveTheme(theme) {
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch {}
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
}

function resolveInitialTheme() {
  const stored      = getStoredTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return stored || (prefersDark ? 'dark' : 'light');
}

function initTheme() {
  applyTheme(resolveInitialTheme());
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

/* ─────────────────────────────────────────────────────────────────
   11. VANILLA TILT — 3-D hover effect on cards
   ───────────────────────────────────────────────────────────────── */
function isTiltSupported() {
  return typeof VanillaTilt !== 'undefined' &&
         window.matchMedia('(hover: hover)').matches;
}

function applyTiltConfig({ selector, max, speed, perspective, glare, maxGlare, scale }) {
  VanillaTilt.init(document.querySelectorAll(selector), {
    max, speed, perspective, glare,
    'max-glare': maxGlare,
    scale,
    gyroscope: false,
  });
}

function initAllTiltEffects() {
  if (!isTiltSupported()) return;
  TILT_CONFIGS.forEach(applyTiltConfig);
}

window.addEventListener('load', initAllTiltEffects);

/* ─────────────────────────────────────────────────────────────────
   12. PHOTO REVEAL — cyborg layer revealed on cursor position
   ───────────────────────────────────────────────────────────────── */
function buildRevealMask(x, y, radius) {
  const featherStart = Math.max(0, radius - PHOTO_SOFT_EDGE);
  return `radial-gradient(circle ${Math.round(radius)}px at ${Math.round(x)}px ${Math.round(y)}px, ` +
         `black ${Math.round(featherStart)}px, transparent ${Math.round(radius)}px)`;
}

function applyRevealMask(element, x, y, radius) {
  const mask = radius < 0.5
    ? 'radial-gradient(circle 0px, transparent, transparent)'
    : buildRevealMask(x, y, radius);

  element.style.webkitMaskImage = mask;
  element.style.maskImage       = mask;
}

function initPhotoReveal(containerId, botLayerId) {
  const container = document.getElementById(containerId);
  const botLayer  = document.getElementById(botLayerId);
  if (!container || !botLayer) return;

  let currentRadius = 0;
  let targetRadius  = 0;
  let cursorX = 0;
  let cursorY = 0;
  let rafId   = null;
  let isHovering = false;

  function animateReveal() {
    currentRadius += (targetRadius - currentRadius) * PHOTO_EASE_FACTOR;
    if (Math.abs(targetRadius - currentRadius) < 0.2) currentRadius = targetRadius;

    applyRevealMask(botLayer, cursorX, cursorY, currentRadius);

    if (Math.abs(targetRadius - currentRadius) > 0.1) {
      rafId = requestAnimationFrame(animateReveal);
    } else {
      rafId = null;
    }
  }

  function startAnimation() {
    if (!rafId) rafId = requestAnimationFrame(animateReveal);
  }

  function setCursorFromMouseEvent(e) {
    const rect = container.getBoundingClientRect();
    cursorX = e.clientX - rect.left;
    cursorY = e.clientY - rect.top;
  }

  function setCursorFromTouchEvent(e) {
    const rect  = container.getBoundingClientRect();
    const touch = e.touches[0];
    cursorX = touch.clientX - rect.left;
    cursorY = touch.clientY - rect.top;
  }

  container.addEventListener('mouseenter', (e) => {
    isHovering   = true;
    targetRadius = PHOTO_REVEAL_RADIUS;
    setCursorFromMouseEvent(e);
    startAnimation();
  });

  container.addEventListener('mouseleave', () => {
    isHovering   = false;
    targetRadius = 0;
    startAnimation();
  });

  container.addEventListener('mousemove', (e) => {
    setCursorFromMouseEvent(e);
    if (isHovering && currentRadius > 0) {
      applyRevealMask(botLayer, cursorX, cursorY, currentRadius);
    }
  });

  container.addEventListener('touchstart', (e) => {
    isHovering   = true;
    targetRadius = PHOTO_REVEAL_RADIUS;
    setCursorFromTouchEvent(e);
    startAnimation();
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    setCursorFromTouchEvent(e);
    if (isHovering && currentRadius > 0) {
      applyRevealMask(botLayer, cursorX, cursorY, currentRadius);
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    isHovering   = false;
    targetRadius = 0;
    startAnimation();
  });
}

/* ─────────────────────────────────────────────────────────────────
   BOOT — orchestrate startup in dependency order
   ───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  startTypewriter('typewriter');
  initPhotoReveal('photoReveal', 'photoBot');

  // Attach contact form handler if form exists
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
});
