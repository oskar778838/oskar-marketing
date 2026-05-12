// High-poly lamellae spiral hero centerpiece. Replaces the previous
// low-poly icosahedron crystal.
//
// Architecture: 200 thin RingGeometry plates rotated ~1.8° apart around
// the Y-axis, vertically distributed -1..+1, outer-radius peaks in the
// middle as a sin curve (waist shape).
//
// API: setProgress(0..1) drives a scrubbed timeline used by GSAP's
// scroll-pin (Phase 2). Mouse + touch + (optional) gyroscope feed a
// shared mouseTarget that biases the spiral's tilt.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const HAS_FINE_POINTER = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;
const HW_CONCURRENCY = navigator.hardwareConcurrency ?? 4;
const IS_LOW_END = HW_CONCURRENCY < 6;
const IS_TOUCH = !HAS_FINE_POINTER;
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Tier-based quality settings. Premium desktop gets the full 200-lamellae
// spiral with 64-segment rings; mobile drops to 100 with 32 segments.
const QUALITY = (() => {
  if (IS_IOS) {
    return { lamellae: 80, segments: 32, dpr: 1.5, antialias: false };
  }
  if (IS_LOW_END || IS_TOUCH) {
    return { lamellae: 100, segments: 36, dpr: 1.5, antialias: true };
  }
  return { lamellae: 200, segments: 64, dpr: 2, antialias: true };
})();

export interface LamellaeHandle {
  setProgress(p: number): void;
  setIntensity(v: number): void;
  dispose(): void;
}

