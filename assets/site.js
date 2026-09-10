/* =========================================================================
   Portfolio — Noah Gauthier
   Trois choses seulement :
   1. le bouton clair / sombre
   2. le maillage filaire de l'en-tête (canvas, sans librairie)
   3. le repli propre quand une capture d'écran n'existe pas encore
   ========================================================================= */

(function () {
  "use strict";

  /* 1. THÈME ------------------------------------------------------------ */
  // Le thème est déjà posé sur <html> par le script court en tête de page,
  // pour éviter un clignotement au chargement. Ici on ne gère que le clic.

  var bouton = document.querySelector(".bouton-theme");
  if (bouton) {
    bouton.addEventListener("click", function () {
      var actuel = document.documentElement.getAttribute("data-theme");
      var sombreSysteme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // Sans choix explicite, on bascule à l'opposé de la préférence système.
      var suivant = actuel ? (actuel === "dark" ? "light" : "dark")
                           : (sombreSysteme ? "light" : "dark");
      document.documentElement.setAttribute("data-theme", suivant);
      bouton.setAttribute("aria-label",
        suivant === "dark" ? "Passer au thème clair" : "Passer au thème sombre");
      try { localStorage.setItem("theme", suivant); } catch (e) { /* navigation privée */ }
    });
  }

  /* 2. MAILLAGE FILAIRE ------------------------------------------------- */
  // Un relief en fil de fer qui tourne lentement : le viewport d'un moteur 3D.
  // Projection perspective écrite à la main, ~40 lignes, aucune dépendance.

  var toile = document.getElementById("maillage");
  var animationsReduites = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (toile && toile.getContext && !animationsReduites) {
    var ctx = toile.getContext("2d");
    var COTE = 22;          // nombre de mailles par côté
    var ETENDUE = 9;        // taille du relief en unités monde
    var angle = 0;
    var largeur = 0, hauteur = 0, densite = 1;
    var visible = true;
    var dernier = 0;

    // Relief déterministe : somme de sinusoïdes, pas de bruit aléatoire,
    // pour que la forme soit toujours la même d'un chargement à l'autre.
    function altitude(x, z) {
      return Math.sin(x * 0.72) * 0.62
           + Math.cos(z * 0.55) * 0.52
           + Math.sin((x + z) * 0.34) * 0.42;
    }

    function redimensionner() {
      densite = Math.min(window.devicePixelRatio || 1, 2);
      largeur = toile.clientWidth;
      hauteur = toile.clientHeight;
      toile.width = Math.round(largeur * densite);
      toile.height = Math.round(hauteur * densite);
      ctx.setTransform(densite, 0, 0, densite, 0, 0);
    }

    function projeter(x, y, z) {
      // rotation autour de l'axe vertical, puis inclinaison, puis perspective
      var cos = Math.cos(angle), sin = Math.sin(angle);
      var rx = x * cos - z * sin;
      var rz = x * sin + z * cos;
      var iy = y * 0.86 - rz * 0.42;   // inclinaison ~25°
      var iz = rz * 0.90 + y * 0.30 + 15;
      var f = (hauteur * 0.95) / iz;
      return { x: largeur / 2 + rx * f, y: hauteur * 0.52 + iy * f };
    }

    function dessiner(horodatage) {
      if (!visible) { requestAnimationFrame(dessiner); return; }
      // 30 images/s suffisent largement et divisent le coût par deux
      if (horodatage - dernier < 33) { requestAnimationFrame(dessiner); return; }
      var delta = dernier ? horodatage - dernier : 16;
      dernier = horodatage;
      angle += delta * 0.000075;

      ctx.clearRect(0, 0, largeur, hauteur);
      var styles = getComputedStyle(document.documentElement);
      ctx.strokeStyle = styles.getPropertyValue("--trait-fort").trim() || "#999";
      ctx.lineWidth = 1;

      var pas = (ETENDUE * 2) / COTE;
      var i, j, x, z, p;

      // lignes dans un sens
      for (i = 0; i <= COTE; i++) {
        z = -ETENDUE + i * pas;
        ctx.beginPath();
        for (j = 0; j <= COTE; j++) {
          x = -ETENDUE + j * pas;
          p = projeter(x, altitude(x, z), z);
          j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.globalAlpha = 0.42 + 0.55 * (i / COTE);
        ctx.stroke();
      }
      // lignes dans l'autre sens
      for (j = 0; j <= COTE; j++) {
        x = -ETENDUE + j * pas;
        ctx.beginPath();
        for (i = 0; i <= COTE; i++) {
          z = -ETENDUE + i * pas;
          p = projeter(x, altitude(x, z), z);
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.globalAlpha = 0.26;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(dessiner);
    }

    redimensionner();
    window.addEventListener("resize", redimensionner, { passive: true });

    // On coupe l'animation dès que l'en-tête sort de l'écran ou l'onglet du premier plan.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entrees) {
        visible = entrees[0].isIntersecting;
      }).observe(toile);
    }
    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
    });

    requestAnimationFrame(dessiner);
  }

  /* 3. CAPTURES MANQUANTES ---------------------------------------------- */
  // Tant qu'une image n'est pas déposée dans /images, on n'affiche pas une
  // icône cassée : le conteneur bascule sur un cadre « capture à venir ».

  function marquerAbsente(img) {
    var boite = img.closest(".carte__visuel, .fiche__visuel");
    if (boite) { boite.classList.add("sans-image"); }
    // Un « voir en grand » qui pointe vers un fichier absent ne sert à rien.
    var figure = img.closest("figure");
    if (figure) {
      Array.prototype.forEach.call(figure.querySelectorAll(".lien-image"),
        function (lien) { lien.hidden = true; });
    }
  }

  Array.prototype.forEach.call(
    document.querySelectorAll(".carte__visuel img, .fiche__visuel img"),
    function (img) {
      if (img.complete && img.naturalWidth === 0) { marquerAbsente(img); }
      img.addEventListener("error", function () { marquerAbsente(img); });
    }
  );
})();
