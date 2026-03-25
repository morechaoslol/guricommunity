// Helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Year
$("#year").textContent = new Date().getFullYear();

// Mobile menu
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when clicking a link (mobile)
$$(".nav__link, .btn").forEach((a) => {
  a.addEventListener("click", () => {
    if (navLinks.classList.contains("is-open")) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Scroll progress bar
const scrollBar = $("#scrollBar");
window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const progress = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollBar) scrollBar.style.width = `${progress}%`;
});

// Reveal on scroll (IntersectionObserver)
const revealEls = $$(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = e.target.getAttribute("data-reveal-delay");
        if (delay) e.target.style.transitionDelay = `${delay}ms`;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Active nav link highlight based on section in view
const sections = ["missie", "activiteiten", "doelgroepen", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map();
$$(".nav__link").forEach((link) => {
  const hash = link.getAttribute("href");
  if (hash && hash.startsWith("#")) navMap.set(hash.slice(1), link);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      // reset
      $$(".nav__link").forEach((l) => l.classList.remove("is-active"));
      const active = navMap.get(id);
      if (active) active.classList.add("is-active");
    });
  },
  { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 }
);

sections.forEach((s) => sectionObserver.observe(s));

const form = $("#contactForm");
const note = $("#formNote");
form?.addEventListener("submit", (e) => {
  if (note) note.textContent = "✅ Bericht verzonden! We nemen snel contact op.";
});
