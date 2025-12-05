// types.ts
// ------------------------------------------------------------
// Shared type definitions for color utilities.
// ------------------------------------------------------------

/**
 * RGB color representation with values in range 0-255.
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL color representation.
 * - h (hue): 0-360 degrees
 * - s (saturation): 0-100 percent
 * - l (lightness): 0-100 percent
 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * HSV color representation.
 * - h (hue): 0-360 degrees
 * - s (saturation): 0-100 percent
 * - v (value): 0-100 percent
 */
export interface HSV {
  h: number;
  s: number;
  v: number;
}

/**
 * Hex color string type (e.g., "#FF5733" or "#F53")
 * Should start with # and contain 3 or 6 hexadecimal characters.
 */
export type HexColor = string;

