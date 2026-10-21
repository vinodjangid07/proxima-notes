export const NOTE_COLORS = {
  default: {
    id: "default",
    name: "Default",
    swatchClass: "bg-[#f4f4f6] dark:bg-[#25252b]",
    cardBg: "bg-[#f8f8fa] dark:bg-[#151518] hover:bg-[#f0f0f3] dark:hover:bg-[#1c1c22]",
    modalBg: "bg-white dark:bg-[#121215]"
  },
  peach: {
    id: "peach",
    name: "Coral Peach",
    swatchClass: "bg-[#ffd9d4] dark:bg-[#4d2424]",
    cardBg: "bg-[#feeae6] dark:bg-[#2f191a] hover:bg-[#fedbd5] dark:hover:bg-[#381e1f]",
    modalBg: "bg-[#fdf2f0] dark:bg-[#261415]"
  },
  sand: {
    id: "sand",
    name: "Warm Honey",
    swatchClass: "bg-[#ffe8a3] dark:bg-[#483311]",
    cardBg: "bg-[#fef3d6] dark:bg-[#2c200c] hover:bg-[#fdebbd] dark:hover:bg-[#36270f]",
    modalBg: "bg-[#fef8e7] dark:bg-[#231a09]"
  },
  mint: {
    id: "mint",
    name: "Sage Mint",
    swatchClass: "bg-[#c8ebd3] dark:bg-[#1c3f2b]",
    cardBg: "bg-[#e6f4ea] dark:bg-[#14261b] hover:bg-[#d8eedd] dark:hover:bg-[#1a3022]",
    modalBg: "bg-[#f0f8f2] dark:bg-[#101e16]"
  },
  sky: {
    id: "sky",
    name: "Sky Blue",
    swatchClass: "bg-[#cde4fe] dark:bg-[#1f3756]",
    cardBg: "bg-[#e8f0fe] dark:bg-[#152437] hover:bg-[#d8e7fe] dark:hover:bg-[#1b2d45]",
    modalBg: "bg-[#f1f6ff] dark:bg-[#111c2b]"
  },
  lavender: {
    id: "lavender",
    name: "Iris Lavender",
    swatchClass: "bg-[#e3d1fc] dark:bg-[#392254]",
    cardBg: "bg-[#f3e8fd] dark:bg-[#241634] hover:bg-[#ebd8fc] dark:hover:bg-[#2c1b40]",
    modalBg: "bg-[#f8f1fe] dark:bg-[#1d122a]"
  },
  rose: {
    id: "rose",
    name: "Blush Rose",
    swatchClass: "bg-[#fad0e4] dark:bg-[#4a1e35]",
    cardBg: "bg-[#fce8f3] dark:bg-[#2d1421] hover:bg-[#fad8ec] dark:hover:bg-[#371929]",
    modalBg: "bg-[#fdf2f8] dark:bg-[#24101a]"
  },
  teal: {
    id: "teal",
    name: "Fresh Teal",
    swatchClass: "bg-[#bfeedf] dark:bg-[#173d36]",
    cardBg: "bg-[#e0f5ee] dark:bg-[#122723] hover:bg-[#d0efe4] dark:hover:bg-[#17322d]",
    modalBg: "bg-[#ecf9f4] dark:bg-[#0e201c]"
  },
  clay: {
    id: "clay",
    name: "Warm Clay",
    swatchClass: "bg-[#e4ddd4] dark:bg-[#38312b]",
    cardBg: "bg-[#f1ede7] dark:bg-[#24201c] hover:bg-[#e8e2d9] dark:hover:bg-[#2c2722]",
    modalBg: "bg-[#f8f5f1] dark:bg-[#1d1a16]"
  }
};

export const NOTE_COLOR_LIST = Object.values(NOTE_COLORS);

export const getNoteColor = (colorId) => {
  return NOTE_COLORS[colorId] || NOTE_COLORS.default;
};
