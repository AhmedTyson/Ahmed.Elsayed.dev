// DOM Elements
const themeSwitcher = document.getElementById("theme-switcher");
const navLinks = document.querySelectorAll(".nav-link");
const progressBar = document.getElementById("progress-bar");
const typingText = document.getElementById("typing-text");
const downloadCvBtn = document.getElementById("download-cv");
const downloadResumeBtn = document.getElementById("download-resume");
const backToTopButton = document.querySelector(".back-to-top");

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.themes = ["light", "dark", "gradient"];
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.updateActiveButton();

    if (themeSwitcher) {
      const themeOptions = themeSwitcher.querySelectorAll(".theme-option");
      themeOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedTheme = option.getAttribute("data-theme");
          this.setTheme(selectedTheme);
          this.updateActiveButton();
        });
      });
    }
  }

  setTheme(theme) {
    if (!this.themes.includes(theme)) {
      theme = "light";
    }

    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;

    // Add smooth transition effect
    document.body.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    setTimeout(() => {
      document.body.style.transition = "";
    }, 500);
  }

  updateActiveButton() {
    if (!themeSwitcher) return;

    const themeOptions = themeSwitcher.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      const theme = option.getAttribute("data-theme");
      if (theme === this.currentTheme) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    this.setTheme(nextTheme);
    this.updateActiveButton();
  }
}

