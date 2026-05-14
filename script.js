const siteHeader = document.getElementById("siteHeader");
const siteLogo = document.getElementById("siteLogo");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

/* HEADER SCROLL */

function updateHeaderOnScroll() {
  if (!siteHeader || !siteLogo) return;

  const isSolid = siteHeader.classList.contains("site-header--solid");
  const isScrolled = window.scrollY > 40;

  if (isScrolled || isSolid) {
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

if (revealItems.length) {
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
}

/* HOME HERO SLIDER */

const slides = document.querySelectorAll(".home-hero__slide");
const dots = document.querySelectorAll("#heroDots button");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");

let currentSlide = 0;
let sliderInterval = null;

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === index);
  });

  currentSlide = index;
}

function nextSlide() {
  if (!slides.length) return;

  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function prevSlide() {
  if (!slides.length) return;

  const prev = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prev);
}

function startSlider() {
  if (!slides.length || slides.length <= 1) return;

  sliderInterval = setInterval(nextSlide, 5000);
}

function resetSlider() {
  if (!slides.length || slides.length <= 1) return;

  clearInterval(sliderInterval);
  startSlider();
}

if (slides.length) {
  showSlide(0);
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

/* INTRO PREMIUM ACCORDION */

const introHighlights = document.querySelectorAll(".intro-highlight");

introHighlights.forEach((item) => {
  item.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    introHighlights.forEach((highlight) => {
      highlight.classList.remove("is-open");
      highlight.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      item.setAttribute("aria-expanded", "true");
    }
  });
});

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

/* SUBTLE PARALLAX ON HOME HERO */

const homeHero = document.querySelector(".home-hero");

function handleHeroParallax() {
  if (!homeHero) return;

  const activeSlideImage = document.querySelector(".home-hero__slide.is-active img");
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

/* DESIGN FEATURES SCROLL LIGHT */

const illuminatedList = document.querySelector(".design-feature-list--illuminated");

function updateDesignLight() {
  if (!illuminatedList) return;

  const rect = illuminatedList.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const start = windowHeight * 0.72;
  const end = windowHeight * 0.22;

  const progress = Math.min(
    Math.max((start - rect.top) / (rect.height + start - end), 0),
    1
  );

  illuminatedList.style.setProperty("--light-progress", `${progress * 100}%`);

  const items = illuminatedList.querySelectorAll(".design-feature-item");

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemMiddle = itemRect.top + itemRect.height * 0.5;

    if (itemMiddle < windowHeight * 0.68) {
      item.classList.add("is-lit");
    } else {
      item.classList.remove("is-lit");
    }
  });
}

window.addEventListener("scroll", updateDesignLight, { passive: true });
window.addEventListener("load", updateDesignLight);

/* PROCESS INTERACTIVE IMAGE */

const processImage = document.getElementById("processImage");
const processOptions = document.querySelectorAll(".process-option");

if (processImage && processOptions.length) {
  processOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const newImage = option.dataset.image;
      const newAlt = option.dataset.alt;

      if (!newImage || processImage.src.includes(newImage)) return;

      processOptions.forEach((item) => item.classList.remove("is-active"));
      option.classList.add("is-active");

      processImage.classList.add("is-changing");

      setTimeout(() => {
        processImage.src = newImage;
        processImage.alt = newAlt || "";
        processImage.classList.remove("is-changing");
      }, 220);
    });
  });
}

/* DIFFERENTIALS MOBILE AUTO CAROUSEL */

const diffTrack = document.querySelector(".home-differentials__inner");
const diffItems = document.querySelectorAll(".home-differentials__item");
const diffProgress = document.querySelector(".diff-progress span");

let diffIndex = 0;
let diffInterval = null;

function moveDifferentialsCarousel() {
  if (!diffTrack || !diffItems.length || window.innerWidth > 768) return;

  const gap = 14;
  const itemWidth = diffItems[0].offsetWidth + gap;

  diffTrack.scrollTo({
    left: diffIndex * itemWidth,
    behavior: "smooth",
  });

  if (diffProgress) {
    diffProgress.style.transform = `translateX(${diffIndex * 100}%)`;
  }
}

function startDifferentialsCarousel() {
  if (!diffTrack || !diffItems.length) return;

  clearInterval(diffInterval);

  if (window.innerWidth > 768) {
    diffTrack.scrollTo({ left: 0 });
    diffIndex = 0;
    return;
  }

  moveDifferentialsCarousel();

  diffInterval = setInterval(() => {
    diffIndex = (diffIndex + 1) % diffItems.length;
    moveDifferentialsCarousel();
  }, 3000);
}

window.addEventListener("load", startDifferentialsCarousel);
window.addEventListener("resize", startDifferentialsCarousel);