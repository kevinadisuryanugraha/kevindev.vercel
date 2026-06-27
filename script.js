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
  if (!textElement) return;
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

function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const viewportHeight = window.innerHeight;
  for (let i = 0; i < reveals.length; i++) {
    const elementTop = reveals[i].getBoundingClientRect().top;
    const offset = 120;
    if (elementTop < viewportHeight - offset) {
      reveals[i].classList.add("active");
    }
  }
}

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  const scrollY = window.scrollY;
  const offset = 120;
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
updateActiveNav();

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

const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      const match = filter === "all" || category === filter;

      if (match) {
        item.style.display = "block";
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

window.addEventListener("load", () => {
  if (statsStrip) {
    const rect = statsStrip.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      statsStrip.querySelectorAll(".stat-number").forEach(animateCounter);
    }
  }
});

window.addEventListener("scroll", revealOnScroll);

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
  revealOnScroll();
  initTheme();
});

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

const tiltConfigs = [
  { selector: ".portfolio-card-v2", max: 8, speed: 400, perspective: 800, glare: true, maxGlare: 0.15, scale: 1.04 },
  { selector: ".card-custom", max: 5, speed: 500, perspective: 1000, glare: true, maxGlare: 0.08, scale: 1.02 },
  { selector: ".org-card-v2", max: 6, speed: 400, perspective: 900, glare: true, maxGlare: 0.1, scale: 1.025 },
  { selector: ".cert-card-masonry", max: 5, speed: 600, perspective: 1000, glare: true, maxGlare: 0.07, scale: 1.015 },
  { selector: ".workflow-card", max: 6, speed: 400, perspective: 900, glare: true, maxGlare: 0.1, scale: 1.03 },
];

function initTilt() {
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const tiltExists = typeof VanillaTilt !== "undefined";
  if (!hasHover || !tiltExists) return;

  tiltConfigs.forEach((config) => {
    VanillaTilt.init(document.querySelectorAll(config.selector), {
      max: config.max,
      speed: config.speed,
      perspective: config.perspective,
      glare: config.glare,
      "max-glare": config.maxGlare,
      scale: config.scale,
      gyroscope: false,
    });
  });
}

window.addEventListener("load", initTilt);

(function initPhotoReveal() {
  const container = document.getElementById("photoReveal");
  if (!container) return;

  const photoBot = document.getElementById("photoBot");
  if (!photoBot) return;

  const REVEAL_RADIUS = 100;
  const SOFT_EDGE = 15;
  const EASE = 0.15;

  let currentR = 0;
  let targetR = 0;
  let curX = 0;
  let curY = 0;
  let animRaf = null;
  let isInside = false;

  function applyMask(x, y, r) {
    if (r < 0.5) {
      photoBot.style.webkitMaskImage = "radial-gradient(circle 0px, transparent, transparent)";
      photoBot.style.maskImage = "radial-gradient(circle 0px, transparent, transparent)";
      return;
    }
    const softStart = Math.max(0, r - SOFT_EDGE);
    const gradient = `radial-gradient(circle ${Math.round(r)}px at ${Math.round(x)}px ${Math.round(y)}px, black ${Math.round(softStart)}px, transparent ${Math.round(r)}px)`;
    photoBot.style.webkitMaskImage = gradient;
    photoBot.style.maskImage = gradient;
  }

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
        photoBot.style.maskImage = "radial-gradient(circle 0px, transparent, transparent)";
      }
    }
  }

  function startAnimate() {
    if (!animRaf) animRaf = requestAnimationFrame(animate);
  }

  container.addEventListener("mouseenter", (e) => {
    isInside = true;
    targetR = REVEAL_RADIUS;
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
