
class ImageSlider {
  constructor(slider) {
    this.slider = slider;
    this.track = slider.querySelector(".slider-track");
    this.dotsContainer = slider.querySelector(".slider-dots");
    this.prevButton = slider.querySelector(".prev");
    this.nextButton = slider.querySelector(".next");

    this.originalSlides = Array.from(
      this.track.querySelectorAll(".slide")
    );

    this.slideCount = this.originalSlides.length;
    this.currentIndex = 1;

    if (this.slideCount === 0) return;

    this.createInfiniteLoop();
    this.createDots();
    this.bindEvents();
    this.updateSlider(false);
  }

  // Clone the last and first slides to create an infinite loop.
  createInfiniteLoop() {
    const firstClone = this.originalSlides[0].cloneNode(true);
    const lastClone =
      this.originalSlides[this.slideCount - 1].cloneNode(true);

    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    this.track.appendChild(firstClone);
    this.track.insertBefore(lastClone, this.originalSlides[0]);
  }

  // Create one clickable dot for each original slide.
  createDots() {
    this.originalSlides.forEach((slide, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.setAttribute("aria-label", `Go to image ${index + 1}`);
      dot.addEventListener("click", () => {
        this.goToSlide(index);
      });

      this.dotsContainer.appendChild(dot);
    });

    this.dots = Array.from(
      this.dotsContainer.querySelectorAll("button")
    );
  }

  // Connect all slider controls.
  bindEvents() {
    this.nextButton.addEventListener("click", () => {
      this.next();
    });

    this.prevButton.addEventListener("click", () => {
      this.previous();
    });

    this.track.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;

      // If we reach the last clone, jump to the first real slide.
      if (this.currentIndex === this.slideCount + 1) {
        this.currentIndex = 1;
        this.updateSlider(false);
      }

      // If we reach the first clone, jump to the last real slide.
      if (this.currentIndex === 0) {
        this.currentIndex = this.slideCount;
        this.updateSlider(false);
      }
    });

    // Keep the layout correct when the viewport resizes.
    window.addEventListener("resize", () => {
      this.updateSlider(false);
    });
  }

  // Move to the next slide.
  next() {
    this.currentIndex++;
    this.updateSlider(true);
  }

  // Move to the previous slide.
  previous() {
    this.currentIndex--;
    this.updateSlider(true);
  }

  // Navigate directly to an original slide using its dot.
  goToSlide(index) {
    this.currentIndex = index + 1;
    this.updateSlider(true);
  }

  // Calculate the horizontal offset and synchronize the dots.
  updateSlider(animate = true) {
    this.track.style.transition = animate
      ? ""
      : "none";

    const offset = this.currentIndex * 100;

    this.track.style.transform = `translateX(-${offset}%)`;

    const activeDotIndex =
      (this.currentIndex - 1 + this.slideCount) %
      this.slideCount;

    this.dots.forEach((dot, index) => {
      const isActive = index === activeDotIndex;

      dot.classList.toggle("active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (!animate) {
      // Apply the clone-position correction immediately.
      this.track.getBoundingClientRect();
      this.track.style.transition = "";
    }
  }
}

// Initialize every slider on the page.
document.querySelectorAll(".slider").forEach((slider) => {
  new ImageSlider(slider);
});
