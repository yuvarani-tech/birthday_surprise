/* ════════════════════════════════════════════════
   BIRTHDAY SURPRISE v2 — script.js
════════════════════════════════════════════════ */
'use strict';

/* ── Screen transitions ─────────────────────── */
const SCREENS = ['s1','s2','s3','s4','s5','s6','s7','s8'];

function goTo(id, onEnter) {
  const cur  = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (!next || next === cur) return;
  cur.classList.remove('active');
  cur.classList.add('leaving');
  setTimeout(() => cur.classList.remove('leaving'), 900);
  next.classList.add('active');
  if (onEnter) setTimeout(onEnter, 80);
}

/* ── Global floating hearts ─────────────────── */
function spawnHearts(container, count, emojis) {
  emojis = emojis || ['💗','💕','💖','💓','💝','🌸','✨'];
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'flt-h';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.setProperty('--lx',   Math.random() * 100 + '%');
    el.style.setProperty('--dur',  (4 + Math.random() * 6) + 's');
    el.style.setProperty('--del',  (Math.random() * 8) + 's');
    el.style.setProperty('--fs',   (0.9 + Math.random() * 0.8) + 'rem');
    container.appendChild(el);
  }
}
spawnHearts(document.getElementById('global-hearts'), 20);

/* ════════════════════════════════════════════════
   SCREEN 1 — COUNTDOWN
════════════════════════════════════════════════ */
(function initS1() {
  // Spawn twinkling stars
  const sl = document.getElementById('stars-layer');
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = 1 + Math.random() * 3;
    s.style.cssText = `
      width:${sz}px; height:${sz}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --st:${1.2 + Math.random()*2.5}s;
      animation-delay:${Math.random()*3}s;
    `;
    sl.appendChild(s);
  }

  // Countdown
  const numEl = document.getElementById('cd-number');
  const seq   = [3, 2, 1, '✨'];
  let i = 0;

  function tick() {
    numEl.classList.remove('cd-out');
    void numEl.offsetWidth;
    numEl.textContent = seq[i];
    setTimeout(() => {
      numEl.classList.add('cd-out');
      i++;
      if (i < seq.length) setTimeout(tick, 480);
      else setTimeout(() => goTo('s2', initS2), 550);
    }, 820);
  }
  setTimeout(tick, 600);
})();

/* ════════════════════════════════════════════════
   SCREEN 2 — LOADING
════════════════════════════════════════════════ */
function initS2() {
  const bar = document.getElementById('load-bar');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.width = '100%';
  }));
  setTimeout(() => goTo('s3'), 3900);
}

/* ════════════════════════════════════════════════
   SCREEN 3 — INTRO
════════════════════════════════════════════════ */
document.getElementById('start-btn').addEventListener('click', () => {
  goTo('s4', initS4);
});

/* ════════════════════════════════════════════════
   SCREEN 4 — BIRTHDAY / CAKE
════════════════════════════════════════════════ */
function initS4() {
  // Build starfield
  const sf = document.getElementById('hbd-starfield');
  sf.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star-pt';
    const sz = 1 + Math.random() * 3;
    s.style.cssText = `
      width:${sz}px; height:${sz}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --sb:${1 + Math.random()*2.5}s;
      animation-delay:${Math.random()*4}s;
    `;
    sf.appendChild(s);
  }

  const blowBtn  = document.getElementById('blow-btn');
  const cakeEl   = document.getElementById('cake-emoji-big');
  const candles  = document.querySelectorAll('.cndl');
  const poppers  = document.getElementById('poppers-row');
  const balloons = document.getElementById('balloons-field');
  const nextBtn  = document.getElementById('s4-next');
  let   blown    = false;

  blowBtn.addEventListener('click', () => {
    if (blown) return;
    blown = true;

    // Blow wind effect on button
    blowBtn.textContent = '💨💨 Blown!';
    blowBtn.disabled    = true;

    // Candles fade out one by one
    candles.forEach((c, idx) => {
      setTimeout(() => {
        c.style.transition = 'opacity 0.3s';
        c.style.opacity    = '0';
      }, idx * 150);
    });

    // Cake shakes
    setTimeout(() => cakeEl.classList.add('blew-out'), 500);

    // Flash
    document.body.style.background = 'rgba(255,255,255,0.92)';
    setTimeout(() => (document.body.style.background = ''), 180);

    // Launch confetti
    setTimeout(() => {
      launchConfetti();
      poppers.style.display = 'flex';
      balloons.style.display = 'block';
    }, 700);

    // Show Next button
    setTimeout(() => { nextBtn.style.display = 'inline-flex'; }, 2200);
  });

  nextBtn.addEventListener('click', () => goTo('s5', initS5));
}

