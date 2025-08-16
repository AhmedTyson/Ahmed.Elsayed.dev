      // DOM Elements
      const themeToggle = document.getElementById("theme-toggle");
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
          this.init();
        }

        init() {
          this.setTheme(this.currentTheme);
          this.updateThemeIcon();

          if (themeToggle) {
            themeToggle.addEventListener("click", (e) => {
              e.preventDefault();
              this.toggleTheme();
            });
          }
        }

        setTheme(theme) {
          document.body.setAttribute("data-theme", theme);
          localStorage.setItem("theme", theme);
          this.currentTheme = theme;
        }

        toggleTheme() {
          const newTheme = this.currentTheme === "light" ? "dark" : "light";
          this.setTheme(newTheme);
          this.updateThemeIcon();
        }

        updateThemeIcon() {
          const icon = themeToggle?.querySelector(".theme-icon");
          if (icon) {
            if (this.currentTheme === "light") {
              icon.className = "fas fa-moon theme-icon";
            } else {
              icon.className = "fas fa-sun theme-icon";
            }
          }
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
            this.currentText = fullText.substring(
              0,
              this.currentText.length - 1
            );
          } else {
            this.currentText = fullText.substring(
              0,
              this.currentText.length + 1
            );
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
          // Set initial active state
          this.updateActiveLink(this.currentActiveId);
        }

        setupSmoothScrolling() {
          this.navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
              e.preventDefault();

              const href = link.getAttribute("href");
              if (!href || !href.startsWith("#")) return;

              const targetId = href.slice(1);
              const targetSection = document.getElementById(targetId);

              if (targetSection) {
                this.isScrolling = true;
                this.currentActiveId = targetId;

                // Update active link immediately for better UX
                this.updateActiveLink(targetId);

                const navHeight =
                  document.querySelector(".navbar")?.offsetHeight || 80;
                const targetTop = targetSection.offsetTop - navHeight - 10;

                window.scrollTo({
                  top: Math.max(0, targetTop),
                  behavior: "smooth",
                });

                // Reset scrolling flag after animation completes
                setTimeout(() => {
                  this.isScrolling = false;
                }, 1000);
              }
            });
          });
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
                  Math.min(rect.bottom, window.innerHeight) -
                  Math.max(rect.top, 0);
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

          const navHeight =
            document.querySelector(".navbar")?.offsetHeight || 80;
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
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
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
          // Create a comprehensive CV text content for download
          const cvContent = this.generateCVText();

          // Create a blob with the CV content
          const blob = new Blob([cvContent], {
            type: "text/plain;charset=utf-8",
          });

          // Create download link
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "Ahmed_Elsayed_NET_Developer_CV.pdf";

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          URL.revokeObjectURL(link.href);

          // Show success message
          this.showDownloadMessage();
        }

        generateCVText() {
          return `AHMED ELSAYED ABDEL-AL
Aspiring .NET Full Stack Developer

CONTACT INFORMATION
Email: ahmed.elsayed.abdelal.2025@gmail.com
Phone: +20 11 0028 4827
Location: Qalyubia, Egypt
LinkedIn: https://linkedin.com/in/ahmed-elsayed-8b9bba28a
GitHub: https://github.com/AhmedTyson

PROFESSIONAL SUMMARY
Business Information Systems undergraduate (GPA: 3.58) with a strong foundation in full-stack web development, Python programming, and database systems, alongside proficiency in .NET Framework/Core and C# for enterprise application development. Seeking an entry-level .NET Full Stack Developer position to apply programming expertise and web development experience to the .NET ecosystem, contribute to enterprise solutions using C#, ASP.NET, and SQL Server, and leverage business acumen to build user-centered software in a professional agile environment.

EDUCATION
Bachelor of Business Information Systems
Helwan University, Cairo
2023 – 2027 (Expected)
GPA: 3.58 (Excellent)

Relevant Coursework:
• System Analysis & Programming
• Database Systems
• Business Process Management
• Financial Analysis
• Statistics & Operations Management

TECHNICAL SKILLS

Programming Languages:
Python, C#, C++, SQL, JavaScript, VB (Visual Basic)

Frameworks & Libraries:
.NET Framework/Core, Entity Framework, Django, Tkinter, ASP.NET, Flask, Bootstrap

Web Development:
HTML5/CSS3, REST APIs, Flask-SocketIO, Front-End Development

Database Systems:
PostgreSQL, SQL Server, SQLAlchemy, Database Design, Query Optimization

Development Tools:
Git Version Control, Visual Studio Code, Visual Studio, AI-assisted Development, Agile Development, Code Review

Soft Skills:
Problem Solving, Team Collaboration, Communication Skills, Adaptability

PROJECTS

Sierra ILS Library Management System (May 2025)
• OOP-based library management system with comprehensive functionality using Python
• Implemented .NET design patterns and SOLID principles
• Developed book management with validation, error handling, and dynamic menu systems
• Technologies: Python, OOP, .NET Design Patterns, SOLID Principles
• GitHub: https://github.com/AhmedTyson/college-project-assignment-1/tree/main/Library%20Management%20System

Car Loan Calculator Application (May 2025)
• Financial modeling GUI application with comprehensive calculation features
• Created real-time calculations with Python Tkinter and complex algorithms
• Implemented comprehensive error handling and user-friendly interface
• Technologies: Python, Tkinter, GUI Development
• GitHub: https://github.com/AhmedTyson/college-project-assignment-1/tree/main/Car%20Loan%20Calculator%20Application

Pet Adoption Website (PETOPIA) (March 2025)
• Pet adoption platform with modern web interface and responsive design
• Developed using HTML5, CSS3, and mobile-first design approach
• Applied semantic HTML with frontend validation and cross-device compatibility
• Technologies: HTML5, CSS3, JavaScript, Responsive Design
• GitHub: https://github.com/AhmedTyson/PETOBIA-student-activity-team-project

Personal Assistant Web App (September 2024)
• AI-powered web application with intelligent responses using GPT-3 integration
• Built full-stack application using Python Flask, PostgreSQL, and RESTful APIs
• Integrated external APIs, authentication, and real-time chat functionality
• Technologies: Flask, Python, PostgreSQL, GPT-3, REST APIs
• GitHub: https://github.com/AhmedTyson/Personal-Assistance-ItI---Python-

Portfolio Website (August 2024)
• Personal portfolio website with responsive design and modern interface
• Designed and developed responsive site using HTML and CSS
• Focused on clean layout presentation and cross-device compatibility
• Technologies: HTML5, CSS3, JavaScript, Responsive Design
• GitHub: https://github.com/AhmedTyson

CERTIFICATIONS

Full Stack .NET Development – DEPI (Digital Egypt Pioneers) (6-month Program)
Comprehensive training in C#, ASP.NET Core, and .NET ecosystem development. Hands-on experience with Entity Framework, SQL Server, and web API development. Full stack application development using modern .NET technologies and best practices.

Full Stack Web Development Using Python – ITI (1-month Bootcamp)
Intensive training in Python web development and Flask framework integration. Hands-on experience with database integration and collaborative development.

Leadership Basics & Strategic Thinking (Vital | Awake Training)
Team leadership and strategic planning skills for software development teams.

CIB Egypt Internship Program
Fintech training in financial technology applications and banking systems. Enhanced understanding of enterprise software requirements and security considerations.

Microsoft Excel – Basic to Advanced
Proficient in data analysis, automation, and business intelligence.

AI Career Essentials (AICE) Internship
AI and machine learning fundamentals with practical applications in software development. Enhanced understanding of AI integration in modern applications and intelligent systems development.

LANGUAGES
Arabic: Native
English: Intermediate

Generated: ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`;
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

          const observerOptions = { threshold: 0.3, rootMargin: "0px 0px -100px 0px" };
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

          const observerOptions = { threshold: 0.5, rootMargin: "0px 0px -100px 0px" };
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
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
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
          this.picturePlaceholder = document.getElementById(
            "picture-placeholder"
          );
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
            this.showMessage(
              "Please select an image smaller than 5MB.",
              "error"
            );
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
          ["dragenter", "dragover", "dragleave", "drop"].forEach(
            (eventName) => {
              this.picturePlaceholder.addEventListener(
                eventName,
                this.preventDefaults,
                false
              );
            }
          );

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

      // App Initialization
      class App {
        constructor() {
          this.init();
        }

        init() {
          if (document.readyState === "loading") {
            document.addEventListener(
              "DOMContentLoaded",
              this.initializeComponents.bind(this)
            );
          } else {
            this.initializeComponents();
          }
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
          } catch (error) {
            console.error("Error initializing portfolio:", error);
            this.initializeFallbacks();
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

          // Basic theme toggle fallback
          if (themeToggle) {
            themeToggle.addEventListener("click", (e) => {
              e.preventDefault();
              const currentTheme =
                document.body.getAttribute("data-theme") || "light";
              const newTheme = currentTheme === "light" ? "dark" : "light";
              document.body.setAttribute("data-theme", newTheme);
              localStorage.setItem("theme", newTheme);

              const icon = themeToggle.querySelector(".theme-icon");
              if (icon) {
                icon.textContent = newTheme === "light" ? "🌙" : "☀️";
              }
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
        }
      }

      // Initialize the application
      new App();