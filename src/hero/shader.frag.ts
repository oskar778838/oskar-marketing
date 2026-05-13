export const AURORA_FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseLag;        // 1.5s-lagged mouse — creates trail glow
uniform vec2 uResolution;
uniform float uScrollT;        // 0..1 page-scroll progress
uniform float uScrollPulse;    // 0..1 short pulse on scroll events
uniform float uSectionMix;     // 0..1 per-section visibility multiplier
uniform vec2 uHotspot1;        // 0..1 normalised, slowly drifts
uniform vec2 uHotspot2;        // 0..1 normalised, slowly drifts

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 stAspect = vec2(st.x * aspect, st.y);

  vec2 mouse = uMouse / uResolution.xy;
  vec2 mouseAspect = vec2(mouse.x * aspect, mouse.y);
  float mouseDist = length(stAspect - mouseAspect);
  float mouseInfluence = smoothstep(0.6, 0.0, mouseDist) * 0.32;

  // Trailing mouse — lagged ghost that creates a "where mouse was" glow.
  // Decay handled JS-side by lerp rate; shader just samples the position.
  vec2 mouseLag = uMouseLag / uResolution.xy;
  vec2 mouseLagAspect = vec2(mouseLag.x * aspect, mouseLag.y);
  float trailInfluence = smoothstep(0.55, 0.0, length(stAspect - mouseLagAspect)) * 0.16;

  // Time scaled by scroll-pulse: short bursts speed up the flow on scroll.
  float t = uTime * (0.05 + uScrollPulse * 0.18);

  // Layer 1 — slow primary drift, SW → NE (positive x, negative y in screen-space).
  vec2 flow1 = vec2(stAspect.x + t * 0.6, stAspect.y - t * 0.45);
  float n1 = fbm(flow1 * 1.3);

  // Layer 2 — slower counter-flow for organic complexity.
  vec2 flow2 = vec2(stAspect.x - t * 0.32, stAspect.y + t * 0.22);
  float n2 = fbm(flow2 * 2.4);

  // Layer 3 — high-frequency pulse layer that breathes on uTime alone.
  vec2 flow3 = stAspect * 4.0 + vec2(0.0, sin(uTime * 0.3) * 0.4);
  float n3 = fbm(flow3) * 0.5 + 0.5;
  float pulse = (sin(uTime * 0.45) * 0.5 + 0.5) * n3;

  float aurora = n1 * 0.55 + n2 * 0.30 + pulse * 0.15 + mouseInfluence + trailInfluence;
  aurora = smoothstep(-0.25, 0.85, aurora);

  // Hot-spots: two slowly drifting points that double the local intensity.
  vec2 h1 = vec2(uHotspot1.x * aspect, uHotspot1.y);
  vec2 h2 = vec2(uHotspot2.x * aspect, uHotspot2.y);
  float hot1 = smoothstep(0.55, 0.0, length(stAspect - h1));
  float hot2 = smoothstep(0.50, 0.0, length(stAspect - h2));
  float hotMask = hot1 * 0.55 + hot2 * 0.40;

  // Color stops - obsidian + 3 gold tones.
  vec3 base = vec3(0.020, 0.020, 0.020);
  vec3 goldDark  = vec3(0.788, 0.659, 0.298);  // #C9A84C
  vec3 goldLight = vec3(0.910, 0.788, 0.416);  // #E8C96A
  vec3 goldPale  = vec3(0.961, 0.902, 0.722);  // #F5E6B8

  // Reduced base multipliers — quieter aurora, text stays readable.
  vec3 color = base;
  color = mix(color, goldDark,  aurora * 0.35);
  color = mix(color, goldLight, pow(aurora, 2.5) * 0.22);
  color = mix(color, goldPale,  pow(aurora, 6.0) * 0.12);

  // Hot-spot tint: amplifies the gold-light + gold-pale stops where masks hit.
  color = mix(color, goldLight, hotMask * pow(aurora, 1.5) * 0.30);
  color = mix(color, goldPale,  hotMask * pow(aurora, 4.0) * 0.18);

  // Subtle vignette.
  vec2 vigUV = st - 0.5;
  float vignette = 1.0 - dot(vigUV, vigUV) * 0.8;
  color *= vignette;

  // Below 50vh of page-scroll, fade aurora out so it doesn't compete with
  // section content. uScrollT goes 0..1 over the document.
  float scrollFade = 1.0 - smoothstep(0.05, 0.45, uScrollT) * 0.40;
  color *= scrollFade;

  // Per-section intensity multiplier — JS dials this 0.3..0.7..1.0 based
  // on which section the user is currently viewing. Lets content sections
  // "breathe" without aurora competing for attention.
  color *= mix(0.4, 1.0, uSectionMix);

  gl_FragColor = vec4(color, 1.0);
}
`;

export const VERTEX_SHADER = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
