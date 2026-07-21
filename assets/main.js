/* ==========================================================================
   COLAW — Landing. Interactions : thème, détection OS + liens de téléchargement,
   bascule tarifaire engagement/flex, révélation au scroll, année du footer.
   Zéro dépendance. Défensif : chaque bloc est isolé, aucune erreur ne casse
   la page si un élément est absent.
   ========================================================================== */
(function () {
  "use strict";

  // --- CONFIG À REMPLIR PAR KEVIN : URLs des installeurs signés ---
  // Remplacer par les URLs réelles (ex. release GitHub ou CDN). Tant qu'elles
  // valent "#", le clic reste inerte et affiche un message doux.
  var DOWNLOADS = {
    mac: "#", // .dmg (Apple Silicon + Intel universel)
    win: "#", // .exe (Windows 10 & 11)
  };

  // ---------- Thème ----------
  (function theme() {
    var toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    var root = document.documentElement;

    function current() {
      var attr = root.getAttribute("data-theme");
      if (attr) return attr;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("colaw-theme", next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#1c1a16" : "#f0eee6");
    });
  })();

  // ---------- Menu mobile (drawer) ----------
  (function mobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("siteNav");
    var scrim = document.getElementById("navScrim");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      if (scrim) {
        scrim.classList.toggle("is-open", open);
        if (open) scrim.hidden = false;
        else setTimeout(function () { if (toggle.getAttribute("aria-expanded") === "false") scrim.hidden = true; }, 220);
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    if (scrim) scrim.addEventListener("click", function () { setOpen(false); });
    // Ferme au clic sur un lien du menu.
    nav.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) setOpen(false);
    });
    // Ferme à l'échap.
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    });
    // Réinitialise si on repasse en desktop.
    window.matchMedia("(min-width: 721px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  })();

  // ---------- Détection OS + liens de téléchargement ----------
  (function downloads() {
    var ua = (navigator.userAgent || "").toLowerCase();
    var platform = (navigator.platform || "").toLowerCase();
    var isMac = /mac/.test(platform) || /mac os x/.test(ua);
    var isWin = /win/.test(platform) || /windows/.test(ua);

    var macCard = document.getElementById("dlMac");
    var winCard = document.getElementById("dlWin");
    var heroBtn = document.getElementById("heroDownload");
    var heroOs = document.getElementById("heroOs");

    // Met en avant la carte correspondant à l'OS détecté.
    if (isMac && macCard) macCard.setAttribute("data-recommended", "true");
    else if (isWin && winCard) winCard.setAttribute("data-recommended", "true");

    if (heroOs) {
      if (isMac) heroOs.textContent = "Détecté : macOS · disponible aussi pour Windows";
      else if (isWin) heroOs.textContent = "Détecté : Windows · disponible aussi pour macOS";
    }

    function wire(card, os) {
      if (!card) return;
      card.setAttribute("href", DOWNLOADS[os]);
      card.addEventListener("click", function (ev) {
        if (DOWNLOADS[os] === "#") {
          ev.preventDefault();
          notifySoon(card);
        }
      });
    }
    wire(macCard, "mac");
    wire(winCard, "win");

    // Le CTA hero pointe vers l'OS détecté si dispo, sinon vers la section.
    if (heroBtn) {
      heroBtn.addEventListener("click", function (ev) {
        var os = isMac ? "mac" : isWin ? "win" : null;
        if (os && DOWNLOADS[os] !== "#") {
          ev.preventDefault();
          window.location.href = DOWNLOADS[os];
        }
        // sinon : comportement par défaut = ancre #telecharger
      });
    }

    var flashed = false;
    function notifySoon(card) {
      if (flashed) return;
      flashed = true;
      var note = document.querySelector(".dl-note");
      if (note) {
        var original = note.textContent;
        note.textContent = "Les installeurs seront disponibles très bientôt — laisse-nous ton e-mail pour être prévenu.";
        note.style.color = "var(--accent-hover)";
        setTimeout(function () { note.textContent = original; note.style.color = ""; flashed = false; }, 4000);
      }
    }
  })();

  // ---------- Bascule tarifaire engagement / sans engagement ----------
  (function pricing() {
    var engBtn = document.getElementById("ptEngage");
    var flexBtn = document.getElementById("ptFlex");
    if (!engBtn || !flexBtn) return;

    function apply(mode) {
      var isEngage = mode === "engage";
      engBtn.classList.toggle("is-active", isEngage);
      flexBtn.classList.toggle("is-active", !isEngage);
      engBtn.setAttribute("aria-selected", String(isEngage));
      flexBtn.setAttribute("aria-selected", String(!isEngage));

      document.querySelectorAll(".pc-amount[data-engage]").forEach(function (el) {
        el.textContent = el.getAttribute(isEngage ? "data-engage" : "data-flex");
      });
      document.querySelectorAll(".pc-billing[data-engage]").forEach(function (el) {
        el.textContent = el.getAttribute(isEngage ? "data-engage" : "data-flex");
      });
    }
    engBtn.addEventListener("click", function () { apply("engage"); });
    flexBtn.addEventListener("click", function () { apply("flex"); });
    apply("engage");
  })();

  // ---------- Révélation au scroll ----------
  (function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  })();

  // ---------- Année footer ----------
  (function year() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  })();
})();
