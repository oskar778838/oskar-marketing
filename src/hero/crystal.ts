// Programmatic 3D Crystal centerpiece. Three.js + RoomEnvironment.
// No HDRI download, no postprocessing — keeps mobile bundle + frame-rate sane.
//
// Material is real PBR gold (MeshPhysicalMaterial, metalness=1, iridescence)
// lit by an in-memory RoomEnvironment + key/rim DirectionalLights. Reads as
// metal, not plastic.
//
// Animation: slow Y-rotation, sin-float, mouse-influence on X/Z rotation
// (LERP-smoothed), scroll-driven shrink. Pauses when document hidden.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const HAS_FINE_POINTER = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

const HW_CONCURRENCY = (navigator.hardwareConcurrency ?? 4);
const IS_LOW_END = HW_CONCURRENCY < 6;
const IS_TOUCH = !HAS_FINE_POINTER;

export function initCrystal(canvas: HTMLCanvasElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !IS_LOW_END,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    return () => {};
  }

  // Mobile gets a tighter pixelRatio cap to keep fragment work in budget.
  const pixelRatio = Math.min(window.devicePixelRatio, IS_TOUCH ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();

  // Camera — narrow FOV, modest distance — keeps the crystal large in frame.
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 4);

  // RoomEnvironment: programmatic 6-face cube rendered into a PMREM.
  // Provides realistic neutral reflections without shipping an HDRI asset.
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  envScene.dispose?.();

  // Geometry — icosahedron with subtle vertex displacement for asymmetry.
  // Subdivision 2 = 80 faces (premium), 1 = 20 faces (low-end fallback).
  const subdivision = IS_LOW_END ? 1 : 2;
  const geometry = new THREE.IcosahedronGeometry(1, subdivision);
  const positions = geometry.attributes.position as THREE.BufferAttribute;
  // Deterministic-ish per-vertex displacement so the crystal looks organic.
  // Seeded by index so rebuilds are reproducible (no flicker on resize).
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const noise = (pseudoRandom(i) - 0.5) * 0.08; // ~8% displacement
    positions.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  // Material — real PBR gold.
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    metalness: 1.0,
    roughness: 0.18,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.6,
    iridescence: 0.3,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [100, 400],
  });

  const crystal = new THREE.Mesh(geometry, material);
  scene.add(crystal);

  // ── Floating element cluster ──────────────────────────────
  // Smaller secondary geometries that orbit the main crystal. Skipped on
  // low-end hardware to keep the frame budget for the centerpiece.
  interface ClusterMember {
    mesh: THREE.Mesh;
    radius: number;
    speed: number;
    phase: number;
    yAmp: number;
    rotX: number;
    rotY: number;
  }
  const cluster: ClusterMember[] = [];
  if (!IS_LOW_END) {
    const memberCount = 5;
    const blueprints: Array<() => THREE.BufferGeometry> = [
      () => new THREE.IcosahedronGeometry(0.22, 0),
      () => new THREE.OctahedronGeometry(0.18, 0),
      () => new THREE.DodecahedronGeometry(0.20, 0),
      () => new THREE.TorusGeometry(0.16, 0.045, 12, 32),
      () => new THREE.TetrahedronGeometry(0.20, 0),
    ];

    // Cheaper material variant — still gold + metal, slightly higher
    // roughness so they read as "satellites" not duplicates of the lead.
    const memberMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc9a84c,
      metalness: 1.0,
      roughness: 0.28,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.4,
    });

    for (let i = 0; i < memberCount; i++) {
      const blueprint = blueprints[i % blueprints.length];
      const geo = blueprint();
      const mesh = new THREE.Mesh(geo, memberMaterial);
      scene.add(mesh);
      cluster.push({
        mesh,
        radius: 1.55 + (i % 3) * 0.18,
        speed: 0.18 + i * 0.04,
        phase: (i * Math.PI * 2) / memberCount,
        yAmp: 0.45 + (i % 2) * 0.18,
        rotX: 0.32 + i * 0.07,
        rotY: 0.22 + i * 0.05,
      });
    }
  }

  // Key + rim lights add directional highlights on top of the env reflections.
  const keyLight = new THREE.DirectionalLight(0xfff5d6, 1.2);
  keyLight.position.set(2, 2.5, 3);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xa8c0ff, 0.55);
  rimLight.position.set(-2, -0.5, -2);
  scene.add(rimLight);

  const fillLight = new THREE.AmbientLight(0xc9a84c, 0.18);
  scene.add(fillLight);

  // ── Interaction state ─────────────────────────────────────
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouseCurrent = new THREE.Vector2(0, 0);
  let scrollT = 0;

  if (HAS_FINE_POINTER) {
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseTarget.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
      },
      { passive: true }
    );
  }

  function onScroll(): void {
    const docH =
      document.documentElement.scrollHeight - window.innerHeight;
    scrollT = docH > 0 ? Math.min(1, window.scrollY / docH) : 0;
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // ── Resize ───────────────────────────────────────────────
  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // ── Animate ──────────────────────────────────────────────
  const startTime = performance.now();
  let raf = 0;

  let lastTime = performance.now();
  function animate(): void {
    raf = requestAnimationFrame(animate);
    if (document.hidden) return;

    const now = performance.now();
    const t = (now - startTime) / 1000;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Slow Y-rotation (~35s per full revolution at 60fps).
    crystal.rotation.y += 0.003;

    // Float — sine-driven Y-position bob.
    crystal.position.y = Math.sin(t * 0.4) * 0.05;

    // Mouse-influenced X/Z rotation (LERP-smoothed for non-jitter feel).
    // On touch devices mouseTarget stays at (0,0), so this is a no-op.
    mouseCurrent.lerp(mouseTarget, 0.045);
    crystal.rotation.x = mouseCurrent.y * 0.32;
    crystal.rotation.z = mouseCurrent.x * 0.18;

    // Scroll-driven shrink: full size at top of page, 0.85 by bottom.
    const scale = 1.0 - scrollT * 0.15;
    crystal.scale.setScalar(scale);

    // Cluster: each member orbits on its own incommensurable trajectory
    // and self-rotates on multiple axes. Frame-rate-independent (uses dt).
    for (const m of cluster) {
      m.mesh.position.x = Math.cos(t * m.speed + m.phase) * m.radius;
      m.mesh.position.y = Math.sin(t * m.speed * 0.7 + m.phase) * m.yAmp;
      m.mesh.position.z = Math.sin(t * m.speed * 1.1 + m.phase) * 0.42;
      m.mesh.rotation.x += dt * m.rotX;
      m.mesh.rotation.y += dt * m.rotY;
    }

    renderer.render(scene, camera);
  }

  if (PREFERS_REDUCED_MOTION) {
    // Render exactly one frame and stop.
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(animate);
  }

  // ── Disposal ─────────────────────────────────────────────
  return function dispose(): void {
    cancelAnimationFrame(raf);
    geometry.dispose();
    material.dispose();
    for (const m of cluster) {
      m.mesh.geometry.dispose();
    }
    pmrem.dispose();
    renderer.dispose();
  };
}

// Cheap deterministic pseudo-random by index — for vertex displacement
// reproducibility across re-mounts.
function pseudoRandom(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}