export function initLamellae(canvas: HTMLCanvasElement): LamellaeHandle {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: QUALITY.antialias,
      alpha: true,
      powerPreference: "high-performance",
      // Premium quality settings
      preserveDrawingBuffer: false,
    });
  } catch {
    return noopHandle();
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, QUALITY.dpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 3.6);

  // Programmatic env reflections — 0KB asset cost, neutral PBR baseline.
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  envScene.dispose?.();

  // Single shared material — every lamella references it. Cuts uniform
  // uploads and lets the GPU batch draw calls efficiently.
  const lamellaeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe8c96a,
    metalness: 0.95,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.8,
    iridescence: 0.5,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [120, 480],
    side: THREE.DoubleSide,
  });

  // Spiral group — 200 plates fanning a full 360° around Y, vertically
  // distributed -1..+1 with a sin-waist outer-radius profile.
  const spiral = new THREE.Group();
  const lamellaCount = QUALITY.lamellae;
  const totalRotation = Math.PI * 2; // full 360° spiral
  const yRangeBase = 2.0; // -1 to +1 baseline; opens up during scroll
  const lamellae: THREE.Mesh[] = [];

  for (let i = 0; i < lamellaCount; i++) {
    const t = i / (lamellaCount - 1);
    const rotationZ = t * totalRotation;
    // Sin-curve waist: 0 → 1 → 0 across the spiral, peaks at t=0.5.
    const radiusFactor = Math.sin(t * Math.PI);
    const outerRadius = 0.42 + radiusFactor * 0.62;
    const innerRadius = outerRadius * 0.36;

    const geo = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      QUALITY.segments,
      1
    );
    const mesh = new THREE.Mesh(geo, lamellaeMaterial);
    // Lay flat — the ring's own plane is rotated to lie in the XZ plane.
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = rotationZ;
    mesh.position.y = -1 + t * yRangeBase;
    // Cache a per-lamella t for animation uniforms below.
    mesh.userData.t = t;
    spiral.add(mesh);
    lamellae.push(mesh);
  }
  scene.add(spiral);

  // Lighting: HDRI env handles general fill, plus 3 directional accents.
  const keyLight = new THREE.DirectionalLight(0xfff5d6, 1.2);
  keyLight.position.set(2.5, 3, 2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xa8c0ff, 0.4);
  fillLight.position.set(-2, -1, 1.5);
  scene.add(fillLight);

  const rimLight = new THREE.SpotLight(0xe8c96a, 0.8, 12, Math.PI / 4, 0.6);
  rimLight.position.set(-2.5, 0, -2.5);
  scene.add(rimLight);

  const ambient = new THREE.AmbientLight(0xc9a84c, 0.15);
  scene.add(ambient);

  // ── Interaction state ─────────────────────────────────────
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouseCurrent = new THREE.Vector2(0, 0);

  // Mouse (desktop)
  if (HAS_FINE_POINTER) {
    window.addEventListener(
      "pointermove",
      (e) => {
        mouseTarget.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
      },
      { passive: true }
    );
  }

  // Touch — drags the spiral along a normalized vector. Same target as mouse
  // so the animate loop has one path to read from.
  if (IS_TOUCH) {
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        mouseTarget.set(
          (touch.clientX / window.innerWidth) * 2 - 1,
          -(touch.clientY / window.innerHeight) * 2 + 1
        );
      },
      { passive: true }
    );

    // Optional: device orientation. Wired but only enables after a user
    // tap (iOS requires permission gesture). Failing the permission
    // request silently falls back to touch-drag only.
    initGyroscope(mouseTarget);
  }

  // ── Scroll-pin progress hook (Phase 2 driver) ─────────────
  let progress = 0;
  let intensity = 1.0;

  // ── Resize ────────────────────────────────────────────────
  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const resizeObserver =
    "ResizeObserver" in window
      ? new ResizeObserver(() => resize())
      : null;
  if (resizeObserver) resizeObserver.observe(canvas);
  window.addEventListener("resize", resize);
  resize();

  // ── Animate ──────────────────────────────────────────────
  const startTime = performance.now();
  let lastTime = startTime;
  let raf = 0;

  function animate(): void {
    raf = requestAnimationFrame(animate);
    if (document.hidden) return;

    const now = performance.now();
    const t = (now - startTime) / 1000;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Idle Y-rotation — slow, premium feel. ~50s per revolution.
    spiral.rotation.y += dt * 0.13 * intensity;

    // Float — sine-driven Y bob.
    spiral.position.y = Math.sin(t * 0.4) * 0.06;

    // Mouse / touch / gyro influence on spiral tilt.
    mouseCurrent.lerp(mouseTarget, 0.06);
    spiral.rotation.x = -0.18 + mouseCurrent.y * 0.30;
    spiral.rotation.z = mouseCurrent.x * 0.16;

    // ── Scroll-driven 4-stage transformation ──────────────
    // p = 0..1 from the GSAP ScrollTrigger pin.
    const p = progress;

    // Stage A (0..0.25): extra Y-rotation (180° added).
    const extraY = ease(Math.min(1, p / 0.25)) * Math.PI;
    // Stage B (0.25..0.5): camera dollies back from 3.6 to 4.6.
    const stageB = clamp((p - 0.25) / 0.25, 0, 1);
    camera.position.z = 3.6 + ease(stageB) * 1.0;
    // Stage B also tilts spiral X (already biased by mouse). Add bias.
    const camTilt = ease(stageB) * 0.32;
    // Stage C (0.5..0.75): lamellae spread along Y (yRange opens up).
    const stageC = clamp((p - 0.5) / 0.25, 0, 1);
    const yRange = yRangeBase + ease(stageC) * 1.5;
    // Stage D (0.75..1): scale + opacity fade-out.
    const stageD = clamp((p - 0.75) / 0.25, 0, 1);
    const fadeScale = 1 - ease(stageD) * 0.18;

    spiral.rotation.y += extraY * dt * 0.4; // Slowly accumulate the extra
    spiral.rotation.x += camTilt * dt * 0.4;
    spiral.scale.setScalar(fadeScale);

    // Open up vertically: re-position each lamella based on yRange.
    for (let i = 0; i < lamellae.length; i++) {
      const lt = lamellae[i].userData.t as number;
      lamellae[i].position.y = -yRange / 2 + lt * yRange;
    }

    // Material opacity tween when fading out.
    if (stageD > 0) {
      lamellaeMaterial.transparent = true;
      lamellaeMaterial.opacity = 1 - stageD * 0.5;
    } else if (lamellaeMaterial.transparent) {
      lamellaeMaterial.transparent = false;
      lamellaeMaterial.opacity = 1;
    }

    renderer.render(scene, camera);
  }

  if (PREFERS_REDUCED_MOTION) {
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(animate);
  }

  // ── Public handle ────────────────────────────────────────
  return {
    setProgress(p: number): void {
      progress = clamp(p, 0, 1);
    },
    setIntensity(v: number): void {
      intensity = Math.max(0, v);
    },
    dispose(): void {
      cancelAnimationFrame(raf);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      for (const m of lamellae) m.geometry.dispose();
      lamellaeMaterial.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

function noopHandle(): LamellaeHandle {
  return {
    setProgress: () => {},
    setIntensity: () => {},
    dispose: () => {},
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Cubic-out for in-range easings. Cheap, premium-feeling.
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Optional gyroscope (touch devices, requires user permission on iOS) ──
function initGyroscope(target: THREE.Vector2): void {
  // iOS-style permission API — only trigger on user interaction (first tap).
  // Other browsers expose deviceorientation without permission.
  type DOEvent = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  const DOE = (window.DeviceOrientationEvent as unknown) as DOEvent;
  if (!DOE) return;

  let granted = false;
  function attach(): void {
    if (granted) return;
    granted = true;
    window.addEventListener(
      "deviceorientation",
      (e) => {
        const beta = e.beta ?? 0; // -180..180
        const gamma = e.gamma ?? 0; // -90..90
        // Subtle: max influence at 45° tilt, scaled to 0.4 of the touch range.
        target.x = clamp((gamma / 45) * 0.4, -0.4, 0.4);
        target.y = clamp(((beta - 30) / 45) * 0.4, -0.4, 0.4);
      },
      { passive: true }
    );
  }

  if (typeof DOE.requestPermission === "function") {
    // Wait for any tap, then request once.
    const onTap = (): void => {
      window.removeEventListener("touchstart", onTap);
      DOE.requestPermission?.()
        .then((res) => {
          if (res === "granted") attach();
        })
        .catch(() => undefined);
    };
    window.addEventListener("touchstart", onTap, { once: true, passive: true });
  } else {
    attach();
  }
}