// Typing Animation
class TypingAnimation {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = {
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseDuration: 2000,
      loop: true,
      ...options,
    };
    this.currentIndex = 0;
    this.currentText = "";
    this.isDeleting = false;
    this.init();
  }

  init() {
    this.type();
  }

  type() {
    const fullText = this.texts[this.currentIndex];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    this.element.textContent = this.currentText;

    let typeSpeed = this.isDeleting
      ? this.options.deleteSpeed
      : this.options.typeSpeed;

    if (!this.isDeleting && this.currentText === fullText) {
      typeSpeed = this.options.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === "") {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll("section[id]");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.isScrolling = false;
    this.currentActiveId = "hero"; // Default to hero section
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupIntersectionObserver();
    this.setupScrollListener();
    this.setupMobileNavToggle();
    // Set initial active state
    this.updateActiveLink(this.currentActiveId);
  }

  setupSmoothScrolling() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        // Only prevent default for anchor links
        if (href && href.startsWith("#")) {
          e.preventDefault();

          const targetId = href.slice(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            this.isScrolling = true;
            this.currentActiveId = targetId;

            // Update active link immediately for better UX
            this.updateActiveLink(targetId);

            // Close mobile navbar if open
            this.closeMobileNav();

            // Add visual feedback during scroll
            this.addScrollingFeedback();

            const navHeight =
              document.querySelector(".navbar")?.offsetHeight || 80;
            const targetTop = targetSection.offsetTop - navHeight - 20;

            // Enhanced smooth scrolling with custom animation
            this.smoothScrollTo(Math.max(0, targetTop), 800);

            // Reset scrolling flag after animation completes
            setTimeout(() => {
              this.isScrolling = false;
              this.removeScrollingFeedback();
            }, 1000);
          }
        }
        // For non-anchor links, do NOT prevent default
      });
    });
  }

  // Add visual feedback during scrolling
  addScrollingFeedback() {
    document.body.style.pointerEvents = "none";
    document.body.style.cursor = "wait";

    // Add a subtle overlay to indicate scrolling
    const overlay = document.createElement("div");
    overlay.id = "scroll-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.02);
      z-index: 9998;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
  }

  // Remove visual feedback after scrolling
  removeScrollingFeedback() {
    document.body.style.pointerEvents = "";
    document.body.style.cursor = "";

    const overlay = document.getElementById("scroll-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
  }

  // Enhanced smooth scrolling function
  smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smoother animation (ease-in-out-cubic)
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Ensure we end up exactly at the target position
        window.scrollTo(0, targetPosition);
      }
    };

    requestAnimationFrame(animation);
  }

  // Add this new method
  setupMobileNavToggle() {
    // Close navbar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      const navbar = document.querySelector(".navbar-collapse");
      const toggler = document.querySelector(".navbar-toggler");

      if (navbar && navbar.classList.contains("show")) {
        if (!navbar.contains(e.target) && !toggler.contains(e.target)) {
          this.closeMobileNav();
        }
      }
    });

    // Close navbar on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileNav();
      }
    });
  }

  // Add this new method
  closeMobileNav() {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      // Use Bootstrap's collapse functionality if available
      if (window.bootstrap && window.bootstrap.Collapse) {
        const bsCollapse =
          window.bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          // Fallback: manually remove classes
          navbarCollapse.classList.remove("show");
          if (navbarToggler) {
            navbarToggler.classList.add("collapsed");
            navbarToggler.setAttribute("aria-expanded", "false");
          }
        }
      } else {
        // Fallback: manually remove classes
        navbarCollapse.classList.remove("show");
        if (navbarToggler) {
          navbarToggler.classList.add("collapsed");
          navbarToggler.setAttribute("aria-expanded", "false");
        }
      }
    }
  }

  updateActiveLink(activeId) {
    // Update current active ID
    this.currentActiveId = activeId;

    this.navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  setupIntersectionObserver() {
    if (!this.sections.length) return;

    const observerOptions = {
      threshold: [0.1, 0.3, 0.5, 0.7],
      rootMargin: "-80px 0px -50% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      if (this.isScrolling) return;

      let mostVisibleSection = null;
      let maxVisibility = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const visibleHeight =
            Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibilityRatio = visibleHeight / rect.height;

          if (visibilityRatio > maxVisibility) {
            maxVisibility = visibilityRatio;
            mostVisibleSection = entry.target;
          }
        }
      });

      if (mostVisibleSection) {
        const id = mostVisibleSection.getAttribute("id");
        if (id !== this.currentActiveId) {
          this.updateActiveLink(id);
        }
      }
    }, observerOptions);

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  setupScrollListener() {
    let scrollTimeout;

    window.addEventListener(
      "scroll",
      () => {
        if (this.isScrolling) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.checkActiveSection();
        }, 50);
      },
      { passive: true }
    );
  }

  checkActiveSection() {
    if (this.isScrolling) return;

    const navHeight = document.querySelector(".navbar")?.offsetHeight || 80;
    const scrollPosition = window.pageYOffset + navHeight + 100;

    let activeSection = null;
    let minDistance = Infinity;

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionCenter = sectionTop + sectionHeight / 2;
      const distance = Math.abs(scrollPosition - sectionCenter);

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        if (distance < minDistance) {
          minDistance = distance;
          activeSection = section;
        }
      }
    });

    // Handle edge cases
    if (!activeSection) {
      if (window.pageYOffset < 100) {
        activeSection = this.sections[0]; // First section (hero)
      } else if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 50
      ) {
        activeSection = this.sections[this.sections.length - 1]; // Last section
      }
    }

    if (activeSection) {
      const id = activeSection.getAttribute("id");
      if (id && id !== this.currentActiveId) {
        this.updateActiveLink(id);
      }
    }
  }
}

// Scroll Progress Indicator
class ScrollProgressIndicator {
  constructor() {
    this.init();
  }

  init() {
    if (!progressBar) return;
    window.addEventListener("scroll", this.updateProgress.bind(this), {
      passive: true,
    });
  }

  updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = `${Math.min(scrolled, 100)}%`;
  }
}

// Back to top button functionality
class BackToTop {
  constructor() {
    this.init();
  }

