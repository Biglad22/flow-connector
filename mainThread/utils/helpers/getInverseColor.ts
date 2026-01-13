type RGB = { r: number; g: number; b: number };

function hexToRgb01(hex: string): RGB {
  let h = hex.replace("#", "");

  // handle shorthand #fff
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

function normalizeColor(color?: string | RGB): RGB {
  if (!color) return { r: 0, g: 0, b: 0 };

  // HEX
  if (typeof color === "string") {
    return hexToRgb01(color);
  }

  // RGB 0–255 → 0–1
  if (color.r > 1 || color.g > 1 || color.b > 1) {
    return {
      r: color.r / 255,
      g: color.g / 255,
      b: color.b / 255,
    };
  }

  // already 0–1
  return color;
}

export function invertColor(color?: string | RGB): RGB {
  const c = normalizeColor(color);

  return {
    r: 1 - c.r,
    g: 1 - c.g,
    b: 1 - c.b,
  };
}
