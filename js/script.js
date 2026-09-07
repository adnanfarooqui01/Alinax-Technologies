// ALINAX TECHNOLOGIES — interactions for the Deep Frost redesign
(() => {
  "use strict";

  if (!document.querySelector('link[data-alinax-fonts]')) {
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://fonts.gstatic.com";
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);

    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap";
    fonts.dataset.alinaxFonts = "true";
    document.head.appendChild(fonts);
  }

  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navDropdowns = [...document.querySelectorAll(".nav-dropdown")];

  const setScrolled = () => navbar?.classList.toggle("is-scrolled", window.scrollY > 12);
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  const setMenuState = (open) => {
    navLinks?.classList.toggle("open", open);
    navToggle?.classList.toggle("is-open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    if (!open) {
      navDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        dropdown.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
      });
    }
  };

  navToggle?.addEventListener("click", () => setMenuState(!navLinks?.classList.contains("open")));

  navDropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(":scope > a");
    trigger?.setAttribute("aria-expanded", "false");
    trigger?.addEventListener("click", (event) => {
      if (window.innerWidth > 980) return;
      event.preventDefault();
      const willOpen = !dropdown.classList.contains("open");
      navDropdowns.forEach((item) => {
        item.classList.remove("open");
        item.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
      });
      dropdown.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    if (!link.parentElement?.classList.contains("nav-dropdown")) {
      link.addEventListener("click", () => setMenuState(false));
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 980 && navLinks?.classList.contains("open") && event.target instanceof Node && !navbar?.contains(event.target)) {
      setMenuState(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenuState(false);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("in"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px" });
    revealItems.forEach((item) => observer.observe(item));
  }

  const contactForm = document.getElementById("contact-form");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (id) => document.getElementById(id)?.value?.trim() || "";
    const name = value("cf-name");
    const email = value("cf-email");
    const phone = value("cf-phone");
    const code = value("cf-cc");
    const service = value("cf-service");
    const message = value("cf-message");
    const status = document.getElementById("form-status");

    if (!name || !email || !phone || !message) {
      if (status) {
        status.textContent = "Please fill in your name, email, phone number and message before sending.";
        status.className = "form-status show err";
      }
      return;
    }

    const subject = encodeURIComponent(`New enquiry from ${name}${service ? ` — ${service}` : ""}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${code} ${phone}\nService: ${service || "Not specified"}\n\nMessage:\n${message}`);
    if (status) {
      status.textContent = "Opening your email app with your details filled in — hit send to reach us.";
      status.className = "form-status show ok";
    }
    window.location.href = `mailto:hello@alinaxtechnologies.com?subject=${subject}&body=${body}`;
  });
})();