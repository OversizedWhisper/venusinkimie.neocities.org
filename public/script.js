/* ================================================================
   ESTADO
================================================================ */

const nav = document.getElementById("main-nav");

let currentSection = null;

let isSidebar = false;

let isAnimating = false;

/* ================================================================
   RESPONSIVE
================================================================ */

function isSmallScreen() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

/* ================================================================
   IDIOMA
================================================================ */

function setLang(lang) {
  document.documentElement.lang = lang;

  document.body.lang = lang;

  document.getElementById("btn-pt").classList.toggle("active", lang === "pt");

  document.getElementById("btn-en").classList.toggle("active", lang === "en");
}

/* ================================================================
   MENU HAMBURGER
================================================================ */

function toggleMenu() {
  const navEl = document.getElementById("main-nav");

  const hamburger = document.getElementById("hamburger");

  const isOpen = navEl.classList.contains("show");

  if (isOpen) {
    navEl.classList.remove("show");

    document.body.classList.remove("menu-open");

    hamburger.setAttribute("aria-expanded", "false");

    hamburger.setAttribute("aria-label", "Abrir menu");

    hamburger.textContent = "☰";

    return;
  }

  navEl.classList.add("show");

  document.body.classList.add("menu-open");

  hamburger.setAttribute("aria-expanded", "true");

  hamburger.setAttribute("aria-label", "Fechar menu");

  hamburger.textContent = "×";
}

/* ================================================================
   PASTAS
================================================================ */

function toggleFolder(event) {
  event.preventDefault();

  event.stopPropagation();

  const link = event.target.closest("a");

  const folder = link.closest(".nav-folder");

  folder.classList.toggle("expanded");
}

/* ================================================================
   NAVEGAÇÃO
================================================================ */

function openSection(id, event) {
  if (event) {
    event.preventDefault();
  }

  const section = document.getElementById(id);

  if (!section) {
    return;
  }

  /* Fecha hamburger */

  const navEl = document.getElementById("main-nav");

  if (navEl.classList.contains("show")) {
    toggleMenu();
  }

  /* Remove estado anterior */

  document.querySelectorAll(".content-section").forEach((item) => {
    item.classList.remove("visible");
  });

  /* Ativa nova section */

  section.classList.add("visible");

  /* Links ativos */

  document.querySelectorAll("#main-nav a").forEach((link) => {
    link.classList.remove("active-link");
  });

  if (event) {
    const clicked = event.target.closest("a");

    if (clicked) {
      clicked.classList.add("active-link");
    }
  }

  currentSection = id;

  isSidebar = true;
}

/* ================================================================
   LOGO / START (voltar à página inicial)
================================================================ */

function goHome(event) {
  if (event) {
    event.preventDefault();
  }

  document.querySelectorAll(".nav-folder.expanded").forEach((folder) => {
    folder.classList.remove("expanded");
  });

  openSection("sobre", event && event.target.closest("a") ? event : null);
}

document
  .querySelector(".titleimg")
  .addEventListener("click", (event) => goHome(event));

document.querySelector(".titleimg").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    goHome(event);
  }
});

/* ================================================================
   LIGHTBOX
================================================================ */

function openLightbox(card) {
  const img = card.querySelector("img");

  if (!img) {
    return;
  }

  const lightbox = document.getElementById("lightbox");

  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = img.src;

  lightboxImg.alt = img.alt;

  lightbox.classList.add("open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");

  lightbox.classList.remove("open");
}

/* ================================================================
   ESC
================================================================ */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

/* ================================================================
   RELÓGIO DA BARRA DE TAREFAS
================================================================ */

function updateTaskbarClock() {
  const el = document.getElementById("taskbar-time");

  if (!el) {
    return;
  }

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  el.textContent = `${hh}:${mm}`;
}

updateTaskbarClock();
setInterval(updateTaskbarClock, 15000);

/* ================================================================
   ACESSIBILIDADE — CARDS DE ILUSTRAÇÃO POR TECLADO
================================================================ */

document.querySelectorAll(".illus-card").forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");

  const img = card.querySelector("img");

  if (img) {
    card.setAttribute("aria-label", img.alt || "Ver imagem ampliada");
  }

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(card);
    }
  });
});

/* ================================================================
   ESTADO INICIAL
================================================================ */

openSection("sobre", null);

/* ================================================================
   RESPONSIVE (resize)
================================================================ */

window.addEventListener("resize", () => {
  if (!isSmallScreen()) {
    document.getElementById("main-nav").classList.remove("show");
  }
});
