export const fullscreenVertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const floodBackgroundFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform float uVelocity;
uniform float uDark;
uniform float uToneMix;
uniform vec3 uTone;
uniform vec2 uMouse;
uniform vec2 uResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amp * noise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 st = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  vec2 focus = vec2(
    (uMouse.x - 0.5) * 0.42 * aspect + sin(uTime * 0.14) * 0.08,
    (uMouse.y - 0.5) * 0.35 + 0.18 - uScroll * 0.28 + cos(uTime * 0.11) * 0.05
  );

  vec2 delta = st - focus;
  float dist = length(delta);

  float vel = clamp(abs(uVelocity) * 0.015, 0.0, 0.45);
  float field = fbm(st * 1.45 + vec2(uTime * 0.045, -uScroll * 0.55 + uTime * 0.03));

  float spikeX = exp(-abs(delta.y + (field - 0.5) * 0.08) * 14.0) * exp(-dist * 2.1);
  float spikeY = exp(-abs(delta.x + (field - 0.5) * 0.08) * 14.0) * exp(-dist * 2.1);
  float aura = smoothstep(0.95, 0.0, dist) * (0.55 + 0.45 * field);

  vec3 darkBase = vec3(0.035, 0.035, 0.043);
  vec3 darkGlow = vec3(0.082, 0.106, 0.148);
  vec3 darkWarm = vec3(0.115, 0.095, 0.075);

  vec3 lightBase = vec3(0.980, 0.976, 0.965);
  vec3 lightGlow = vec3(0.922, 0.945, 0.976);
  vec3 lightWarm = vec3(0.972, 0.955, 0.925);

  vec3 base = mix(lightBase, darkBase, uDark);
  vec3 glow = mix(lightGlow, darkGlow, uDark);
  vec3 warm = mix(lightWarm, darkWarm, uDark);

  float lightMix = clamp(aura * 0.65 + vel * 0.18, 0.0, 1.0);
  vec3 col = mix(base, glow, lightMix * mix(0.85, 0.72, uDark));
  col = mix(col, warm, clamp((spikeX + spikeY) * 0.35 + field * 0.08, 0.0, 0.55));

  vec3 floodTarget = mix(uTone, uTone * 0.92, 1.0 - aura * 0.5);
  col = mix(col, floodTarget, clamp(uToneMix, 0.0, 1.0));

  float grain = (hash(uv * uResolution + fract(uTime * 1.3)) - 0.5) * mix(0.016, 0.022, uDark);
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`;
