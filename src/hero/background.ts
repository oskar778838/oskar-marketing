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

    // mouse-driven offset: warp
    vec2 m = uMouse;
    m.x *= aspect;
    vec2 d = (p - m) * 0.6;
    float dist = length(d);

    // animated mesh noise field — faster movement, more layers
    float t = uTime * 0.08;
    float n1 = fbm(p * 1.4 + vec2(t, -t * 0.7));
    float n2 = fbm(p * 0.7 - vec2(t * 0.55, t * 0.9));
    float n3 = fbm(p * 2.2 + vec2(-t * 0.4, t * 0.3));
    float field = mix(n1, n2, 0.55) * 0.7 + n3 * 0.3;

    // mouse warp lifts noise where cursor is — stronger now
    field += smoothstep(0.55, 0.0, dist) * 0.32 * uIntensity;

    // Gold gradient stops — bright enough to actually see on a phone
    vec3 obsidian = vec3(0.020, 0.020, 0.024);
    vec3 goldDeep = vec3(0.55, 0.40, 0.12);
    vec3 goldWarm = vec3(0.95, 0.82, 0.44);
    vec3 goldHot  = vec3(0.99, 0.91, 0.55);

    // Three-stop mix — earlier thresholds, less suppression
    float t1 = smoothstep(0.32, 0.55, field);
    float t2 = smoothstep(0.50, 0.72, field);
    float t3 = smoothstep(0.68, 0.86, field);
    vec3 col = mix(obsidian, goldDeep, t1 * 0.85);
    col = mix(col, goldWarm, t2 * 0.65);
    col = mix(col, goldHot,  t3 * 0.45);

    // softer radial vignette — keeps center brighter
    float vign = 1.0 - smoothstep(0.62, 1.15, length(uv - 0.5));
    col *= 0.78 + 0.22 * vign;

    // tiny grain
    float grain = (hash3(uv * uRes + uTime).x - 0.5) * 0.030;
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
    // Start partially-on so the shader is visible before mouse interaction
    // ramps it up — without this the first paint reads as "flat black".
    uIntensity: { value: 0.7 },
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
  // For touch / coarse-pointer devices, slow auto-drift instead of mouse track
  const isTouchDevice = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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

    if (isTouchDevice) {
      // Slow Lissajous drift so the warp keeps moving without a cursor
      mouseX = 0.5 + Math.sin(t * 0.18) * 0.28;
      mouseY = 0.5 + Math.cos(t * 0.13) * 0.22;
    }

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
