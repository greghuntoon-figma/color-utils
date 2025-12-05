// index.ts
// ------------------------------------------------------------
// Barrel file that re-exports all color modules.
// Allows users to import from a single entry point:
// import { classifyHexColor, generateColorPalette } from './colorUtils';
// ------------------------------------------------------------

export * from "./types";
export * from "./colorConversions";
export * from "./colorInterpolation";
export * from "./colorNaming";
export * from "./colorPalette";
export * from "./colorRandom";
