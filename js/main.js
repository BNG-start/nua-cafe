/* NÜA Café — interactions : en-tête, menu, statut d'ouverture, apparitions */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.querySelector(".header");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");

  /* En-tête opaque au défilement */
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 30); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  function setMenu(open) {
    header.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!header.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth >= 900) setMenu(false); });

  /* Statut d'ouverture (heure de Bamako = UTC+0), 8h–20h */
  var OPEN = 8, CLOSE = 20;
  function updateStatus() {
    var now = new Date();
    var h = now.getUTCHours() + now.getUTCMinutes() / 60;
    var isOpen = h >= OPEN && h < CLOSE;
    var text;
    if (isOpen) {
      text = "Ouvert maintenant · jusqu’à 20h";
    } else {
      text = h < OPEN ? "Fermé · ouvre à 8h" : "Fermé · ouvre demain à 8h";
    }
    document.querySelectorAll("[data-status-text]").forEach(function (el) { el.textContent = text; });
    document.querySelectorAll("[data-status]").forEach(function (el) { el.classList.toggle("is-open", isOpen); });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* Apparitions au défilement */
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el, i) {
      var siblings = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = Math.min(siblings, 4) * 80 + "ms";
      io.observe(el);
    });
  }

  /* Année automatique */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
