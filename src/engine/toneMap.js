// Normalized RGB tone vectors matching Proxima's calibrated pastel surfaces (src/lib/noteColors.js)
// Used by the fullscreen WebGL flood shader and seamless section backgrounds.

export const TONE_RGB_MAP = {
  default: {
    dark: [0.055, 0.055, 0.068],
    light: [0.968, 0.965, 0.955],
    darkHex: "#151518",
    lightHex: "#f4f3ef",
  },
  peach: {
    dark: [0.184, 0.098, 0.102],
    light: [0.996, 0.918, 0.902],
    darkHex: "#2f191a",
    lightHex: "#feeae6",
  },
  sand: {
    dark: [0.173, 0.125, 0.047],
    light: [0.996, 0.953, 0.839],
    darkHex: "#2c200c",
    lightHex: "#fef3d6",
  },
  mint: {
    dark: [0.078, 0.149, 0.106],
    light: [0.902, 0.957, 0.918],
    darkHex: "#14261b",
    lightHex: "#e6f4ea",
  },
  sky: {
    dark: [0.082, 0.141, 0.216],
    light: [0.910, 0.941, 0.996],
    darkHex: "#152437",
    lightHex: "#e8f0fe",
  },
  lavender: {
    dark: [0.141, 0.086, 0.204],
    light: [0.953, 0.910, 0.992],
    darkHex: "#241634",
    lightHex: "#f3e8fd",
  },
  rose: {
    dark: [0.176, 0.078, 0.129],
    light: [0.988, 0.910, 0.953],
    darkHex: "#2d1421",
    lightHex: "#fce8f3",
  },
  teal: {
    dark: [0.071, 0.153, 0.137],
    light: [0.878, 0.961, 0.933],
    darkHex: "#122723",
    lightHex: "#e0f5ee",
  },
  clay: {
    dark: [0.141, 0.125, 0.110],
    light: [0.945, 0.929, 0.906],
    darkHex: "#24201c",
    lightHex: "#f1ede7",
  },
};

export function getToneRgb(id, isDark) {
  const entry = TONE_RGB_MAP[id] || TONE_RGB_MAP.default;
  return isDark ? entry.dark : entry.light;
}
