// colorPalette.ts
// ------------------------------------------------------------
// Palette generator: builds 10-step tonal ramps + WCAG contrast.
// ------------------------------------------------------------

import { HexColor } from "./types";
import {
  hslToHex,
  hexToRgb,
} from "./colorConversions";

import { classifyHexColor, ColorClassification } from "./colorNaming";
  
// ---------------------------
// WCAG contrast
// ---------------------------

function getLuminanceHex(hex: HexColor) {
    const { r, g, b } = hexToRgb(hex);
  
    const channel = (c: number) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
  
    return (
      0.2126 * channel(r) +
      0.7152 * channel(g) +
      0.0722 * channel(b)
    );
  }
  
function getContrastRatio(a: HexColor, b: HexColor) {
  const lum1 = getLuminanceHex(a);
  const lum2 = getLuminanceHex(b);

  const bright = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);

  return (bright + 0.05) / (dark + 0.05);
}
  
function compliance(r: number): "AAA" | "AA" | "Fail" {
  if (r >= 7) return "AAA";
  if (r >= 4.5) return "AA";
  return "Fail";
}

// ---------------------------
// Types
// ---------------------------

export interface ColorStep {
  step: number;
  hex: HexColor;
  contrastWhite: number;
  contrastDark: number;
  wcagWhite: "AAA" | "AA" | "Fail";
  wcagDark: "AAA" | "AA" | "Fail";
  isChosenColor: boolean;
}
  
export interface ColorPalette {
  name: string;
  tokenName: string;
  chosenStep: number;
  steps: ColorStep[];
  classification: ColorClassification;
}

// ---------------------------
// Palette generator
// ---------------------------

/**
 * Generate a 10-step color palette from a hex color.
 * Includes WCAG contrast ratios for accessibility.
 * @param hex - Base hex color for the palette
 * @returns ColorPalette with 10 shades from light to dark
 */
export function generateColorPalette(hex: HexColor): ColorPalette {
    const classification = classifyHexColor(hex);
    const baseHsl = classification.hsl;
  
  const stepValues = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const lightnessSteps = [95, 90, 80, 65, 50, 40, 30, 20, 12, 8];

  // Pick which step userHex belongs to
  let closestIndex = 0;
  let minDiff = Math.abs(baseHsl.l - (lightnessSteps[0] ?? 50));

  for (let i = 1; i < lightnessSteps.length; i++) {
    const stepLightness = lightnessSteps[i];
    if (stepLightness === undefined) continue;
    
    const diff = Math.abs(baseHsl.l - stepLightness);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  const steps: ColorStep[] = [];

  for (let i = 0; i < stepValues.length; i++) {
    const stepValue = stepValues[i];
    const stepLightness = lightnessSteps[i];
    
    if (stepValue === undefined || stepLightness === undefined) continue;
    
    let stepHex: HexColor;

    if (i === closestIndex) {
      stepHex = hex.toUpperCase(); // exact user color
    } else {
      let s = baseHsl.s;

      if (i < 2) s = s * 0.3; // lighten → desaturate
      if (i > 7) s = Math.min(s * 1.2, 100); // darken → saturate

      stepHex = hslToHex(baseHsl.h, s, stepLightness);
    }

    const contrastWhite = getContrastRatio(stepHex, "#FFFFFF");
    const contrastDark = getContrastRatio(stepHex, "#0A0A0A");

    steps.push({
      step: stepValue,
      hex: stepHex,
      contrastWhite,
      contrastDark,
      wcagWhite: compliance(contrastWhite),
      wcagDark: compliance(contrastDark),
      isChosenColor: i === closestIndex,
    });
  }

  return {
    name: classification.fullName,
    tokenName: classification.tokenName,
    chosenStep: stepValues[closestIndex] ?? 500,
    steps,
    classification,
  };
  }
  