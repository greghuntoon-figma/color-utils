// colorConversions.ts
// ------------------------------------------------------------
// Low-level color math utilities.
// Pure functions: no naming, no palettes, no color logic.
// These are used everywhere else in the color system.
// ------------------------------------------------------------

import { RGB, HSL, HSV, HexColor } from "./types";

/**
 * Convert HEX → RGB
 * Supports both 3-character (#RGB) and 6-character (#RRGGBB) hex codes.
 * @param hex - Hex color string (with or without #)
 * @returns RGB object with values 0-255
 * @throws Error if hex format is invalid
 */
export function hexToRgb(hex: HexColor): RGB {
  // Remove # if present
  let cleanHex = hex.replace(/^#/, '');
  
  // Expand shorthand format (e.g., "03F" -> "0033FF")
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  // Validate format
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    throw new Error(`Invalid hex color format: "${hex}". Expected format: #RGB or #RRGGBB`);
  }
  
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16),
  };
}
  
/**
 * Convert RGB → HEX
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string in uppercase format (#RRGGBB)
 */
export function rgbToHex(r: number, g: number, b: number): HexColor {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
  
/**
 * Convert RGB → HSV
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns HSV object
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / diff + 2) / 6;
    else h = ((r - g) / diff + 4) / 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}
  
/**
 * Convert HSV → RGB
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param v - Value (0-100 percent)
 * @returns RGB object
 */
export function hsvToRgb(h: number, s: number, v: number): RGB {
  h /= 360; s /= 100; v /= 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0, g = 0, b = 0;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}
  
/**
 * Convert HEX → HSV
 * @param hex - Hex color string
 * @returns HSV object
 */
export function hexToHsv(hex: HexColor): HSV {
  const rgb = hexToRgb(hex);
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
}

/**
 * Convert HSV → HEX
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param v - Value (0-100 percent)
 * @returns Hex color string
 */
export function hsvToHex(h: number, s: number, v: number): HexColor {
  const rgb = hsvToRgb(h, s, v);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
  
/**
 * Convert RGB → HSL
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns HSL object
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    if (max === r) h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / diff + 2) / 6;
    else h = ((r - g) / diff + 4) / 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}
  
/**
 * Convert HSL → RGB
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param l - Lightness (0-100 percent)
 * @returns RGB object
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}
  
/**
 * Convert HEX → HSL
 * @param hex - Hex color string
 * @returns HSL object
 */
export function hexToHsl(hex: HexColor): HSL {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * Convert HSL → HEX
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param l - Lightness (0-100 percent)
 * @returns Hex color string
 */
export function hslToHex(h: number, s: number, l: number): HexColor {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
  