  init() {
    if (!backToTopButton) return;

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// CV Download Manager
class CVDownloadManager {
  constructor() {
    this.init();
  }

  init() {
    if (downloadCvBtn) {
      downloadCvBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.downloadCV();
      });
    }

    if (downloadResumeBtn) {
      downloadResumeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.downloadCV();
      });
    }
  }

  downloadCV() {
    const filePath = "./assets/Ahmed_Elsayed_NET_Developer_CV.pdf"; // ensure this file exists

    const link = document.createElement("a");
    link.href = filePath;
    link.setAttribute("download", "Ahmed_Elsayed_NET_Developer_CV.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showDownloadMessage();
  }

  showDownloadMessage() {
    // Create temporary success message
    const message = document.createElement("div");
    message.textContent = "CV downloaded successfully!";
    message.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease-out;
                `;

    const style = document.createElement("style");
    style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
    document.head.appendChild(style);
    document.body.appendChild(message);

    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 3000);
  }
}

// Scroll Reveal Animation
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll(
      ".project-card, .skill-category, .cert-item, .education-item, .cv-section"
    );
    this.init();
  }

  init() {
    if (!this.elements.length) return;
    this.elements.forEach((element) => element.classList.add("reveal"));
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("active"), index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach((element) => observer.observe(element));
  }
}

// Skills Animation
class SkillsAnimation {
  constructor() {
    this.progressBars = document.querySelectorAll(".skill-progress-fill");
    this.init();
  }

  init() {
    if (this.progressBars.length === 0) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px 0px -100px 0px",
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.progressBars.forEach((bar) => observer.observe(bar));
  }

  animateProgressBar(progressBar) {
    const targetWidth = progressBar.getAttribute("data-width");
    setTimeout(() => {
      progressBar.style.width = `${targetWidth}%`;
    }, Math.random() * 200);
  }
}

// Counter Animation
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll(".counter-number");
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px 0px -100px 0px",
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(counter) {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (target - startValue) * easeOutQuart
      );
      counter.textContent = currentValue;
      if (progress < 1) requestAnimationFrame(updateCounter);
      else counter.textContent = target;
    };

    requestAnimationFrame(updateCounter);
  }
}

// Portfolio Filter
class PortfolioFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectCards = document.querySelectorAll(".project-card");
    this.init();
  }

  init() {
    if (!this.filterButtons.length || !this.projectCards.length) return;

    this.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const filter = e.currentTarget.getAttribute("data-filter");
        this.filterProjects(filter);
        this.updateActiveButton(e.currentTarget);
      });
    });
  }

  filterProjects(filter) {
    this.projectCards.forEach((card, index) => {
      const category = card.getAttribute("data-category");
      const shouldShow = filter === "all" || category === filter;

      if (shouldShow) {
        setTimeout(() => {
          card.style.display = "block";
          card.classList.remove("fade-out");
          card.classList.add("fade-in");
        }, index * 100);
      } else {
        card.classList.remove("fade-in");
        card.classList.add("fade-out");
        setTimeout(() => {
          if (card.classList.contains("fade-out")) card.style.display = "none";
        }, 400);
      }
    });
  }

  updateActiveButton(activeButton) {
    this.filterButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }
}

// Photo Upload Manager
class PhotoUploadManager {
  constructor() {
    this.photoUpload = document.getElementById("photo-upload");
    this.picturePlaceholder = document.getElementById("picture-placeholder");
    this.profileImage = document.getElementById("profile-image");
    this.pictureContent = document.getElementById("picture-content");
    this.init();
  }

  init() {
    if (!this.photoUpload || !this.picturePlaceholder) return;

    // Load saved photo on page load
    this.loadSavedPhoto();

    // Click handler for placeholder
    this.picturePlaceholder.addEventListener("click", () => {
      this.photoUpload.click();
    });

    // File input change handler
    this.photoUpload.addEventListener("change", (e) => {
      this.handlePhotoUpload(e);
    });

    // Drag and drop functionality
    this.setupDragAndDrop();
  }

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      this.showMessage("Please select a valid image file.", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage("Please select an image smaller than 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.setProfileImage(e.target.result);
      this.savePhotoToStorage(e.target.result);
      this.showMessage("Photo uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  }

  setProfileImage(imageSrc) {
    this.profileImage.src = imageSrc;
    this.profileImage.style.display = "block";
    this.picturePlaceholder.classList.add("has-image");
  }

  setupDragAndDrop() {
    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.picturePlaceholder.addEventListener(
        eventName,
        this.preventDefaults,
        false
      );
    });

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach((eventName) => {
      this.picturePlaceholder.addEventListener(
        eventName,
        () => {
          this.picturePlaceholder.classList.add("drag-highlight");
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.picturePlaceholder.addEventListener(
        eventName,
        () => {
          this.picturePlaceholder.classList.remove("drag-highlight");
        },
        false
      );
    });

    // Handle dropped files
    this.picturePlaceholder.addEventListener(
      "drop",
      (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
          this.photoUpload.files = files;
          this.handlePhotoUpload({ target: { files } });
        }
      },
      false
    );
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  savePhotoToStorage(imageSrc) {
    try {
      localStorage.setItem("profilePhoto", imageSrc);
    } catch (error) {
      console.warn("Could not save photo to localStorage:", error);
    }
  }

  loadSavedPhoto() {
    try {
      const savedPhoto = localStorage.getItem("profilePhoto");
      if (savedPhoto) {
        this.setProfileImage(savedPhoto);
      }
    } catch (error) {
      console.warn("Could not load saved photo:", error);
    }
  }

  showMessage(text, type = "info") {
    const message = document.createElement("div");
    message.textContent = text;
    message.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: ${
                      type === "error"
                        ? "#dc3545"
                        : type === "success"
                        ? "#28a745"
                        : "#007bff"
                    };
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease-out;
                `;

    document.body.appendChild(message);

    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
  }
}

