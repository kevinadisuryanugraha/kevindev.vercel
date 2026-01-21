// 1. Typing Effect Logic
const textElement = document.getElementById("typewriter");
const phrases = [
  "Junior Full-Stack Developer.",
  "Laravel Enthusiast.",
  "Problem Solver.",
  "Web Developer.",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    textElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50; // Faster when deleting
  } else {
    textElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100; // Normal typing speed
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500; // Pause before new word
  }

  setTimeout(type, typeSpeed);
}

// 2. Scroll Animation (Reveal on Scroll)
function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

window.addEventListener("scroll", reveal);

// 3. Navbar Background Change on Scroll
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.9)";
    navbar.style.boxShadow = "0 2px 15px rgba(0,0,0,0.05)";
  }
});

// 4. Form Handling (Mockup)
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const originalText = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
  btn.disabled = true;

  // Simulasi pengiriman
  setTimeout(() => {
    alert("Terima kasih, Kevin akan segera menghubungi Anda!");
    e.target.reset();
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 1500);

  return false;
}

// Initialize Typing Effect on Load
document.addEventListener("DOMContentLoaded", () => {
  type();
  reveal(); // Check initial scroll position
});

// 5. PDF Modal Preview Function
function openPdfModal(pdfPath, title) {
  // Set modal title
  document.getElementById("pdfModalTitle").textContent = title;

  // Set PDF viewer source
  document.getElementById("pdfViewer").src = pdfPath;

  // Set download button href
  document.getElementById("pdfDownloadBtn").href = pdfPath;

  // Show modal using Bootstrap
  const modal = new bootstrap.Modal(document.getElementById("pdfPreviewModal"));
  modal.show();
}

// Clear PDF viewer when modal is closed to prevent memory issues
document.addEventListener("DOMContentLoaded", () => {
  const pdfModal = document.getElementById("pdfPreviewModal");
  if (pdfModal) {
    pdfModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("pdfViewer").src = "";
    });
  }
});
