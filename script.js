// Initialize AOS animations
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS with responsive settings
  AOS.init({
    duration: 800,
    easing: "ease",
    once: false,
    offset: 100,
    mirror: true,
    disable: "mobile", // Disable on mobile devices for better performance
  })

  // Theme Toggle
  const themeToggle = document.querySelector(".theme-toggle")
  const htmlElement = document.documentElement

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    htmlElement.classList.remove("light", "dark")
    htmlElement.classList.add(savedTheme)
  } else {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (prefersDarkMode) {
      htmlElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      htmlElement.classList.add("light")
      localStorage.setItem("theme", "light")
    }
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark")
      htmlElement.classList.add("light")
      localStorage.setItem("theme", "light")
    } else {
      htmlElement.classList.remove("light")
      htmlElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  })

  // Mobile Navigation Toggle with improved touch handling
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")
  const body = document.body

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")

      // Update ARIA attributes
      const isExpanded = hamburger.classList.contains("active")
      hamburger.setAttribute("aria-expanded", isExpanded)

      // Prevent body scrolling when menu is open
      if (navLinks.classList.contains("active")) {
        body.style.overflow = "hidden"
      } else {
        body.style.overflow = ""
      }
    })
  }

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
      hamburger.setAttribute("aria-expanded", "false")
      body.style.overflow = ""
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navLinks &&
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
      hamburger.setAttribute("aria-expanded", "false")
      body.style.overflow = ""
    }
  })

  // Sticky Navigation with performance optimization
  let lastScrollTop = 0
  const header = document.querySelector("header")

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Only update styles if scroll direction changes or significant scroll
      if (Math.abs(lastScrollTop - scrollTop) > 10) {
        if (scrollTop > 50) {
          header.style.boxShadow = "0 2px 10px var(--shadow-color)"
        } else {
          header.style.boxShadow = "0 2px 10px var(--shadow-color)"
        }
        lastScrollTop = scrollTop
      }
    },
    { passive: true },
  ) // Passive event for better performance

  // Animate skill bars on scroll with Intersection Observer for better performance
  const skillBars = document.querySelectorAll(".skill-progress")

  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target
            const targetWidth = bar.getAttribute("data-width")
            setTimeout(() => {
              bar.style.width = targetWidth
            }, 200)
            skillObserver.unobserve(bar) // Stop observing once animated
          }
        })
      },
      { threshold: 0.2 },
    )

    skillBars.forEach((bar) => {
      skillObserver.observe(bar)
    })
  } else {
    // Fallback for browsers that don't support Intersection Observer
    function animateSkillBars() {
      skillBars.forEach((bar) => {
        const targetWidth = bar.getAttribute("data-width")
        if (isElementInViewport(bar.parentElement) && bar.style.width === "0%") {
          setTimeout(() => {
            bar.style.width = targetWidth
          }, 200)
        }
      })
    }

    // Check if element is in viewport
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
    }

    // Listen for scroll to animate skill bars
    window.addEventListener("scroll", animateSkillBars, { passive: true })
    animateSkillBars() // Initial check
  }

  // Smooth scrolling for anchor links with offset adjustment for different screen sizes
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Adjust offset based on screen size
        let offset = 70
        if (window.innerWidth <= 768) {
          offset = 60
        } else if (window.innerWidth <= 576) {
          offset = 50
        }

        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: "smooth",
        })
      }
    })
  })

  // Add active class to nav items based on scroll position with throttling
  const sections = document.querySelectorAll("section")
  const navItems = document.querySelectorAll(".nav-links a")
  let isScrolling = false

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrolling) {
        isScrolling = true

        // Use requestAnimationFrame for better performance
        window.requestAnimationFrame(() => {
          let current = ""
          const scrollPosition = window.scrollY + 100

          sections.forEach((section) => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              current = section.getAttribute("id")
            }
          })

          navItems.forEach((item) => {
            item.classList.remove("active")
            if (item.getAttribute("href") === `#${current}`) {
              item.classList.add("active")
            }
          })

          isScrolling = false
        })
      }
    },
    { passive: true },
  )

  // Form submission with Formspree and improved validation
  const contactForm = document.getElementById("contactForm")
  const formStatus = document.getElementById("form-status")

  if (contactForm) {
    // Add input validation as user types
    const inputs = contactForm.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", validateInput)
    })

    function validateInput(e) {
      const input = e.target
      const value = input.value.trim()

      if (input.hasAttribute("required") && value === "") {
        input.style.borderColor = "#ef4444"
      } else if (input.type === "email" && value !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          input.style.borderColor = "#ef4444"
        } else {
          input.style.borderColor = "#10b981"
        }
      } else {
        input.style.borderColor = "#10b981"
      }
    }

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Basic validation
      const name = document.getElementById("name").value.trim()
      const email = document.getElementById("email").value.trim()
      const subject = document.getElementById("subject").value.trim()
      const message = document.getElementById("message").value.trim()

      if (name === "" || email === "" || subject === "" || message === "") {
        formStatus.textContent = "Please fill in all fields"
        formStatus.className = "error"
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        formStatus.textContent = "Please enter a valid email address"
        formStatus.className = "error"
        return
      }

      // Show loading state
      const submitBtn = contactForm.querySelector("button[type='submit']")
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      // Submit form to Formspree
      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          formStatus.textContent = "Thank you for your message! I will get back to you soon."
          formStatus.className = "success"
          contactForm.reset()
        } else {
          const data = await response.json()
          formStatus.textContent = data.error || "Oops! There was a problem submitting your form."
          formStatus.className = "error"
        }
      } catch (error) {
        formStatus.textContent = "Oops! There was a problem submitting your form."
        formStatus.className = "error"
      } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false
      }
    })
  }

  // Ensure all images are loaded properly with better error handling
  const allImages = document.querySelectorAll("img")

  allImages.forEach((img) => {
    // Add loading attribute for better performance
    img.loading = "lazy"

    // Add error handling for images
    img.onerror = () => {
      console.error(`Failed to load image: ${img.src}`)
      // Set a fallback image or add a class to style broken images
      img.src = "/placeholder.svg?height=300&width=300"
      img.classList.add("image-error")
    }

    // Force reload images to ensure they're properly loaded
    if (!img.complete) {
      const currentSrc = img.src
      img.src = ""
      setTimeout(() => {
        img.src = currentSrc
      }, 10)
    }
  })

  // Add animation to project cards with staggered delay
  const projectCards = document.querySelectorAll(".project-card")
  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`
  })

  // Add animation to blog cards
  const blogCards = document.querySelectorAll(".blog-card")
  blogCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`
  })

  // Add animation to certificate cards
  const certificateCards = document.querySelectorAll(".certificate-card")
  certificateCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`
  })

  // Add hover animation to skill tags with touch detection
  const skillTags = document.querySelectorAll(".skill-tag")
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

  skillTags.forEach((tag) => {
    if (!isTouchDevice) {
      tag.addEventListener("mouseenter", () => {
        tag.style.animation = "pulse 1s infinite"
      })
      tag.addEventListener("mouseleave", () => {
        tag.style.animation = ""
      })
    } else {
      // For touch devices, add a tap animation
      tag.addEventListener("touchstart", () => {
        tag.style.animation = "pulse 0.5s"
        setTimeout(() => {
          tag.style.animation = ""
        }, 500)
      })
    }
  })

  // Responsive layout adjustments
  function adjustLayout() {
    const isMobile = window.innerWidth <= 768
    const isSmallMobile = window.innerWidth <= 576
    const heroSection = document.querySelector(".hero")
    const navHeight = document.querySelector("header").offsetHeight

    // Update CSS variable for nav height
    document.documentElement.style.setProperty("--nav-height", `${navHeight}px`)

    if (isMobile) {
      heroSection.style.minHeight = "auto"
      heroSection.style.paddingBottom = "50px"

      // Adjust padding for sections based on screen size
      document.querySelectorAll("section").forEach((section) => {
        section.style.paddingTop = isSmallMobile ? "40px" : "60px"
        section.style.paddingBottom = isSmallMobile ? "40px" : "60px"
      })
    } else {
      heroSection.style.minHeight = "100vh"
      heroSection.style.paddingBottom = "0"

      // Reset section padding for larger screens
      document.querySelectorAll("section").forEach((section) => {
        section.style.paddingTop = ""
        section.style.paddingBottom = ""
      })
    }
  }

  // Run on load, resize, and orientation change
  window.addEventListener("load", adjustLayout)
  window.addEventListener("resize", adjustLayout)
  window.addEventListener("orientationchange", adjustLayout)

  // Check for orientation changes on mobile devices
  if ("orientation" in window) {
    window.addEventListener("orientationchange", () => {
      // Small delay to ensure DOM is updated
      setTimeout(adjustLayout, 100)
    })
  }

  // Handle network status for offline/online functionality
  window.addEventListener("online", () => {
    // Reload images that might have failed when offline
    document.querySelectorAll("img.image-error").forEach((img) => {
      const originalSrc = img.getAttribute("data-original-src")
      if (originalSrc) {
        img.src = originalSrc
        img.classList.remove("image-error")
      }
    })
  })

  // Save original image sources for offline recovery
  document.querySelectorAll("img").forEach((img) => {
    img.setAttribute("data-original-src", img.src)
  })
})
