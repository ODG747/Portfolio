/**
 * ================================================================
 * PORTFOLIO — script.js
 * Fonctionnalités :
 *  1. Canvas background (grille + particules animées)
 *  2. Navbar : scroll + mobile hamburger
 *  3. Reveal au scroll (IntersectionObserver)
 *  4. Animation des barres de compétences
 *  5. Footer : année courante
 *  6. Navigation active section
 * ================================================================
 */

/* ── 1. CANVAS BACKGROUND ──────────────────────────────────────── */

(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  // Paramètres
  const PARTICLE_COUNT = 55;
  const PARTICLE_SPEED = 0.25;
  const PARTICLE_RADIUS = 1.2;
  const LINE_DIST = 130;
  const ACCENT_COLOR = '0,255,229';
  const GRID_SPACING = 80;

  /* Redimensionnement */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildParticles();
  }

  /* Création des particules */
  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * PARTICLE_SPEED,
      vy: (Math.random() - 0.5) * PARTICLE_SPEED,
      r:  PARTICLE_RADIUS + Math.random() * 0.8,
    }));
  }

  /* Boucle principale */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ── Grille de points ──
    ctx.fillStyle = `rgba(255,255,255,0.018)`;
    for (let x = GRID_SPACING / 2; x < W; x += GRID_SPACING) {
      for (let y = GRID_SPACING / 2; y < H; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── Mise à jour & dessin des particules ──
    particles.forEach(p => {
      // Déplacement
      p.x += p.vx;
      p.y += p.vy;

      // Rebond sur les bords
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Point
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT_COLOR},0.55)`;
      ctx.fill();
    });

    // ── Lignes entre particules proches ──
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const alpha = (1 - dist / LINE_DIST) * 0.12;
          ctx.strokeStyle = `rgba(${ACCENT_COLOR},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Pause quand la page est en arrière-plan (économie de ressources)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  resize();
  draw();
})();


/* ── 2. NAVBAR ──────────────────────────────────────────────────── */

(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll : ajout de la classe .scrolled
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial

  // Hamburger (mobile)
  toggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Ferme le menu mobile au clic sur un lien
  navLinks?.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


/* ── 3. REVEAL AU SCROLL ────────────────────────────────────────── */

(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Éléments du hero : visibles immédiatement
  document.querySelectorAll('.section-hero .reveal').forEach(el => {
    el.classList.add('visible');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // one-shot
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => {
    // Ne pas ré-observer les éléments hero déjà visibles
    if (!el.classList.contains('visible')) observer.observe(el);
  });
})();


/* ── 4. ANIMATION BARRES DE COMPÉTENCES ─────────────────────────── */

(function initSkillBars() {
  const skillItems = document.querySelectorAll('.skill-item');
  if (!skillItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillItems.forEach(item => observer.observe(item));
})();


/* ── 5. FOOTER : ANNÉE COURANTE ─────────────────────────────────── */

(function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── 6. NAVIGATION ACTIVE SECTION ───────────────────────────────── */

(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const href = link.getAttribute('href');
          const active = href === `#${entry.target.id}`;
          link.style.color = active
            ? 'var(--accent)'
            : '';
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ── 7. SMOOTH ANCHOR SCROLL AVEC OFFSET NAVBAR ─────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;

    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
