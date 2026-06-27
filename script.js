// 1. Typing Effect Logic
const textElement = document.getElementById("typewriter");
const phrases = [
  "Vibe Coder → Production Ready",
  "AI-Assisted Full-Stack Dev",
  "Laravel & CodeIgniter Builder",
  "HANSCO Digital Founder",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typeSpeed = 40;
  } else {
    charIndex++;
    typeSpeed = 120;
  }

  textElement.innerHTML = currentPhrase.substring(0, charIndex) + `<span class="typing-cursor">|</span>`;

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

// 2. Scroll Animation (Reveal on Scroll)
function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 120;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

// 3. Navbar Background Change on Scroll
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// 4. Navbar Active Link on Scroll (Scroll Spy)
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  const scrollY = window.scrollY;
  const offset = 120; // account for fixed navbar height

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - offset;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === "#" + current) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav(); // run on load too

// 5. Scroll-to-Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 6. Portfolio Filter
const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      const match = filter === "all" || category === filter;

      if (match) {
        item.style.display = "block";
        // Animate in
        requestAnimationFrame(() => {
          item.style.opacity = "0";
          item.style.transform = "scale(0.9) translateY(20px)";
          requestAnimationFrame(() => {
            item.style.transition = "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
            item.style.opacity = "1";
            item.style.transform = "scale(1) translateY(0)";
          });
        });
      } else {
        item.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        item.style.opacity = "0";
        item.style.transform = "scale(0.85) translateY(10px)";
        setTimeout(() => {
          item.style.display = "none";
        }, 260);
      }
    });

    // Re-init VanillaTilt on newly visible cards after filter
    setTimeout(() => {
      if (typeof VanillaTilt !== "undefined" && window.matchMedia("(hover: hover)").matches) {
        const visibleCards = document.querySelectorAll(".portfolio-item:not([style*='display: none']) .portfolio-card-v2");
        VanillaTilt.init(visibleCards, {
          max: 8, speed: 400, perspective: 800,
          glare: true, "max-glare": 0.15, scale: 1.04, gyroscope: false,
        });
      }
    }, 300);
  });
});

// 7. Count-Up Animation (Stats Strip)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"), 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutCubic(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// Trigger counters when stats strip enters viewport
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const statsStrip = document.querySelector(".stats-strip");
if (statsStrip) statsObserver.observe(statsStrip);

// Fallback: trigger counters on load if already visible in viewport
window.addEventListener("load", () => {
  if (statsStrip) {
    const rect = statsStrip.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      statsStrip.querySelectorAll(".stat-number").forEach(animateCounter);
    }
  }
});

// 6. Reveal + scroll events combined
window.addEventListener("scroll", reveal);

// 7. Form Handling (Direct to WhatsApp)
let formSubmitting = false;

function handleForm(e) {
  e.preventDefault();
  if (formSubmitting) return false;

  const btn = e.target.querySelector("button");
  const submitText = btn.querySelector(".btn-submit-text");
  const loadingText = btn.querySelector(".btn-submit-loading");

  formSubmitting = true;
  submitText.style.display = "none";
  loadingText.style.display = "inline";
  btn.disabled = true;

  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const subject = document.getElementById("cf-subject").value;
  const message = document.getElementById("cf-message").value;

  const waNumber = "6289616682955";
  const waText = `Halo Kevin, saya ${name} (${email}).%0A%0ASubjek: ${subject}%0A%0A${message}`;
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

  window.open(waUrl, "_blank");
  e.target.reset();
  submitText.style.display = "inline";
  loadingText.style.display = "none";
  btn.disabled = false;
  formSubmitting = false;

  return false;
}

// 8. Mobile Navbar: Close on link click
const navbarCollapse = document.getElementById("navbarNav");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  type();
  reveal();
  initTheme();
});

// 9. Dark Mode Toggle
const STORAGE_KEY = "kevin-porto-theme";

function initTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
  } catch (e) {}
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.setAttribute("data-bs-theme", next);
  localStorage.setItem(STORAGE_KEY, next);
}

document.getElementById("themeToggle").addEventListener("click", toggleTheme);

