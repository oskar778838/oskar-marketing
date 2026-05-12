import * as THREE from "three";
import { AURORA_FRAGMENT_SHADER, VERTEX_SHADER } from "./shader.frag";

export function initHeroBackground(canvas: HTMLCanvasElement) {
  // Reduced-motion fallback: render once with t=0, no animation loop
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });

  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uMouse: {
      value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
    },
    uResolution: {
      value: new THREE.Vector2(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio
      ),
    },
    uScrollT: { value: 0 },
    uScrollPulse: { value: 0 },
    uHotspot1: { value: new THREE.Vector2(0.3, 0.4) },
    uHotspot2: { value: new THREE.Vector2(0.7, 0.65) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: AURORA_FRAGMENT_SHADER,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Verify shader compiled
  const gl = renderer.getContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const program = (material as any).program;
  if (program && program.program) {
    const linked = gl.getProgramParameter(program.program, gl.LINK_STATUS);
    if (!linked) {
      console.error(
        "Hero shader failed to link:",
        gl.getProgramInfoLog(program.program)
      );
    }
  }

  const mouseTarget = new THREE.Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  const mouseCurrent = new THREE.Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  if (!isTouchDevice()) {
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseTarget.set(
          e.clientX * pixelRatio,
          (window.innerHeight - e.clientY) * pixelRatio
        );
      },
      { passive: true }
    );
  } else {
    // Touch device: slow auto-drift mouse position
    let driftAngle = 0;
    setInterval(() => {
      driftAngle += 0.005;
      mouseTarget.set(
        (window.innerWidth / 2 +
          Math.cos(driftAngle) * window.innerWidth * 0.3) *
          pixelRatio,
        (window.innerHeight / 2 +
          Math.sin(driftAngle * 0.7) * window.innerHeight * 0.3) *
          pixelRatio
      );
    }, 50);
  }

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio);
  });

  // Scroll-reactive uniforms: uScrollT smoothly tracks normalized page scroll
  // (0 at top, 1 at bottom). uScrollPulse is a short impulse whenever the user
  // scrolls — speeds up the aurora flow briefly and decays back to 0.
  let scrollPulse = 0;
  let lastScrollY = window.scrollY;
  function onScroll() {
    const dy = Math.abs(window.scrollY - lastScrollY);
    scrollPulse = Math.min(1, scrollPulse + dy * 0.005);
    lastScrollY = window.scrollY;
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  const startTime = performance.now();

  function animate() {
    const t = (performance.now() - startTime) / 1000;
    uniforms.uTime.value = t;

    mouseCurrent.lerp(mouseTarget, 0.05);
    uniforms.uMouse.value.copy(mouseCurrent);

    // Hot-spots drift on slow Lissajous trajectories — never repeating exactly.
    uniforms.uHotspot1.value.set(
      0.5 + Math.cos(t * 0.07) * 0.32 + Math.sin(t * 0.018) * 0.10,
      0.5 + Math.sin(t * 0.05) * 0.28 + Math.cos(t * 0.022) * 0.08
    );
    uniforms.uHotspot2.value.set(
      0.5 + Math.sin(t * 0.06) * 0.34 + Math.cos(t * 0.014) * 0.10,
      0.5 + Math.cos(t * 0.045) * 0.30 + Math.sin(t * 0.025) * 0.08
    );

    // Page-scroll progress (0..1).
    const docH =
      document.documentElement.scrollHeight - window.innerHeight;
    uniforms.uScrollT.value = docH > 0 ? window.scrollY / docH : 0;

    // Decay scroll pulse exponentially — short bursts, not a sustained boost.
    scrollPulse *= 0.92;
    uniforms.uScrollPulse.value = scrollPulse;

    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      requestAnimationFrame(animate);
    }
  }

  animate();

  return { renderer, scene, camera, uniforms };
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
