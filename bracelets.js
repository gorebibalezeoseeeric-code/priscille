// Renseignez le numéro au format international, sans espaces ni signe +.
const BRACELET_STORE = {
  whatsappNumber: "22564454868",
  phoneNumber: "+225 64 45 48 68",
  socialLinks: [
    // { label: "Instagram", url: "https://instagram.com/votre-compte" },
    // { label: "Facebook", url: "https://facebook.com/votre-page" },
  ],
};

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

function closeMenu() {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const carousel = document.querySelector(".carousel");
const carouselTrack = carousel?.querySelector(".carousel-track");
const slides = carouselTrack ? Array.from(carouselTrack.children) : [];
const dots = carousel ? Array.from(carousel.querySelectorAll(".carousel-dot")) : [];
const currentSlideLabel = carousel?.querySelector("[data-current-slide]");
const previousNextButtons = carousel?.querySelectorAll("[data-direction]");
let activeSlide = 0;
let autoplayTimer;

function showSlide(index, behavior = "smooth") {
  if (!carouselTrack || slides.length === 0) return;

  activeSlide = (index + slides.length) % slides.length;
  carouselTrack.scrollTo({
    left: slides[activeSlide].offsetLeft,
    behavior,
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });

  if (currentSlideLabel) {
    currentSlideLabel.textContent = String(activeSlide + 1).padStart(2, "0");
  }
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index));
});

previousNextButtons?.forEach((button) => {
  button.addEventListener("click", () => {
    showSlide(activeSlide + Number(button.dataset.direction));
  });
});

if (carouselTrack) {
  carouselTrack.addEventListener("scroll", () => {
    const nextIndex = Math.round(carouselTrack.scrollLeft / carouselTrack.clientWidth);
    if (nextIndex !== activeSlide && nextIndex >= 0 && nextIndex < slides.length) {
      activeSlide = nextIndex;
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeSlide;
        dot.classList.toggle("is-active", isActive);
        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
      if (currentSlideLabel) {
        currentSlideLabel.textContent = String(activeSlide + 1).padStart(2, "0");
      }
    }
  });
}

function stopAutoplay() {
  window.clearInterval(autoplayTimer);
}

function startAutoplay() {
  stopAutoplay();
  if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  autoplayTimer = window.setInterval(() => {
    if (!document.hidden) showSlide(activeSlide + 1);
  }, 5000);
}

if (carousel) {
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoplay();
  });
  carousel.addEventListener("touchstart", stopAutoplay, { passive: true });
  carousel.addEventListener("touchend", startAutoplay, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  startAutoplay();
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const whatsappNumber = BRACELET_STORE.whatsappNumber.replace(/\D/g, "");

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  if (!whatsappNumber) return;

  const message = link.dataset.whatsappMessage || "Bonjour, je souhaite en savoir plus sur vos bracelets.";
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const contactNote = document.querySelector("[data-contact-note]");
if (contactNote && whatsappNumber) contactNote.hidden = true;

const phoneLink = document.querySelector("[data-phone]");

if (phoneLink && BRACELET_STORE.phoneNumber.trim()) {
  const phoneNumber = BRACELET_STORE.phoneNumber.trim();
  phoneLink.href = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
  phoneLink.textContent = phoneNumber;
} else if (phoneLink) {
  phoneLink.hidden = true;
}

const socialLinksContainer = document.querySelector("[data-social-links]");

BRACELET_STORE.socialLinks.forEach(({ label, url }) => {
  if (!label || !url) return;

  const link = document.createElement("a");
  link.href = url;
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  socialLinksContainer?.append(link);
});

const yearLabel = document.querySelector("[data-year]");
if (yearLabel) yearLabel.textContent = String(new Date().getFullYear());
