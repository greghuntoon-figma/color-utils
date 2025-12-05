// colorRandom.ts
// ------------------------------------------------------------
// Generates pleasant random colors.
// Useful for seeding UI themes or generating test palettes.
// ------------------------------------------------------------

import { HexColor } from "./types";
import { rgbToHex } from "./colorConversions";

/**
 * Generate a pleasant random color using HSL sampling.
 * Colors are constrained to have moderate saturation and lightness
 * to avoid overly bright or dull colors.
 * @returns Random hex color string
 */
export function generateRandomColor(): HexColor {
  const h = Math.random() * 360;
  const s = 30 + Math.random() * 40; // 30–70%
  const l = 50 + Math.random() * 30; // 50–80%

  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
  const m = light - c / 2;

  let r = 0, g = 0, b = 0;

  if (hue < 1/6) { r = c; g = x; b = 0; }
  else if (hue < 2/6) { r = x; g = c; b = 0; }
  else if (hue < 3/6) { r = 0; g = c; b = x; }
  else if (hue < 4/6) { r = 0; g = x; b = c; }
  else if (hue < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
