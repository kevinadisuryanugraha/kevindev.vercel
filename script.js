// 1. Typing Effect Logic
const textElement = document.getElementById("typewriter");
const phrases = [
  "Web Developer",
  "AI Antusias",
  "Mahasiswa",
  "UI/UX Design",
]; // Removed trailing dots for a cleaner cursor look
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

// Add a cursor element in HTML programmatically if not present, but for now we just append a span
function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // textElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 40; // Faster when deleting
  } else {
    // textElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 120; // Normal typing speed
  }

  // Inject text with a blinking cursor span
  textElement.innerHTML = currentPhrase.substring(0, charIndex) + `<span class="typing-cursor">|</span>`;

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end before deleting
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

// 4. Form Handling (Direct to WhatsApp)
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const originalText = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengalihkan...';
  btn.disabled = true;

  // Get values from form inputs
  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const subject = document.getElementById("cf-subject").value;
  const message = document.getElementById("cf-message").value;

  // Format WhatsApp message
  const waNumber = "6289616682955";
  const waText = `Halo Kevin, saya ${name} (${email}).%0A%0ASubjek: ${subject}%0A%0A${message}`;
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

  // Redirect to WhatsApp
  setTimeout(() => {
    window.open(waUrl, "_blank");
    e.target.reset();
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 800);

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