// 10. Vanilla Tilt 3D Effect — initialize after DOM is ready
function initTilt() {
  // Only init on non-touch devices for best UX
  if (window.matchMedia("(hover: hover)").matches && typeof VanillaTilt !== "undefined") {

    // Portfolio Cards — most dramatic tilt + glare
    VanillaTilt.init(document.querySelectorAll(".portfolio-card-v2"), {
      max: 8,
      speed: 400,
      perspective: 800,
      glare: true,
      "max-glare": 0.15,
      scale: 1.04,
      gyroscope: false,
    });

    // Skill Cards — subtle tilt
    VanillaTilt.init(document.querySelectorAll(".card-custom"), {
      max: 5,
      speed: 500,
      perspective: 1000,
      glare: true,
      "max-glare": 0.08,
      scale: 1.02,
      gyroscope: false,
    });

    // Organization Cards — medium tilt
    VanillaTilt.init(document.querySelectorAll(".org-card-v2"), {
      max: 6,
      speed: 400,
      perspective: 900,
      glare: true,
      "max-glare": 0.1,
      scale: 1.025,
      gyroscope: false,
    });

    // Certificate Cards — gentle tilt (many cards, keep subtle)
    VanillaTilt.init(document.querySelectorAll(".cert-card-masonry"), {
      max: 5,
      speed: 600,
      perspective: 1000,
      glare: true,
      "max-glare": 0.07,
      scale: 1.015,
      gyroscope: false,
    });

    // Workflow Cards — medium tilt
    VanillaTilt.init(document.querySelectorAll(".workflow-card"), {
      max: 6,
      speed: 400,
      perspective: 900,
      glare: true,
      "max-glare": 0.1,
      scale: 1.03,
      gyroscope: false,
    });
  }
}

// Wait for Vanilla Tilt script to load then init
window.addEventListener("load", initTilt);

// =====================================================
// PHOTO REVEAL EFFECT — Cursor Spotlight
// =====================================================
(function initPhotoReveal() {
  const container = document.getElementById("photoReveal");
  if (!container) return;

  const photoBot = document.getElementById("photoBot");
  if (!photoBot) return;

  const REVEAL_RADIUS = 100; // Spotlight hole radius in px
  const SOFT_EDGE     = 15;  // Edge softness transition in px
  const EASE          = 0.15; // Smooth transition speed

  let currentR = 0;   // Animated radius
  let targetR  = 0;   // Target radius
  let curX = 0, curY = 0; // Cursor position relative to container
  let animRaf = null;
  let isInside = false;

  // Apply CSS mask-image directly to the top photo element
  function applyMask(x, y, r) {
    if (r < 0.5) {
      photoBot.style.webkitMaskImage = "radial-gradient(circle 0px, transparent, transparent)";
      photoBot.style.maskImage       = "radial-gradient(circle 0px, transparent, transparent)";
      return;
    }
    const softStart = Math.max(0, r - SOFT_EDGE);
    // spotlight mask: solid black inside the circle, transparent outside
    const gradient = `radial-gradient(circle ${Math.round(r)}px at ${Math.round(x)}px ${Math.round(y)}px, black ${Math.round(softStart)}px, transparent ${Math.round(r)}px)`;
    photoBot.style.webkitMaskImage = gradient;
    photoBot.style.maskImage       = gradient;
  }

  // Smooth animation loop
  function animate() {
    currentR += (targetR - currentR) * EASE;
    if (Math.abs(targetR - currentR) < 0.2) {
      currentR = targetR;
    }

    applyMask(curX, curY, currentR);

    if (Math.abs(targetR - currentR) > 0.1) {
      animRaf = requestAnimationFrame(animate);
    } else {
      animRaf = null;
      if (currentR < 0.5) {
        photoBot.style.webkitMaskImage = "radial-gradient(circle 0px, transparent, transparent)";
        photoBot.style.maskImage       = "radial-gradient(circle 0px, transparent, transparent)";
      }
    }
  }


  function startAnimate() {
    if (!animRaf) animRaf = requestAnimationFrame(animate);
  }

  container.addEventListener("mouseenter", (e) => {
    isInside = true;
    targetR = REVEAL_RADIUS;
    
    // Set initial position immediately on enter to prevent flicker
    const rect = container.getBoundingClientRect();
    curX = e.clientX - rect.left;
    curY = e.clientY - rect.top;
    
    startAnimate();
  });

  container.addEventListener("mouseleave", () => {
    isInside = false;
    targetR = 0;
    startAnimate();
  });

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    curX = e.clientX - rect.left;
    curY = e.clientY - rect.top;

    if (isInside && currentR > 0) {
      applyMask(curX, curY, currentR);
    }
  });

  // Touch support for mobile devices
  container.addEventListener("touchstart", (e) => {
    isInside = true;
    targetR = REVEAL_RADIUS;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    curX = touch.clientX - rect.left;
    curY = touch.clientY - rect.top;
    startAnimate();
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    curX = touch.clientX - rect.left;
    curY = touch.clientY - rect.top;
    if (isInside && currentR > 0) {
      applyMask(curX, curY, currentR);
    }
  }, { passive: true });

  container.addEventListener("touchend", () => {
    isInside = false;
    targetR = 0;
    startAnimate();
  });
})();
