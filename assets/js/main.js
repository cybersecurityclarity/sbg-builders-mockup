// Sticky nav: transparent -> solid
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 12) nav.classList.add("nav--solid");
  else nav.classList.remove("nav--solid");
});

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-in");
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Counter animation
function animateCount(el) {
  const target = Number(el.dataset.count || "0");
  const duration = 900;
  const start = performance.now();
  const from = 0;

  function tick(t) {
    const p = Math.min(1, (t - start) / duration);
    const v = Math.floor(from + (target - from) * p);
    el.textContent = v.toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.ran) {
        e.target.dataset.ran = "1";
        animateCount(e.target);
      }
    });
  },
  { threshold: 0.4 }
);
counters.forEach((el) => counterIO.observe(el));

// Cookie banner
const cookie = document.getElementById("cookie");
const cookieAccept = document.getElementById("cookieAccept");
const cookieSettings = document.getElementById("cookieSettings");

function showCookie() {
  if (!cookie) return;
  const v = localStorage.getItem("cookieConsent");
  if (!v) cookie.classList.add("is-on");
}
function acceptCookie() {
  localStorage.setItem("cookieConsent", "accepted");
  if (cookie) cookie.classList.remove("is-on");
}
if (cookieAccept) cookieAccept.addEventListener("click", acceptCookie);
if (cookieSettings)
  cookieSettings.addEventListener("click", () => {
    alert("Cookie settings UI can be added later. For now, accept to continue.");
  });
showCookie();

// Load mock data (projects + testimonials)
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

async function initHomeData() {
  const featuredWrap = document.getElementById("featuredProjects");
  const quotesWrap = document.getElementById("testimonials");
  if (!featuredWrap && !quotesWrap) return;

  try {
    const projects = await loadJSON("assets/data/projects.json");
    const testimonials = await loadJSON("assets/data/testimonials.json");

    if (featuredWrap) {
      const featured = projects.filter(p => p.featured).slice(0, 6);
      featuredWrap.innerHTML = featured.map(p => `
        <a class="card reveal" href="projects.html#${p.slug}">
          <div class="card__img" style="background-image:url('${p.cover}')"></div>
          <div class="card__body">
            <h3 class="card__title">${p.title}</h3>
            <div class="card__meta">${p.category} · ${p.location}</div>
          </div>
        </a>
      `).join("");
      // Observe newly injected reveals
      featuredWrap.querySelectorAll(".reveal").forEach(el => io.observe(el));
    }

    if (quotesWrap) {
      quotesWrap.innerHTML = testimonials.slice(0, 3).map(t => `
        <div class="quote">
          <p>“${t.quote}”</p>
          <div class="who">${t.name}, ${t.title}</div>
        </div>
      `).join("");
    }
  } catch (err) {
    console.warn(err);
  }
}
initHomeData();
