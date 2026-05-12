export const AURORA_FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

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
  float mouseInfluence = smoothstep(0.6, 0.0, mouseDist) * 0.4;

  // Aurora flow - multiple layers
  float t = uTime * 0.08;

  vec2 flow1 = vec2(stAspect.x + t * 0.3, stAspect.y - t * 0.2);
  float n1 = fbm(flow1 * 1.5);

  vec2 flow2 = vec2(stAspect.x - t * 0.2, stAspect.y + t * 0.15);
  float n2 = fbm(flow2 * 3.0);

  float aurora = n1 * 0.6 + n2 * 0.4 + mouseInfluence;
  aurora = smoothstep(-0.3, 0.8, aurora);

  // Color stops - obsidian + 3 gold tones
  vec3 base = vec3(0.020, 0.020, 0.020);
  vec3 goldDark = vec3(0.788, 0.659, 0.298);   // #C9A84C
  vec3 goldLight = vec3(0.910, 0.788, 0.416);  // #E8C96A
  vec3 goldPale = vec3(0.961, 0.902, 0.722);   // #F5E6B8

  // CRITICAL: these multipliers control visibility. Keep them high enough.
  vec3 color = base;
  color = mix(color, goldDark, aurora * 0.55);
  color = mix(color, goldLight, pow(aurora, 2.5) * 0.35);
  color = mix(color, goldPale, pow(aurora, 6.0) * 0.18);

  // Subtle vignette
  vec2 vigUV = st - 0.5;
  float vignette = 1.0 - dot(vigUV, vigUV) * 0.8;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

export const VERTEX_SHADER = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
