const siteHeader = document.getElementById("siteHeader");
const siteLogo = document.getElementById("siteLogo");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

function updateHeaderOnScroll() {
  const isScrolled = window.scrollY > 40;

  if (isScrolled) {
    siteHeader.classList.add("is-scrolled");
    siteLogo.src = siteLogo.dataset.logoDark;
  } else {
    siteHeader.classList.remove("is-scrolled");
    siteLogo.src = siteLogo.dataset.logoLight;
  }
}

window.addEventListener("scroll", updateHeaderOnScroll);
window.addEventListener("load", updateHeaderOnScroll);

/* MOBILE MENU */
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* REVEAL ON SCROLL */
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 0.04, 0.18)}s`;
  revealObserver.observe(item);
});

/* HERO SLIDER */
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll("#heroDots button");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");

let currentSlide = 0;
let sliderInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === index);
  });

  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prev);
}

function startSlider() {
  sliderInterval = setInterval(nextSlide, 5000);
}

function resetSlider() {
  clearInterval(sliderInterval);
  startSlider();
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetSlider();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetSlider();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    resetSlider();
  });
});

showSlide(0);
startSlider();

/* SMOOTH SCROLL WITH HEADER OFFSET */
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});

/* SUBTLE PARALLAX ON HERO */
const heroSection = document.querySelector(".hero-slider");

function handleHeroParallax() {
  if (!heroSection) return;

  const activeSlideImage = document.querySelector(".hero-slide.is-active img");
  if (!activeSlideImage) return;

  const scrollY = window.scrollY;
  const limit = 120;

  if (scrollY <= window.innerHeight) {
    const moveY = Math.min(scrollY * 0.12, limit);
    activeSlideImage.style.transform = `scale(1.08) translateY(${moveY}px)`;
  }
}

window.addEventListener("scroll", handleHeroParallax, { passive: true });
window.addEventListener("load", handleHeroParallax);