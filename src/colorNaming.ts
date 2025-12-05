// colorNaming.ts
// ------------------------------------------------------------
// Deterministic color naming system.
// Generates expressive names like "Smokey Azure", "Bright Mint", etc.
// ------------------------------------------------------------

import { HexColor, HSL } from "./types";
import { hexToRgb, rgbToHsl } from "./colorConversions";

export interface ColorClassification {
  fullName: string;      
  tokenName: string;     
  tone: string;          
  hueGroup: string;      
  hsl: HSL;
}

// ------------------------------------------------------------
// Hue → Color family mapping with subnames
// ------------------------------------------------------------

function getHueName(h: number, s: number): string {
  if (s < 8) return "Neutral";

  const norm = (v: number) => (v + 360) % 360;
  h = norm(h);

  const choose = (h: number, a: number, b: number, names: string[]): string => {
    const pos = (h - a) / (b - a);
    const idx = Math.min(names.length - 1, Math.floor(pos * names.length));
    return names[idx] ?? names[0] ?? "Gray";
  };

  if (h < 15) return choose(h, 0, 15, ["Scarlet", "Red", "Crimson"]);
  if (h < 35) return choose(h, 15, 35, ["Tangerine", "Orange"]);
  if (h < 50) return choose(h, 35, 50, ["Amber", "Honey"]);
  if (h < 70) return choose(h, 50, 70, ["Lemon", "Yellow", "Gold"]);
  if (h < 85) return choose(h, 70, 85, ["Lime", "Chartreuse"]);
  if (h < 155) return choose(h, 85, 155, ["Mint", "Green", "Emerald"]);
  if (h < 180) return choose(h, 155, 180, ["Teal", "Aqua"]);
  if (h < 200) return choose(h, 180, 200, ["Cyan", "Sky"]);
  if (h < 240) return choose(h, 200, 240, ["Azure", "Blue", "Cobalt"]);
  if (h < 270) return "Indigo";
  if (h < 295) return choose(h, 270, 295, ["Violet", "Lavender"]);
  if (h < 320) return choose(h, 295, 320, ["Purple", "Grape"]);
  if (h < 335) return choose(h, 320, 335, ["Magenta", "Fuchsia"]);
  if (h < 350) return choose(h, 335, 350, ["Rose", "Cerise", "Rosewood"]);

  return choose(h, 350, 360, ["Scarlet", "Red", "Crimson"]);
}

// ------------------------------------------------------------
// Tone vocabulary with interchangeable adjectives
// ------------------------------------------------------------

const toneBuckets = {
  veryLight: ["Pale", "Washed", "Faint"],
  lightSoft: ["Soft", "Subdued"],
  light: ["Light", "Gentle"],
  bright: ["Bright", "Lively"],
  muted: ["Muted", "Hazy", "Smokey"],
  medium: ["Medium", "Balanced"],
  vivid: ["Vivid", "Strong"],
  dim: ["Dim", "Muddy", "Dirty"],
  dark: ["Dark"],
  rich: ["Rich", "Intense"],
  charcoal: ["Charcoal", "Dusky"],
  deep: ["Deep"],
  inky: ["Inky"]
};

// ------------------------------------------------------------
// Deterministic adjective selector
// ------------------------------------------------------------

function deterministicPick(list: string[], h: number, s: number, l: number): string {
  const seed = Math.floor((h * 7 + s * 5 + l * 3) % list.length);
  return list[seed] ?? list[0] ?? "Medium";
}

// ------------------------------------------------------------
// Tone selector → maps HSL ranges → tone buckets
// ------------------------------------------------------------

function getToneName(s: number, l: number, h: number): string {
  if (l > 85) return deterministicPick(toneBuckets.veryLight, h, s, l);

  if (l > 65) {
    if (s < 30) return deterministicPick(toneBuckets.lightSoft, h, s, l);
    if (s < 60) return deterministicPick(toneBuckets.light, h, s, l);
    return deterministicPick(toneBuckets.bright, h, s, l);
  }

  if (l > 35) {
    if (s < 30) return deterministicPick(toneBuckets.muted, h, s, l);
    if (s < 60) return deterministicPick(toneBuckets.medium, h, s, l);
    return deterministicPick(toneBuckets.vivid, h, s, l);
  }

  if (l > 25) {
    if (s < 30) return deterministicPick(toneBuckets.dim, h, s, l);
    if (s < 70) return deterministicPick(toneBuckets.dark, h, s, l);
    return deterministicPick(toneBuckets.rich, h, s, l);
  }

  if (s < 30) return deterministicPick(toneBuckets.charcoal, h, s, l);
  if (s < 70) return deterministicPick(toneBuckets.deep, h, s, l);
  return deterministicPick(toneBuckets.inky, h, s, l);
}

// ------------------------------------------------------------
// Full classification pipeline
// ------------------------------------------------------------

/**
 * Classify a hex color and generate a descriptive name.
 * @param hex - Hex color string to classify
 * @returns ColorClassification with name, tone, hue group, and HSL values
 */
export function classifyHexColor(hex: HexColor): ColorClassification {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const hueGroup = getHueName(hsl.h, hsl.s);
  const tone = getToneName(hsl.s, hsl.l, hsl.h);

  const fullName =
    hueGroup === "Neutral" ? `${tone} Neutral` : `${tone} ${hueGroup}`;

  const tokenName = fullName
    .replace(/[\s-]+/g, "")
    .replace(/^./, (c) => c.toLowerCase());

  return { fullName, tokenName, tone, hueGroup, hsl };
}
