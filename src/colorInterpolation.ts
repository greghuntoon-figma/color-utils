// colorInterpolation.ts
// ------------------------------------------------------------
// Geometry-based color interpolation utilities.
// Includes barycentric interpolation for color triangles.
// ------------------------------------------------------------

import { HexColor } from "./types";
import { hexToRgb, rgbToHex } from "./colorConversions";

/**
 * Barycentric interpolation across a triangle of three colors.
 * Useful for 2D color pickers (triangular gamut) or blending.
 * @param p - Point to interpolate at
 * @param a - First triangle vertex with color
 * @param b - Second triangle vertex with color
 * @param c - Third triangle vertex with color
 * @returns Interpolated hex color
 */
export function barycentricInterpolation(
  p: { x: number; y: number },
  a: { x: number; y: number; color: HexColor },
  b: { x: number; y: number; color: HexColor },
  c: { x: number; y: number; color: HexColor }
): HexColor {
  const v0 = { x: b.x - a.x, y: b.y - a.y };
  const v1 = { x: c.x - a.x, y: c.y - a.y };
  const v2 = { x: p.x - a.x, y: p.y - a.y };

  const dot00 = v0.x * v0.x + v0.y * v0.y;
  const dot01 = v0.x * v1.x + v0.y * v1.y;
  const dot02 = v0.x * v2.x + v0.y * v2.y;
  const dot11 = v1.x * v1.x + v1.y * v1.y;
  const dot12 = v1.x * v2.x + v1.y * v2.y;

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  const w = 1 - u - v;

  // Extract RGB values
  const rgbA = hexToRgb(a.color);
  const rgbB = hexToRgb(b.color);
  const rgbC = hexToRgb(c.color);

  // Weighted blend
  const r = w * rgbA.r + u * rgbB.r + v * rgbC.r;
  const g = w * rgbA.g + u * rgbB.g + v * rgbC.g;
  const bVal = w * rgbA.b + u * rgbB.b + v * rgbC.b;

  return rgbToHex(r, g, bVal);
}