/* ════════════════════════════════════════════════
   CONFETTI ENGINE
════════════════════════════════════════════════ */
const confCvs = document.getElementById('confetti-canvas');
const confCtx = confCvs.getContext('2d');
let   confParts = [];
let   confRaf   = null;

function launchConfetti() {
  confCvs.width  = window.innerWidth;
  confCvs.height = window.innerHeight;
  confParts = [];
  const cols = ['#ff69b4','#ffd700','#c77dff','#ff6b8a','#00e5ff','#ff4500','#fff','#ffb3c6','#d4b8e0'];
  for (let i = 0; i < 200; i++) {
    confParts.push({
      x:     Math.random() * confCvs.width,
      y:     -10 - Math.random() * confCvs.height * 0.6,
      r:     3 + Math.random() * 6,
      color: cols[Math.floor(Math.random() * cols.length)],
      vx:    (Math.random() - 0.5) * 5,
      vy:    2 + Math.random() * 4.5,
      angle: Math.random() * Math.PI * 2,
      va:    (Math.random() - 0.5) * 0.18,
      alpha: 1,
      shape: Math.random() > 0.45 ? 'rect' : 'circle'
    });
  }
  cancelAnimationFrame(confRaf);
  drawConf();
}

function drawConf() {
  confCtx.clearRect(0, 0, confCvs.width, confCvs.height);
  confParts = confParts.filter(p => p.alpha > 0.02);
  confParts.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.angle += p.va;
    if (p.y > confCvs.height) p.alpha -= 0.035;
    confCtx.save();
    confCtx.globalAlpha = p.alpha;
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.angle);
    confCtx.fillStyle = p.color;
    if (p.shape === 'rect') {
      confCtx.fillRect(-p.r / 2, -p.r, p.r, p.r * 2);
    } else {
      confCtx.beginPath();
      confCtx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
      confCtx.fill();
    }
    confCtx.restore();
  });
  if (confParts.length) confRaf = requestAnimationFrame(drawConf);
  else confCtx.clearRect(0, 0, confCvs.width, confCvs.height);
}

/* ════════════════════════════════════════════════
   SCREEN 5 — GALLERY
════════════════════════════════════════════════ */
function initS5() {
  const track   = document.getElementById('film-track');
  const cards   = track.querySelectorAll('.film-card');
  const dotsEl  = document.getElementById('film-dots');
  const prevBtn = document.getElementById('gal-prev');
  const nextBtn = document.getElementById('gal-next');
  const total   = cards.length;
  let   idx     = 0;
  let   autoTmr = null;

  // Build dots
  dotsEl.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'film-dot' + (i === 0 ? ' on' : '');
    d.addEventListener('click', () => moveTo(i));
    dotsEl.appendChild(d);
  }

  function moveTo(n) {
    idx = ((n % total) + total) % total;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsEl.querySelectorAll('.film-dot').forEach((d, i) => d.classList.toggle('on', i === idx));
  }

  prevBtn.addEventListener('click', () => { clearInterval(autoTmr); moveTo(idx - 1); });
  nextBtn.addEventListener('click', () => { clearInterval(autoTmr); moveTo(idx + 1); });

  // Faster auto-advance (1.8s)
  autoTmr = setInterval(() => moveTo(idx + 1), 1800);

  // Touch swipe
  let sx = null;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 35) { clearInterval(autoTmr); moveTo(dx < 0 ? idx + 1 : idx - 1); }
    sx = null;
  });

  document.getElementById('s5-next').addEventListener('click', () => {
    clearInterval(autoTmr);
    goTo('s6', initS6);
  });
}

