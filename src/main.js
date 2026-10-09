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
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector(".lightbox__image");

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
      lightbox?.open ||
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

    if (lightbox && lightboxImage) {
      const galleryImages = [...gallery.querySelectorAll("img")];
      const openLightbox = (image) => {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        stopSlideshow();
        lightbox.showModal();
      };

      galleryImages.forEach((image) => {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute(
          "aria-label",
          image.alt ? `Open image: ${image.alt}` : "Open gallery image"
        );
      });

      gallery.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const clickedImage = event.target.closest("img");
        if (clickedImage && gallery.contains(clickedImage)) openLightbox(clickedImage);
      });

      gallery.addEventListener("keydown", (event) => {
        if (
          event.target instanceof HTMLImageElement &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          openLightbox(event.target);
        }
      });

      lightbox.querySelector(".lightbox__close")?.addEventListener("click", () => {
        lightbox.close();
      });

      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
      });

      lightbox.addEventListener("close", () => {
        lightboxImage.removeAttribute("src");
        lightboxImage.alt = "";
        startSlideshow();
      });
    }
  }
}
