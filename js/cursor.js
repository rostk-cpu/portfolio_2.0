/**
 * cursor.js
 * · Kleiner Punkt folgt sofort der Maus
 * · Ring folgt mit Nachzieheffekt (Interpolation)
 */
(function () {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (!cursor || !ring) {
    console.warn('cursor.js: элементы #cursor или #cursorRing не найдены');
    return;
  }

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  // Показываем курсор только после первого движения мыши
  cursor.style.opacity = '0';
  ring.style.opacity   = '0';

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left    = mx + 'px';
    cursor.style.top     = my + 'px';
    cursor.style.opacity = '1';
    ring.style.opacity   = '0.4';
  });

  function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }

  animateRing();
})();