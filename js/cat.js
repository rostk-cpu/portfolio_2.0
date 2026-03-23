/**
 * cat.js — Реалистичный котик с плавной траекторией
 */
(function () {

  const oldSvg = document.getElementById('cat-svg');
  const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  newSvg.setAttribute('id', 'cat-svg');
  newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  newSvg.setAttribute('viewBox', '0 0 80 72');
  newSvg.setAttribute('width', '64');
  newSvg.setAttribute('height', '58');
  newSvg.style.cssText = 'position:fixed;z-index:9990;pointer-events:none;overflow:visible;will-change:left,top,transform';

  newSvg.innerHTML = `
    <path id="cat-tail"
      d="M62 54 Q76 50 74 62 Q72 70 62 66"
      stroke="#1a1028" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="38" cy="52" rx="22" ry="16" fill="#1a1028"/>
    <ellipse cx="38" cy="55" rx="13" ry="9" fill="#261838"/>
    <ellipse cx="22" cy="66" rx="8" ry="5" fill="#1a1028"/>
    <ellipse cx="54" cy="66" rx="7" ry="5" fill="#1a1028"/>
    <line x1="17" y1="69" x2="17" y2="71" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="21" y1="70" x2="21" y2="72" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="25" y1="69" x2="25" y2="71" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="50" y1="69" x2="50" y2="71" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="54" y1="70" x2="54" y2="72" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="58" y1="69" x2="58" y2="71" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <rect x="30" y="30" width="16" height="12" rx="6" fill="#1a1028"/>
    <ellipse cx="38" cy="24" rx="18" ry="17" fill="#1e1230"/>
    <polygon points="22,14 16,2 30,10" fill="#1a1028"/>
    <polygon points="54,14 60,2 46,10" fill="#1a1028"/>
    <polygon points="23,13 18,5 29,11" fill="#c87090"/>
    <polygon points="53,13 58,5 47,11" fill="#c87090"/>
    <path d="M23 14 Q27 11 31 14" stroke="#0d0818" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M45 14 Q49 11 53 14" stroke="#0d0818" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="22" rx="5.5" ry="5" fill="#2e1f48"/>
    <ellipse cx="48" cy="22" rx="5.5" ry="5" fill="#2e1f48"/>
    <ellipse cx="28" cy="22" rx="2.2" ry="4" fill="#0a0612"/>
    <ellipse cx="48" cy="22" rx="2.2" ry="4" fill="#0a0612"/>
    <circle cx="30" cy="20" r="1.1" fill="white"/>
    <circle cx="50" cy="20" r="1.1" fill="white"/>
    <polygon points="38,29 35.5,32 40.5,32" fill="#c87090"/>
    <path d="M34 33 Q38 31 42 33" stroke="#0d0818" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M36 33 Q37 35 38 34 Q39 35 40 33" stroke="#0d0818" stroke-width="0.9" fill="none" stroke-linecap="round"/>
    <line x1="18" y1="30" x2="34" y2="30" stroke="#4a3860" stroke-width="0.9" opacity="0.9"/>
    <line x1="18" y1="33" x2="33" y2="32" stroke="#4a3860" stroke-width="0.9" opacity="0.8"/>
    <line x1="18" y1="36" x2="33" y2="34.5" stroke="#4a3860" stroke-width="0.9" opacity="0.7"/>
    <line x1="58" y1="30" x2="42" y2="30" stroke="#4a3860" stroke-width="0.9" opacity="0.9"/>
    <line x1="58" y1="33" x2="43" y2="32" stroke="#4a3860" stroke-width="0.9" opacity="0.8"/>
    <line x1="58" y1="36" x2="43" y2="34.5" stroke="#4a3860" stroke-width="0.9" opacity="0.7"/>
    <ellipse id="paw-l" cx="26" cy="64" rx="7" ry="5" fill="#1a1028"/>
    <ellipse id="paw-r" cx="50" cy="64" rx="7" ry="5" fill="#1a1028"/>
    <line x1="22" y1="67" x2="22" y2="69" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="26" y1="68" x2="26" y2="70" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="30" y1="67" x2="30" y2="69" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="46" y1="67" x2="46" y2="69" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="50" y1="68" x2="50" y2="70" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="54" y1="67" x2="54" y2="69" stroke="#0d0818" stroke-width="1.2" stroke-linecap="round"/>
  `;

  oldSvg.replaceWith(newSvg);

  const catSvg  = document.getElementById('cat-svg');
  const catTail = document.getElementById('cat-tail');
  const pawL    = document.getElementById('paw-l');
  const pawR    = document.getElementById('paw-r');

  const MARGIN = 18;
  const DRIFT  = 14;
  const SPEED  = 1.1;

  let x = MARGIN, y = MARGIN;
  let targetX = 0, targetY = 0;
  let angle = 0;

  const STATE = { WALK: 'walk', SIT: 'sit', LICK: 'lick' };
  let state      = STATE.WALK;
  let stateTimer = 0;
  let stateDur   = 0;

  let walkPhase = 0;
  let tailPhase = 0;
  let lickPhase = 0;

  let edge    = 0;
  let edgePos = 0;

  function getEdgePoint(e, pos) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const d = DRIFT;
    switch (e % 4) {
      case 0: return { x: pos * W, y: MARGIN + Math.sin(pos * 12) * d };
      case 1: return { x: W - MARGIN - Math.sin(pos * 10) * d, y: pos * H };
      case 2: return { x: (1 - pos) * W, y: H - MARGIN - Math.sin(pos * 11) * d };
      case 3: return { x: MARGIN + Math.sin(pos * 9) * d, y: (1 - pos) * H };
    }
  }

  function nextTarget() {
    edgePos += 0.04 + Math.random() * 0.06;
    if (edgePos >= 1) { edgePos -= 1; edge = (edge + 1) % 4; }
    const pt = getEdgePoint(edge, edgePos);
    targetX = pt.x;
    targetY = pt.y;
  }

  { const pt = getEdgePoint(0, 0.1); x = pt.x; y = pt.y; }
  nextTarget();

  function animate() {
    stateTimer++;
    tailPhase += 0.07;

    if (state === STATE.WALK && stateTimer > 220 + Math.random() * 300) {
      state = Math.random() < 0.6 ? STATE.SIT : STATE.LICK;
      stateDur   = 90 + Math.random() * 160;
      stateTimer = 0;
    }
    if (state !== STATE.WALK && stateTimer > stateDur) {
      state = STATE.WALK;
      stateTimer = 0;
    }

    if (state === STATE.WALK) {
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 8) {
        nextTarget();
      } else {
        const spd = SPEED * (0.85 + Math.sin(walkPhase * 2) * 0.15);
        x += (dx / dist) * spd;
        y += (dy / dist) * spd;

        const desiredAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        let diff = desiredAngle - angle;
        while (diff > 180)  diff -= 360;
        while (diff < -180) diff += 360;
        angle += diff * 0.08;
      }
      walkPhase += 0.18;
    }

    // Хвост
    const tailAmp  = state === STATE.WALK ? 10 : 5;
    const tailFreq = state === STATE.WALK ? 2.8 : 1.2;
    const tw = Math.sin(tailPhase * tailFreq) * tailAmp;
    catTail.setAttribute('d',
      `M62 54 Q${76 + tw} ${50 + tw * 0.3} ${74 + tw * 0.6} 62 Q72 70 62 66`
    );

    // Лапы
    const bob      = state === STATE.WALK ? Math.abs(Math.sin(walkPhase)) * 3 : 0;
    const pawSwing = state === STATE.WALK ? Math.sin(walkPhase) * 3 : 0;
    if (pawL) pawL.setAttribute('cy', String(64 - bob + pawSwing));
    if (pawR) pawR.setAttribute('cy', String(64 - bob - pawSwing));

    // Умывание
    let lickRot = '';
    if (state === STATE.LICK) {
      lickPhase += 0.12;
      const lo = Math.sin(lickPhase * 3) * 2;
      lickRot = `rotate(${lo}deg)`;
    }

    catSvg.style.left      = (x - 32) + 'px';
    catSvg.style.top       = (y - 29) + 'px';
    const sitScale = state === STATE.SIT ? 'scaleY(0.88)' : '';
    catSvg.style.transform = [`rotate(${angle}deg)`, sitScale, lickRot].filter(Boolean).join(' ');

    requestAnimationFrame(animate);
  }

  animate();
})();