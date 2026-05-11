// Hero WebGL background — fullscreen plane with a custom fragment shader.
// Gold mesh-noise on obsidian, mouse position warps the displacement.
// Loaded lazily; CSS fallback (.bg-mesh-fallback) renders immediately.

import * as THREE from "three";

const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;     // 0..1
  uniform vec2  uRes;
  uniform float uIntensity; // 0..1, scaled at runtime

  // Cheap simplex-ish noise
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                  dot(p, vec2(269.5, 183.3)),
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash3(i + vec2(0.0, 0.0)).x;
    float b = hash3(i + vec2(1.0, 0.0)).x;
    float c = hash3(i + vec2(0.0, 1.0)).x;
    float d = hash3(i + vec2(1.0, 1.0)).x;
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;
    vec2 p = uv;
    p.x *= aspect;

    // mouse-driven offset: subtle warp
    vec2 m = uMouse;
    m.x *= aspect;
    vec2 d = (p - m) * 0.6;
    float dist = length(d);

    // animated mesh noise field
    float t = uTime * 0.05;
    float n1 = fbm(p * 1.6 + vec2(t, -t * 0.7));
    float n2 = fbm(p * 0.8 - vec2(t * 0.6, t));
    float field = mix(n1, n2, 0.55);

    // mouse warp lifts noise where cursor is
    field += smoothstep(0.55, 0.0, dist) * 0.18 * uIntensity;

    // Gold gradient: deep gold in low areas, warm gold in highs
    vec3 obsidian = vec3(0.020, 0.020, 0.022);
    vec3 goldDeep = vec3(0.35, 0.25, 0.07);
    vec3 goldWarm = vec3(0.91, 0.79, 0.42);

    // Heavy bias toward dark — only crests show gold
    float t1 = smoothstep(0.42, 0.62, field);
    float t2 = smoothstep(0.58, 0.78, field);
    vec3 col = mix(obsidian, goldDeep * 0.55, t1 * 0.5);
    col = mix(col, goldWarm * 0.42, t2 * 0.6);

    // radial vignette + soft center hot
    float vign = 1.0 - smoothstep(0.55, 1.05, length(uv - 0.5));
    col *= 0.55 + 0.45 * vign;

    // tiny grain
    float grain = (hash3(uv * uRes + uTime).x - 0.5) * 0.025;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export interface HeroBackgroundHandle {
  destroy: () => void;
  setIntensity: (v: number) => void;
}

export async function initHeroBackground(
  canvas: HTMLCanvasElement
): Promise<HeroBackgroundHandle | null> {
  // Skip on reduced motion — CSS fallback covers the look.
  if (PREFERS_REDUCED_MOTION) return null;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  const dpr = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms: Record<string, THREE.IUniform> = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uIntensity: { value: 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Reveal canvas only after first valid frame
  canvas.classList.add("is-ready");

  let mouseX = 0.5;
  let mouseY = 0.5;
  let smoothMouseX = 0.5;
  let smoothMouseY = 0.5;
  let intensityTarget = 1.0;

  function onMouseMove(e: PointerEvent): void {
    mouseX = e.clientX / window.innerWidth;
    mouseY = 1 - e.clientY / window.innerHeight;
  }
  window.addEventListener("pointermove", onMouseMove, { passive: true });

  function onResize(): void {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize, { passive: true });

  // Pause when the hero is offscreen
  const heroEl = document.getElementById("hero");
  let visible = true;
  if (heroEl && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    obs.observe(heroEl);
  }

  const start = performance.now();
  let raf = 0;
  function tick(): void {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    const t = (performance.now() - start) / 1000;
    smoothMouseX += (mouseX - smoothMouseX) * 0.05;
    smoothMouseY += (mouseY - smoothMouseY) * 0.05;
    uniforms.uTime.value = t;
    uniforms.uMouse.value.set(smoothMouseX, smoothMouseY);
    // ease intensity in
    uniforms.uIntensity.value +=
      (intensityTarget - uniforms.uIntensity.value) * 0.04;
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);

  return {
    destroy(): void {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
    setIntensity(v: number): void {
      intensityTarget = v;
    },
  };
}