// Project Page Navigation
class ProjectPageNavigation {
  constructor() {
    this.projectNav = document.querySelector(".project-nav");
    if (this.projectNav) {
      this.init();
    }
  }

  init() {
    this.setupProjectNavigation();
    this.setupMobileScrollBehavior();
  }

  setupProjectNavigation() {
    if (!this.projectNav) return;

    const projectNavLinks = this.projectNav.querySelectorAll(".nav-link");

    projectNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Update active nav state
          projectNavLinks.forEach((navLink) =>
            navLink.classList.remove("active")
          );
          link.classList.add("active");

          // Calculate scroll position accounting for sticky nav
          const navHeight =
            document.querySelector(".navbar")?.offsetHeight || 80;
          const projectNavHeight = this.projectNav.offsetHeight || 60;
          const targetTop =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight -
            projectNavHeight -
            20;

          // Smooth scroll to section
          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth",
          });
        }
      });
    });

    // Update active state on scroll for project pages
    if (projectNavLinks.length > 0) {
      window.addEventListener("scroll", () => {
        this.updateActiveProjectNav(projectNavLinks);
      });
    }
  }

  updateActiveProjectNav(projectNavLinks) {
    if (!this.projectNav) return;

    const navHeight = document.querySelector(".navbar")?.offsetHeight || 80;
    const projectNavHeight = this.projectNav.offsetHeight || 60;
    const scrollPosition =
      window.pageYOffset + navHeight + projectNavHeight + 50;

    const sections = document.querySelectorAll(".project-section[id]");
    let activeId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        activeId = section.id;
      }
    });

    if (activeId) {
      projectNavLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${activeId}`) {
          link.classList.add("active");
        }
      });
    }
  }

  setupMobileScrollBehavior() {
    if (!this.projectNav) return;

    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      if (window.innerWidth <= 768) {
        if (window.scrollY > lastScroll && window.scrollY > 80) {
          this.projectNav.classList.add("hide-on-scroll");
        } else {
          this.projectNav.classList.remove("hide-on-scroll");
        }
        lastScroll = window.scrollY;
      }
    });
  }
}

// App Initialization
class App {
  constructor() {
    this.loadingStartTime = Date.now();
    this.init();
  }

  init() {
    // Show loading indicator
    this.showLoadingIndicator();
    
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        this.initializeComponents.bind(this)
      );
    } else {
      this.initializeComponents();
    }
  }

  showLoadingIndicator() {
    // Add loading styles if not already present
    if (!document.getElementById('loading-styles')) {
      const loadingStyles = document.createElement('style');
      loadingStyles.id = 'loading-styles';
      loadingStyles.textContent = `
        .page-loading {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        .page-loaded {
          opacity: 1;
        }
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease-in-out;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(loadingStyles);
    }

    // Add loading class to body
    document.body.classList.add('page-loading');
  }

  hideLoadingIndicator() {
    // Ensure minimum loading time for smooth experience
    const minLoadingTime = 500;
    const elapsedTime = Date.now() - this.loadingStartTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
    
    setTimeout(() => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
      
      // Remove loading overlay if it exists
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
          if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
          }
        }, 500);
      }
    }, remainingTime);
  }

  initializeComponents() {
    try {
      // Initialize core components
      new ThemeManager();
      new NavigationManager();
      new ScrollProgressIndicator();
      new ScrollReveal();
      new BackToTop();
      new CVDownloadManager();
      new CounterAnimation();
      new SkillsAnimation();
      new PortfolioFilter();
      new PhotoUploadManager();
      new ProjectPageNavigation();

      // Initialize typing animation
      if (typingText) {
        const typingTexts = [
          "Aspiring .NET Full Stack Developer",
          "Business Information Systems Student",
          "Python & C# Developer",
          "Database Systems Designer",
          "AI-Augmented Solutions Builder",
          "Problem Solver",
        ];

        new TypingAnimation(typingText, typingTexts, {
          typeSpeed: 80,
          deleteSpeed: 40,
          pauseDuration: 2500,
        });
      }

      // Add loading animation to page elements
      this.animatePageLoad();
      
      // Hide loading indicator after initialization
      this.hideLoadingIndicator();
      
      console.log("Portfolio initialized successfully");
    } catch (error) {
      console.error("Error initializing portfolio:", error);
      this.initializeFallbacks();
      this.hideLoadingIndicator();
    }
  }

  animatePageLoad() {
    const sections = document.querySelectorAll("section");

    sections.forEach((section, index) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";

      setTimeout(() => {
        section.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out";
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  initializeFallbacks() {
    console.log("Initializing fallbacks...");

    // Basic theme switcher fallback
    if (themeSwitcher) {
      const themeOptions = themeSwitcher.querySelectorAll(".theme-option");
      themeOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedTheme = option.getAttribute("data-theme");
          document.body.setAttribute("data-theme", selectedTheme);
          localStorage.setItem("theme", selectedTheme);

          // Update active state
          themeOptions.forEach(opt => opt.classList.remove("active"));
          option.classList.add("active");
        });
      });
    }

    // Basic smooth scrolling fallback
    if (navLinks.length > 0) {
      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");
          if (href && href.startsWith("#")) {
            const targetId = href.slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
              const navHeight = 80;
              const targetTop = targetSection.offsetTop - navHeight;

              window.scrollTo({
                top: targetTop,
                behavior: "smooth",
              });
            }
          }
        });
      });
    }

    // Basic CV download fallback
    if (downloadCvBtn) {
      downloadCvBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert(
          "CV download feature is being prepared. Please contact me directly at ahmed.elsayed.abdelal.2025@gmail.com for my latest CV."
        );
      });
    }

    if (downloadResumeBtn) {
      downloadResumeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert(
          "CV download feature is being prepared. Please contact me directly at ahmed.elsayed.abdelal.2025@gmail.com for my latest CV."
        );
      });
    }
  }
}

// Initialize the application
new App();

// Mobile project navigation scroll handler (handled in ProjectPageNavigation class)
// This duplicate handler has been removed to prevent conflicts
