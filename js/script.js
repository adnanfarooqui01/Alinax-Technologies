// Floating navbar scroll state
const navbarEl = document.querySelector(".navbar");
if (navbarEl) {
  const setScrolled = () => {
    navbarEl.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });
}

// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const navInner = document.querySelector(".nav-inner");
const navDropdowns = document.querySelectorAll(".nav-dropdown");

function closeMobileNav() {
  if (navLinks) navLinks.classList.remove("open");
  if (navInner) navInner.classList.remove("menu-open");
  navDropdowns.forEach((d) => d.classList.remove("open"));
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    if (navInner) navInner.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) navDropdowns.forEach((d) => d.classList.remove("open"));
  });

  // On mobile, tapping a dropdown parent expands/collapses it instead of navigating
  navDropdowns.forEach((drop) => {
    const parentLink = drop.querySelector(":scope > a");
    if (!parentLink) return;
    parentLink.addEventListener("click", (e) => {
      e.preventDefault();
      const willOpen = !drop.classList.contains("open");
      navDropdowns.forEach((d) => {
        d.classList.remove("open");
        d.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
      });
      if (willOpen) drop.classList.add("open");
      parentLink.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  // Close the mobile menu after picking any real link (not the dropdown parent toggle)
  navLinks.querySelectorAll("a").forEach((link) => {
    const isDropdownParent = link.parentElement.classList.contains("nav-dropdown");
    if (!isDropdownParent) {
      link.addEventListener("click", closeMobileNav);
    }
  });

  // Click outside the nav pill closes the mobile menu
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 980 && navLinks.classList.contains("open")) {
      if (!e.target.closest(".nav-inner")) closeMobileNav();
    }
  });

  // Reset state if the viewport is resized past the mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMobileNav();
  });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Scroll reveal
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Contact form: build a mailto: with the entered details (no backend on this site)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const statusEl = document.getElementById("form-status");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const ccCode = document.getElementById("cf-cc").value;
    const phoneNum = document.getElementById("cf-phone").value.trim();
    const service = document.getElementById("cf-service").value;
    const message = document.getElementById("cf-message").value.trim();

    if (!name || !email || !phoneNum || !message) {
      if (statusEl) {
        statusEl.textContent = "Please fill in your name, email, phone number and message before sending.";
        statusEl.className = "form-status show err";
      }
      return;
    }

    const fullPhone = `${ccCode} ${phoneNum}`;
    const subject = encodeURIComponent(`New enquiry from ${name}${service ? " — " + service : ""}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${fullPhone}\nService: ${service || "Not specified"}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:hello@alinaxtechnologies.com?subject=${subject}&body=${body}`;

    if (statusEl) {
      statusEl.textContent = "Opening your email app with your details filled in — hit send to reach us.";
      statusEl.className = "form-status show ok";
    }
  });
}