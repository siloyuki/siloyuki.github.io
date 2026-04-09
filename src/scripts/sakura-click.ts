/**
 * Sakura petal particle effect on mouse click.
 * Uses requestAnimationFrame for smooth, performant animation.
 * Active on all devices and all pages (including Swup SPA navigation).
 */

const PETAL_COUNT = 7;
const PETAL_COLORS = ['#ffb7c5', '#ffc8d4', '#ff91aa', '#ffd1dc', '#ffadc0'];

// Inline SVG petal shape — teardrop-like ellipse
function makePetalSvg(color: string, rotation: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">` +
    `<ellipse cx="9" cy="9" rx="4" ry="8" fill="${color}" opacity="0.88" transform="rotate(${rotation},9,9)"/>` +
    `</svg>`
  );
}

interface PetalState {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  lastTime: number;
}

// Animate a single petal via rAF — delta time normalized to 60fps
function animatePetal(state: PetalState, now: number): void {
  const dt = Math.min((now - state.lastTime) / (1000 / 60), 3); // cap at 3x to avoid jumps on tab switch
  state.lastTime = now;

  state.vy += 0.13 * dt;
  state.vx *= Math.pow(0.97, dt);
  state.x  += state.vx * dt;
  state.y  += state.vy * dt;
  state.rotation += state.rotSpeed * dt;
  state.opacity  -= 0.024 * dt;

  state.el.style.transform = `translate(${state.x - 9}px,${state.y - 9}px) rotate(${state.rotation}deg)`;
  state.el.style.opacity   = String(state.opacity);

  if (state.opacity > 0) {
    requestAnimationFrame((t) => animatePetal(state, t));
  } else {
    state.el.remove();
  }
}

// Spawn one petal from (cx, cy)
function spawnPetal(cx: number, cy: number, index: number): void {
  const el = document.createElement('div');
  const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  const svgRotation = Math.floor(Math.random() * 360);

  el.innerHTML = makePetalSvg(color, svgRotation);
  el.style.cssText =
    `position:fixed;left:0;top:0;pointer-events:none;z-index:99999;will-change:transform,opacity;transform:translate(${cx - 9}px,${cy - 9}px);`;
  document.body.appendChild(el);

  // Spread petals in a full circle with slight randomness
  const baseAngle = (index / PETAL_COUNT) * Math.PI * 2;
  const angle     = baseAngle + (Math.random() - 0.5) * 0.9;
  const speed     = 1.5 + Math.random() * 2.0;

  const state: PetalState = {
    el,
    x:         cx,
    y:         cy,
    vx:        Math.cos(angle) * speed,
    vy:        Math.sin(angle) * speed - 2.5, // initial upward burst
    rotation:  Math.random() * 360,
    rotSpeed:  (Math.random() - 0.5) * 14,
    opacity:   1,
    lastTime:  performance.now(),
  };

  // Stagger launch slightly so petals don't all start at the exact same frame
  setTimeout(() => requestAnimationFrame((t) => animatePetal(state, t)), index * 18);
}

// Burst all petals at click position
function burst(x: number, y: number): void {
  for (let i = 0; i < PETAL_COUNT; i++) {
    spawnPetal(x, y, i);
  }
}

// Store handler on window to prevent duplicate registration across Swup navigations
function handleClick(e: MouseEvent) {
  burst(e.clientX, e.clientY);
}

if ((window as any).__sakuraHandler) {
  document.removeEventListener('click', (window as any).__sakuraHandler);
}
(window as any).__sakuraHandler = handleClick;
document.addEventListener('click', handleClick);
