export type RGB = { r: number; g: number; b: number };

// Normalize input to RGB 0–1
function normalizeColor(color?: string | RGB): RGB {
  if (!color) return { r: 0, g: 0, b: 0 };

  if (typeof color === "string") {
    let h = color.replace("#", "");

    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const num = parseInt(h, 16);

    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255,
    };
  }

  if (color.r > 1 || color.g > 1 || color.b > 1) {
    return {
      r: color.r / 255,
      g: color.g / 255,
      b: color.b / 255,
    };
  }

  return color;
}

// ---------- Public API ----------
export function invertColor(color?: string | RGB): RGB {
  const c = normalizeColor(color);

  // treat near-black as black
  const BLACK_THRESHOLD = 0.08;

  const isBlack =
    c.r <= BLACK_THRESHOLD && c.g <= BLACK_THRESHOLD && c.b <= BLACK_THRESHOLD;

  return isBlack
    ? { r: 1, g: 1, b: 1 } // white
    : { r: 0, g: 0, b: 0 }; // black
}
