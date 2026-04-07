/**
 * Sakura petal particle effect on mouse click.
 * Uses requestAnimationFrame for smooth, performant animation.
 * Only active on pointer:fine devices (desktop/laptop).
 */

// Skip on touch/mobile devices
if (window.matchMedia('(pointer: fine)').matches) {
  const PETAL_COUNT = 10;
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
  }

  // Animate a single petal via rAF
  function animatePetal(state: PetalState): void {
    state.vy += 0.20;   // gravity
    state.vx *= 0.97;   // horizontal drag
    state.x  += state.vx;
    state.y  += state.vy;
    state.rotation += state.rotSpeed;
    state.opacity  -= 0.024;

    state.el.style.transform = `translate(${state.x - 9}px,${state.y - 9}px) rotate(${state.rotation}deg)`;
    state.el.style.opacity   = String(state.opacity);

    if (state.opacity > 0) {
      requestAnimationFrame(() => animatePetal(state));
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
      'position:fixed;left:0;top:0;pointer-events:none;z-index:99999;will-change:transform,opacity;';
    document.body.appendChild(el);

    // Spread petals in a full circle with slight randomness
    const baseAngle = (index / PETAL_COUNT) * Math.PI * 2;
    const angle     = baseAngle + (Math.random() - 0.5) * 0.9;
    const speed     = 2.5 + Math.random() * 3.5;

    const state: PetalState = {
      el,
      x:         cx,
      y:         cy,
      vx:        Math.cos(angle) * speed,
      vy:        Math.sin(angle) * speed - 4, // initial upward burst
      rotation:  Math.random() * 360,
      rotSpeed:  (Math.random() - 0.5) * 14,
      opacity:   1,
    };

    // Stagger launch slightly so petals don't all start at the exact same frame
    setTimeout(() => requestAnimationFrame(() => animatePetal(state)), index * 18);
  }

  // Burst all petals at click position
  function burst(x: number, y: number): void {
    for (let i = 0; i < PETAL_COUNT; i++) {
      spawnPetal(x, y, i);
    }
  }

  document.addEventListener('click', (e: MouseEvent) => {
    burst(e.clientX, e.clientY);
  });
}
