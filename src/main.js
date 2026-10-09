document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.dataset.open = String(!isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 52rem)").matches) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.dataset.open = "false";
    }
  });
}

const gallery = document.querySelector(".gallery-list");

if (gallery) {
  const slides = [...gallery.querySelectorAll(".gallery-placeholder")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
  let timer = null;

  const stopSlideshow = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const showSlide = (index) => {
    slides[currentIndex]?.classList.remove("is-active");
    currentIndex = index;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
  };

  const startSlideshow = () => {
    stopSlideshow();
    if (
      slides.length < 2 ||
      reducedMotion.matches ||
      document.hidden ||
      gallery.matches(":hover") ||
      gallery.contains(document.activeElement)
    ) {
      return;
    }

    timer = window.setInterval(() => {
      showSlide((currentIndex + 1) % slides.length);
    }, 3000);
  };

  const resetSlideshow = () => {
    stopSlideshow();
    gallery.removeAttribute("data-carousel");
    slides.forEach((slide) => {
      slide.classList.remove("is-active");
      slide.removeAttribute("aria-hidden");
    });

    if (slides.length > 1 && !reducedMotion.matches) {
      gallery.dataset.carousel = "true";
      currentIndex = 0;
      showSlide(currentIndex);
      startSlideshow();
    }
  };

  if (slides.length) {
    resetSlideshow();
    gallery.addEventListener("mouseenter", stopSlideshow);
    gallery.addEventListener("mouseleave", startSlideshow);
    gallery.addEventListener("focusin", stopSlideshow);
    gallery.addEventListener("focusout", startSlideshow);
    document.addEventListener("visibilitychange", startSlideshow);
    reducedMotion.addEventListener("change", resetSlideshow);
  }
}
