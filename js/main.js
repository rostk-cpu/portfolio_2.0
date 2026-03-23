/**
 * main.js
 * ──────────────────────────────────────────────────────────────
 * Allgemeine Seiten-Interaktivität:
 *  1. Scroll-Reveal  — Elemente werden beim Scrollen sichtbar
 *  2. Skill-Balken   — Fortschrittsbalken animieren beim Einblenden
 *  3. Aktive Nav     — aktueller Abschnitt wird im Menü hervorgehoben
 * ──────────────────────────────────────────────────────────────
 */

// ── 1. SCROLL-REVEAL ──────────────────────────────────────────
// IntersectionObserver prüft, ob ein .reveal-Element sichtbar ist.
// Wenn ja → Klasse "visible" → CSS-Übergang startet.
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Kleiner Staffel-Delay für aufeinander folgende Elemente
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── 2. SKILL-BALKEN ANIMATION ─────────────────────────────────
// Wenn die Skill-Karte ins Bild scrollt, wächst der Balken
// von 0 % auf den in data-w gespeicherten Zielwert.
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.w;
      barObs.unobserve(fill);  // Nur einmal animieren
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-bar-fill').forEach(el => {
  el.style.width = '0';
  barObs.observe(el);
});

// ── 3. AKTIVE NAVIGATION ──────────────────────────────────────
// Beim Scrollen wird erkannt, welcher Abschnitt gerade sichtbar ist.
// Der passende Nav-Link bekommt die Akzentfarbe.
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = (a.getAttribute('href') === '#' + current)
      ? 'var(--purple3)'
      : '';
  });
});