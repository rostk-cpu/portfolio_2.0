/**
 * dodecahedron.js
 * Надписи одинаковой яркости на всех гранях.
 * Грани темнеют/светлеют, текст — всегда белый.
 */

(function () {
  const canvas = document.getElementById('dodec-canvas');
  const ctx    = canvas.getContext('2d');
  const W = 320, H = 320, CX = W / 2, CY = H / 2;
  canvas.width  = W;
  canvas.height = H;

  const SKILLS = [
    'Python', 'CSS', 'HTML', 'VS Code',
    'Git', 'Deutsch B2', 'Teamwork', 'Analytisch',
    'Linux', 'JavaScript', 'Lernbereit', 'Kreativ',
  ];

  const PHI = (1 + Math.sqrt(5)) / 2;
  const INV = 1 / PHI;
  const SCALE = 100;

  const RAW_VERTS = [
    [ 1, 1, 1], [ 1, 1,-1], [ 1,-1, 1], [ 1,-1,-1],
    [-1, 1, 1], [-1, 1,-1], [-1,-1, 1], [-1,-1,-1],
    [ 0, PHI, INV], [ 0, PHI,-INV], [ 0,-PHI, INV], [ 0,-PHI,-INV],
    [ INV, 0, PHI], [-INV, 0, PHI], [ INV, 0,-PHI], [-INV, 0,-PHI],
    [ PHI, INV, 0], [ PHI,-INV, 0], [-PHI, INV, 0], [-PHI,-INV, 0],
  ];

  const DODE_FACES = [
    [ 0,  8,  9,  1, 16], [ 0, 16, 17,  2, 12], [ 0, 12, 13,  4,  8],
    [ 1,  9,  5, 15, 14], [ 1, 14,  3, 17, 16], [ 2, 17,  3, 11, 10],
    [ 2, 10,  6, 13, 12], [ 3, 14, 15,  7, 11], [ 4, 18, 19,  6, 13],
    [ 4,  8,  9,  5, 18], [ 5, 18, 19,  7, 15], [ 6, 19,  7, 11, 10],
  ];

  const VERTS = RAW_VERTS.map(v => ({ x: v[0]*SCALE, y: v[1]*SCALE, z: v[2]*SCALE }));

  let angleY = 0, angleX = 0.4, hovered = false;
  canvas.addEventListener('mouseenter', () => hovered = true);
  canvas.addEventListener('mouseleave', () => hovered = false);

  const rotY = (p, a) => ({ x: p.x*Math.cos(a)+p.z*Math.sin(a), y: p.y, z: -p.x*Math.sin(a)+p.z*Math.cos(a) });
  const rotX = (p, a) => ({ x: p.x, y: p.y*Math.cos(a)-p.z*Math.sin(a), z: p.y*Math.sin(a)+p.z*Math.cos(a) });
  const proj  = p => { const f = 420/(420+p.z+180); return { sx: CX+p.x*f, sy: CY+p.y*f }; };

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const tv = VERTS.map(v => rotX(rotY(v, angleY), angleX));

    const faces = DODE_FACES.map((face, fi) => {
      const p3 = face.map(i => tv[i]);
      const p2 = p3.map(proj);

      const A = p3[0], B = p3[1], C = p3[2];
      const nx = (B.y-A.y)*(C.z-A.z) - (B.z-A.z)*(C.y-A.y);
      const ny = (B.z-A.z)*(C.x-A.x) - (B.x-A.x)*(C.z-A.z);
      const nz = (B.x-A.x)*(C.y-A.y) - (B.y-A.y)*(C.x-A.x);
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
      const dot = -nz / len; // +1 фронт, -1 тыл

      // brightness только для заливки грани: от 0.08 (тыл) до 1.0 (фронт)
      const brightness = Math.max(0.08, (dot + 1) / 2);
      const cz  = p3.reduce((s, p) => s + p.z, 0) / p3.length;
      const fcx = p2.reduce((s, p) => s + p.sx, 0) / p2.length;
      const fcy = p2.reduce((s, p) => s + p.sy, 0) / p2.length;

      return { p2, brightness, dot, cz, cx: fcx, cy: fcy, fi };
    });

    faces.sort((a, b) => b.cz - a.cz);

    for (const fd of faces) {
      const b = fd.brightness;

      // Путь
      ctx.beginPath();
      ctx.moveTo(fd.p2[0].sx, fd.p2[0].sy);
      for (let k = 1; k < fd.p2.length; k++) ctx.lineTo(fd.p2[k].sx, fd.p2[k].sy);
      ctx.closePath();

      // Заливка грани — темнее сзади, светлее спереди
      ctx.fillStyle = `rgb(${Math.round(6+b*22)},${Math.round(3+b*11)},${Math.round(14+b*41)})`;
      ctx.fill();

      // Обводка
      ctx.strokeStyle = `rgba(155,92,246,${0.18 + b * 0.72})`;
      ctx.lineWidth   = 1.4;
      ctx.shadowColor = 'rgba(155,92,246,0.6)';
      ctx.shadowBlur  = b > 0.5 ? 7 : 1;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // ── Текст: ВСЕГДА белый, одинаковая яркость ──
      const label = SKILLS[fd.fi] || '';
      if (!label) continue;

      const maxR = Math.max(...fd.p2.map(p => Math.hypot(p.sx - fd.cx, p.sy - fd.cy)));
      const fs   = Math.max(7, Math.min(14, maxR * 0.48));

      ctx.save();
      ctx.translate(fd.cx, fd.cy);
      ctx.font         = `700 ${fs}px 'Syne', 'JetBrains Mono', sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      // Текст всегда одного цвета — чисто белый, одинаковая яркость на всех гранях
      ctx.shadowColor = 'rgba(155,92,246,0.4)';
      ctx.shadowBlur  = 4;
      ctx.fillStyle   = 'rgba(240,237,232,1)';
      ctx.fillText(label, 0, 0);
      ctx.shadowBlur  = 0;

      // Линия под текстом
      const lw = Math.min(maxR * 0.65, 32);
      ctx.strokeStyle = `rgba(155,92,246,${0.12 + b * 0.4})`;
      ctx.lineWidth   = 0.7;
      ctx.beginPath();
      ctx.moveTo(-lw/2, fs * 0.82);
      ctx.lineTo( lw/2, fs * 0.82);
      ctx.stroke();

      ctx.restore();
    }

    angleY += hovered ? 0.003 : 0.008;
    requestAnimationFrame(draw);
  }

  draw();
})();