/* ════════════════════════════════════════════════
   SCREEN 6 — ENVELOPE
════════════════════════════════════════════════ */
function initS6() {
  const envWrap = document.getElementById('env-wrap3d');
  const btn     = document.getElementById('open-env-btn');
  let   opened  = false;

  function openIt() {
    if (opened) return;
    opened = true;
    envWrap.classList.add('opened');
    btn.disabled = true;
    btn.style.opacity = '0.5';
    setTimeout(() => goTo('s7', initS7), 1300);
  }

  btn.addEventListener('click', openIt);
  envWrap.addEventListener('click', openIt);
}

/* ════════════════════════════════════════════════
   SCREEN 7 — LETTER  (typing + side images)
════════════════════════════════════════════════ */
const LETTER = `Happy Birthday, My Girl... 🎂

Thank you for being part of my life,
for every smile, every memory,
and every beautiful moment we've shared.

You make everything brighter just by
being you — your laugh, your eyes,
your kindness means the world to me. 🌸

I hope this year brings you all the
joy and happiness you truly deserve.

Never forget how loved and special
you are to me. Always. 💕

Keep smiling always,
and know I'm always here for you. 🤍`;

function initS7() {
  // Floating hearts on letter screen
  spawnHearts(document.getElementById('letter-hearts-bg'), 16);

  // Animate side cards in sequence
  const cards = document.querySelectorAll('.side-img-card');
  cards.forEach((c, i) => {
    c.style.opacity   = '0';
    c.style.transform = 'translateX(30px)';
    c.style.transition= `opacity 0.4s ease ${i * 0.12}s, transform 0.4s ease ${i * 0.12}s`;
    setTimeout(() => {
      c.style.opacity   = '1';
      c.style.transform = '';
    }, 100 + i * 120);
  });

  // Typing animation
  const bodyEl = document.getElementById('lp-body');
  bodyEl.textContent = '';
  let ci = 0;

  function typeNext() {
    if (ci >= LETTER.length) return;
    bodyEl.textContent += LETTER[ci];
    ci++;
    const ch    = LETTER[ci - 1];
    const delay = (ch === '\n') ? 65 : (ch === ',' || ch === '.') ? 90 : 22;
    setTimeout(typeNext, delay);
  }
  typeNext();

  // Next button (only bind once)
  const btn = document.getElementById('s7-next');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', () => goTo('s8', initS8));
}

/* ════════════════════════════════════════════════
   SCREEN 8 — VIRTUAL HUG
════════════════════════════════════════════════ */
function initS8() {
  // Spawn floating hearts & sparkles
  spawnHearts(document.getElementById('hug-hearts-bg'), 22);
  spawnSparkles(document.getElementById('hug-sparkles'), 18);

  const sendBtn  = document.getElementById('send-hug-btn');
  const hugMain  = document.getElementById('hug-main');
  const armsWrap = document.getElementById('arms-wrap');
  const burstRing= document.getElementById('hug-burst-ring');
  const thankMsg = document.getElementById('thank-you-msg');
  const finalVeil= document.getElementById('final-veil');
  const restartBtn = document.getElementById('restart-btn');
  let   hugged   = false;

  // Ensure send btn is clean
  sendBtn.style.display  = 'inline-flex';
  sendBtn.disabled       = false;
  sendBtn.style.opacity  = '1';
  thankMsg.style.display = 'none';
  hugMain.classList.remove('shake');

  sendBtn.addEventListener('click', () => {
    if (hugged) return;
    hugged = true;

    // Shake
    hugMain.classList.add('shake');
    setTimeout(() => hugMain.classList.remove('shake'), 550);

    // Arms open (on fallback)
    if (armsWrap) armsWrap.classList.add('open');

    // Burst hearts
    burstHearts(burstRing);

    // Confetti
    launchConfetti();

    // Glow pulse on the section
    const sec = document.getElementById('s8');
    sec.style.transition = 'box-shadow 0.3s';
    sec.style.boxShadow  = 'inset 0 0 100px rgba(255,105,180,0.5)';
    setTimeout(() => { sec.style.boxShadow = ''; }, 2500);

    // Hide button, show thank-you
    setTimeout(() => {
      sendBtn.style.opacity  = '0';
      setTimeout(() => { sendBtn.style.display = 'none'; }, 300);
      thankMsg.style.display = 'block';
    }, 1000);

    // Show final veil
    setTimeout(() => finalVeil.classList.add('show'), 5000);
  });

  // Build sparkle ring on final veil
  spawnSparkles(document.getElementById('sparkle-ring'), 30);

  restartBtn.addEventListener('click', () => {
    finalVeil.classList.remove('show');
    hugged = false;
    if (armsWrap) armsWrap.classList.remove('open');
    thankMsg.style.display = 'none';
    // Reset progress bar
    const bar = document.getElementById('load-bar');
    bar.style.transition = 'none';
    bar.style.width      = '0%';
    // Reset blow btn
    const bb = document.getElementById('blow-btn');
    bb.textContent = '💨 Blow The Candles!';
    bb.disabled    = false;
    document.querySelectorAll('.cndl').forEach(c => { c.style.opacity = '1'; });
    document.getElementById('poppers-row').style.display = 'none';
    document.getElementById('s4-next').style.display     = 'none';
    // Reset envelope
    document.getElementById('env-wrap3d').classList.remove('opened');
    document.getElementById('open-env-btn').disabled    = false;
    document.getElementById('open-env-btn').style.opacity = '1';
    goTo('s1');
    reinitCountdown();
  });
}

