/* ═══════════════════════════════════════════
   ESTADO GLOBAL
═══════════════════════════════════════════ */

const nav = document.getElementById("main-nav");
let isSidebar = false;
let isAnimating = false;
let currentSection = null;


/* ═══════════════════════════════════════════
   INTERNACIONALIZAÇÃO (i18n)
═══════════════════════════════════════════ */

function setLang(lang) {
  document.body.lang = lang;
  document.getElementById("btn-pt").classList.toggle("active", lang === "pt");
  document.getElementById("btn-en").classList.toggle("active", lang === "en");
}

// Deteta a língua do browser na inicialização
const browserLang = navigator.language.startsWith("pt") ? "pt" : "en";
setLang(browserLang);


/* ═══════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════ */

function openLightbox(card) {
  const img = card.querySelector("img");
  const rect = card.getBoundingClientRect();
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");

  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add("open");

  gsap.fromTo(
    lbImg,
    {
      opacity: 0,
      scale: 0.4,
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
    },
    { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.55, ease: "expo.out" },
  );

  gsap.fromTo(
    lightbox,
    { backgroundColor: "rgba(30, 10, 5, 0)" },
    { backgroundColor: "rgba(30, 10, 5, 0.88)", duration: 0.4, ease: "power2.out" },
  );

  gsap.fromTo(
    "#lightbox-close",
    { opacity: 0, y: -10 },
    { opacity: 0.7, y: 0, duration: 0.3, delay: 0.25, ease: "power2.out" },
  );
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");

  gsap.to(lbImg, { opacity: 0, scale: 0.85, duration: 0.3, ease: "power2.in" });

  gsap.to(lightbox, {
    backgroundColor: "rgba(30, 10, 5, 0)",
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => lightbox.classList.remove("open"),
  });
}


/* ═══════════════════════════════════════════
   ANIMAÇÃO INICIAL
═══════════════════════════════════════════ */

gsap.set(nav, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, fontSize: "3em" });
gsap.set(".titleimg", { width: 350 });
gsap.set(".content-section", { opacity: 0, x: 80, visibility: "hidden" });

gsap.timeline()
  .from(".titleimg",   { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" })
  .from(".lang-switch", { opacity: 0, y: -10, duration: 0.2, ease: "power2.out" }, "-=0.4")
  .from("nav ul li",   { opacity: 0, y: 15, stagger: 0.08, duration: 0.2, ease: "power2.out" }, "-=0.3");


/* ═══════════════════════════════════════════
   HELPERS DE ANIMAÇÃO DE SECÇÃO
═══════════════════════════════════════════ */

/** Mostra uma secção com animação de entrada. */
function animateSectionIn(tl, id, offset = "-=0.2") {
  const section = document.getElementById(id);
  section.classList.add("visible");
  gsap.set(section, { visibility: "visible" });

  tl.fromTo(`#${id}`, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.7, ease: "expo.out" }, offset)
    .from(`#${id} h1`, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, "-=0.4")
    .from(`#${id} p`,  { opacity: 0, y: 15, duration: 0.4, ease: "power2.out" }, "-=0.3");
}

/** Esconde a secção visível atual com animação de saída. */
function animateSectionOut(tl, section, onDone) {
  tl.to(section, {
    opacity: 0,
    x: -50,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      section.classList.remove("visible");
      gsap.set(section, { visibility: "hidden", x: 80 });
      onDone?.();
    },
  });
}

/** Move a nav para a posição de sidebar. */
function animateNavToSidebar(tl) {
  nav.classList.remove("centered");
  nav.classList.add("sidebar");

  tl.to(nav, { top: "5%", left: "7.5%", xPercent: 0, yPercent: 0, fontSize: "2.5em", duration: 0.5, ease: "expo.inOut" })
    .to(".titleimg", { width: 120, duration: 0.5, ease: "expo.inOut" }, "<")
    .from("nav ul li", { x: -10, opacity: 0.3, stagger: 0.06, duration: 0.4, ease: "power2.out" }, "-=0.3");
}

/** Move a nav de volta para o centro. */
function animateNavToCenter(tl, offset = "0") {
  nav.classList.remove("sidebar");
  nav.classList.add("centered");
  isSidebar = false;

  tl.to(nav, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, fontSize: "3em", duration: 0.9, ease: "expo.inOut" }, offset)
    .to(".titleimg", { width: 180, duration: 0.5, ease: "expo.inOut" }, "<")
    .from("nav ul li", { opacity: 0.3, x: 10, stagger: 0.06, duration: 0.2, ease: "power2.out" }, "-=0.3");
}


/* ═══════════════════════════════════════════
   NAVEGAÇÃO DE SECÇÕES
═══════════════════════════════════════════ */

function openSection(id) {
  if (isAnimating) return;
  if (currentSection === id && isSidebar) return;

  const clickedLink = event.target.closest("a");
  isAnimating = true;

  document.querySelectorAll("nav ul li a").forEach((a) => a.classList.remove("active-link"));
  clickedLink.classList.add("active-link");

  const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
  const oldSection = document.querySelector(".content-section.visible");

  if (!isSidebar) {
    // Primeira abertura: cenário → sidebar
    isSidebar = true;
    animateNavToSidebar(tl);
    tl.call(() => animateSectionIn(tl, id));

  } else if (oldSection && oldSection.id !== id) {
    // Troca entre secções
    animateSectionOut(tl, oldSection);
    tl.call(() => animateSectionIn(tl, id, "+=0.05"));

  } else if (!oldSection) {
    // Sidebar ativa mas sem secção visível
    tl.call(() => animateSectionIn(tl, id, "0"));
  }

  currentSection = id;
}

// Clicar no logo volta ao centro
document.querySelector(".titleimg").addEventListener("click", () => {
  if (!isSidebar || isAnimating) return;
  isAnimating = true;
  currentSection = null;

  document.querySelectorAll("nav ul li a").forEach((a) => a.classList.remove("active-link"));

  const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
  const visibleSection = document.querySelector(".content-section.visible");

  if (visibleSection) {
    tl.to(visibleSection, {
      opacity: 0,
      x: 80,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        visibleSection.classList.remove("visible");
        gsap.set(visibleSection, { visibility: "hidden" });
      },
    });
  }

  tl.call(() => animateNavToCenter(tl, visibleSection ? "-=0.1" : "0"));
});

function toggleMenu() {
  const navEl = document.getElementById("main-nav");
  if (navEl.classList.contains("show")) {
    // Fechar menu
    gsap.to(navEl, {
      x: "-100%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        navEl.classList.remove("show");
      }
    });
  } else {
    // Abrir menu
    navEl.classList.add("show");
    gsap.to(navEl, {
      x: "0%",
      duration: 0.5,
      ease: "power2.inOut",
    });
  }
}

function openSection(id) {
  // Fecha o menu mobile se estiver aberto
  const navEl = document.getElementById("main-nav");
  if (navEl.classList.contains("show")) {
    toggleMenu();
  }
  // resto do seu código...
}