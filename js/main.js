(function () {
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.controls = false;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroVideo.play().catch(() => {});
    }
  }

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      siteNav.classList.toggle("is-open", !open);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        siteNav.classList.remove("is-open");
      });
    });
  }

  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item[data-lightbox]");

  function getVisibleGalleryItems() {
    return Array.from(galleryItems).filter((el) => !el.classList.contains("is-hidden"));
  }

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        galleryItems.forEach((item) => {
          const show = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox && galleryItems.length) {
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    let visibleItems = [];
    let currentIndex = 0;
    let lastFocused = null;

    function refreshVisibleItems() {
      visibleItems = getVisibleGalleryItems().map((link) => ({
        el: link,
        src: link.getAttribute("href"),
        title:
          link.querySelector("span")?.textContent?.trim() ||
          link.querySelector("img")?.alt ||
          "",
      }));
    }

    function show(index) {
      if (!visibleItems.length) return;
      currentIndex = (index + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentIndex];
      lightboxImage.classList.add("is-loading");
      lightboxImage.onload = () => lightboxImage.classList.remove("is-loading");
      lightboxImage.src = item.src;
      lightboxImage.alt = item.title;
      lightboxCaption.textContent = item.title;
    }

    function open(index) {
      refreshVisibleItems();
      if (!visibleItems.length) return;
      lastFocused = document.activeElement;
      show(index);
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function close() {
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      lightboxImage.src = "";
      lastFocused?.focus();
    }

    galleryItems.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        refreshVisibleItems();
        const index = visibleItems.findIndex((item) => item.el === link);
        open(index >= 0 ? index : 0);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(currentIndex - 1));
    nextBtn.addEventListener("click", () => show(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  }

  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    let current = 0;
    let timer;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      timer = setInterval(next, 5000);
    }

    function resetAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    prevBtn?.addEventListener("click", () => {
      goTo(current - 1);
      resetAutoplay();
    });
    nextBtn?.addEventListener("click", () => {
      next();
      resetAutoplay();
    });
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        goTo(i);
        resetAutoplay();
      })
    );

    goTo(0);
    startAutoplay();
  }

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const formNext = document.getElementById("form-next");
    if (formNext) {
      const returnUrl = new URL("contact.html", window.location.href);
      returnUrl.searchParams.set("success", "1");
      formNext.value = returnUrl.toString();
    }

    if (new URLSearchParams(window.location.search).get("success") === "1") {
      document.getElementById("form-success")?.classList.add("visible");
      contactForm.hidden = true;
    }
  }
})();