function burstHearts(container) {
  container.innerHTML = '';
  const items = ['💗','💕','💖','💓','💝','🌸','✨','💞','🎊'];

  // Inject keyframe once
  if (!document.getElementById('burst-kf')) {
    const st = document.createElement('style');
    st.id = 'burst-kf';
    st.textContent = `
      @keyframes burstFly {
        0%   { transform: translate(-50%,-50%) scale(0); opacity:1; }
        70%  { opacity:1; }
        100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.3); opacity:0; }
      }`;
    document.head.appendChild(st);
  }

  for (let i = 0; i < 36; i++) {
    const el  = document.createElement('div');
    el.textContent = items[i % items.length];
    const ang = Math.random() * Math.PI * 2;
    const d   = 90 + Math.random() * 180;
    el.style.cssText = `
      position:absolute; left:50%; top:50%;
      font-size:${1 + Math.random()*1.4}rem;
      pointer-events:none;
      animation: burstFly ${0.7 + Math.random()*0.9}s ease forwards;
      animation-delay:${Math.random()*0.25}s;
      --tx:${Math.cos(ang)*d}px;
      --ty:${Math.sin(ang)*d}px;
    `;
    container.appendChild(el);
  }
}

/* ── Sparkle dots ───────────────────────────── */
function spawnSparkles(container, count) {
  container.innerHTML = '';
  const sp = ['✨','⭐','🌟','💫','✦','✧'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sp-item';
    el.textContent = sp[Math.floor(Math.random() * sp.length)];
    el.style.setProperty('--lx',  Math.random() * 100 + '%');
    el.style.setProperty('--dur', (3 + Math.random() * 5) + 's');
    el.style.setProperty('--del', (Math.random() * 7) + 's');
    el.style.setProperty('--fs',  (0.7 + Math.random() * 0.7) + 'rem');
    container.appendChild(el);
  }
}

/* ════════════════════════════════════════════════
   RESTART — reinit countdown
════════════════════════════════════════════════ */
function reinitCountdown() {
  const numEl = document.getElementById('cd-number');
  const seq   = [3, 2, 1, '✨'];
  let i = 0;

  function tick() {
    numEl.classList.remove('cd-out');
    void numEl.offsetWidth;
    numEl.textContent = seq[i];
    setTimeout(() => {
      numEl.classList.add('cd-out');
      i++;
      if (i < seq.length) setTimeout(tick, 480);
      else setTimeout(() => goTo('s2', initS2), 550);
    }, 820);
  }
  setTimeout(tick, 400);
}

/* ── Resize confetti canvas ─────────────────── */
window.addEventListener('resize', () => {
  confCvs.width  = window.innerWidth;
  confCvs.height = window.innerHeight;
});
