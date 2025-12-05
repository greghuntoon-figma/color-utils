# Color Utils

A comprehensive TypeScript library for color conversions, palette generation, intelligent color naming, and advanced interpolation. Zero dependencies, fully typed, and ready to use.

## Features

- 🎨 **Color Conversions**: Convert between HEX, RGB, HSL, and HSV color spaces
- 🎯 **Smart Validation**: Supports both 3-character (`#RGB`) and 6-character (`#RRGGBB`) hex codes with validation
- 🌈 **Palette Generation**: Create beautiful 10-step color palettes with WCAG contrast ratios
- 📛 **Intelligent Naming**: Generate descriptive color names like "Bright Azure" or "Smokey Rose"
- 🔄 **Barycentric Interpolation**: Advanced color blending for triangular color pickers
- 🎲 **Random Colors**: Generate pleasant random colors perfect for UI themes
- ♿ **Accessibility**: Built-in WCAG contrast calculations for AA/AAA compliance
- 📦 **Zero Dependencies**: Lightweight and self-contained
- 🔷 **Fully Typed**: Complete TypeScript support with exported types

## Installation

```bash
npm install color-utils
```

## Quick Start

```typescript
import {
  hexToRgb,
  rgbToHsl,
  generateColorPalette,
  classifyHexColor,
  generateRandomColor
} from 'color-utils';

// Convert colors
const rgb = hexToRgb('#FF5733');  // { r: 255, g: 87, b: 51 }
const hsl = rgbToHsl(255, 87, 51); // { h: 11, s: 100, l: 60 }

// Generate a palette
const palette = generateColorPalette('#3B82F6');
console.log(palette.name);        // "Bright Blue"
console.log(palette.steps.length); // 10 color steps

// Classify and name colors
const classification = classifyHexColor('#FF6B9D');
console.log(classification.fullName);  // "Bright Rose"
console.log(classification.tokenName); // "brightRose"
console.log(classification.tone);      // "Bright"
console.log(classification.hueGroup);  // "Rose"

// Generate random colors
const randomColor = generateRandomColor(); // e.g., "#7BC4A8"
```

## API Reference

### Type Definitions

```typescript
interface RGB {
  r: number;  // 0-255
  g: number;  // 0-255
  b: number;  // 0-255
}

interface HSL {
  h: number;  // 0-360 degrees
  s: number;  // 0-100 percent
  l: number;  // 0-100 percent
}

interface HSV {
  h: number;  // 0-360 degrees
  s: number;  // 0-100 percent
  v: number;  // 0-100 percent
}

type HexColor = string; // "#RGB" or "#RRGGBB"
```

### Color Conversions

#### `hexToRgb(hex: HexColor): RGB`
Convert hex color to RGB. Supports both 3 and 6 character formats.

```typescript
hexToRgb('#FF5733');  // { r: 255, g: 87, b: 51 }
hexToRgb('#F53');     // { r: 255, g: 85, b: 51 }
hexToRgb('FF5733');   // Works without # prefix
```

#### `rgbToHex(r: number, g: number, b: number): HexColor`
Convert RGB to hex color. Values are automatically clamped to 0-255.

```typescript
rgbToHex(255, 87, 51);  // "#FF5733"
```

#### `rgbToHsl(r: number, g: number, b: number): HSL`
Convert RGB to HSL color space.

```typescript
rgbToHsl(255, 87, 51);  // { h: 11, s: 100, l: 60 }
```

#### `hslToRgb(h: number, s: number, l: number): RGB`
Convert HSL to RGB color space.

```typescript
hslToRgb(11, 100, 60);  // { r: 255, g: 87, b: 51 }
```

#### `rgbToHsv(r: number, g: number, b: number): HSV`
Convert RGB to HSV color space.

```typescript
rgbToHsv(255, 87, 51);  // { h: 11, s: 80, v: 100 }
```

#### `hsvToRgb(h: number, s: number, v: number): RGB`
Convert HSV to RGB color space.

```typescript
hsvToRgb(11, 80, 100);  // { r: 255, g: 87, b: 51 }
```

#### Convenience Functions
- `hexToHsl(hex: HexColor): HSL`
- `hslToHex(h: number, s: number, l: number): HexColor`
- `hexToHsv(hex: HexColor): HSV`
- `hsvToHex(h: number, s: number, v: number): HexColor`

### Color Naming

#### `classifyHexColor(hex: HexColor): ColorClassification`
Generate intelligent, descriptive names for any color.

```typescript
interface ColorClassification {
  fullName: string;    // "Bright Azure"
  tokenName: string;   // "brightAzure" (camelCase for CSS variables)
  tone: string;        // "Bright"
  hueGroup: string;    // "Azure"
  hsl: HSL;           // Color in HSL format
}

const result = classifyHexColor('#3B82F6');
console.log(result.fullName);   // "Bright Blue"
console.log(result.tokenName);  // "brightBlue"
```

**Supported Hues**: Red, Scarlet, Crimson, Orange, Tangerine, Amber, Honey, Yellow, Gold, Lemon, Lime, Chartreuse, Green, Mint, Emerald, Teal, Aqua, Cyan, Sky, Blue, Azure, Cobalt, Indigo, Violet, Lavender, Purple, Grape, Magenta, Fuchsia, Rose, Cerise, Rosewood, Neutral

**Supported Tones**: Pale, Washed, Faint, Soft, Subdued, Light, Gentle, Bright, Lively, Muted, Hazy, Smokey, Medium, Balanced, Vivid, Strong, Dim, Muddy, Dirty, Dark, Rich, Intense, Charcoal, Dusky, Deep, Inky

### Palette Generation

#### `generateColorPalette(hex: HexColor): ColorPalette`
Generate a 10-step color palette with WCAG contrast ratios.

```typescript
interface ColorStep {
  step: number;           // 50, 100, 200, ..., 900
  hex: HexColor;          // Color value
  contrastWhite: number;  // Contrast ratio vs white
  contrastDark: number;   // Contrast ratio vs #0A0A0A
  wcagWhite: "AAA" | "AA" | "Fail";
  wcagDark: "AAA" | "AA" | "Fail";
  isChosenColor: boolean; // True for the input color
}

interface ColorPalette {
  name: string;               // "Bright Blue"
  tokenName: string;          // "brightBlue"
  chosenStep: number;         // Which step the input color is closest to
  steps: ColorStep[];         // Array of 10 color steps
  classification: ColorClassification;
}

const palette = generateColorPalette('#3B82F6');

// Access specific shades
palette.steps[0].hex;  // Lightest shade (50)
palette.steps[9].hex;  // Darkest shade (900)

// Check accessibility
palette.steps[5].wcagWhite;  // "AA" or "AAA" or "Fail"
palette.steps[5].contrastWhite;  // 4.5 (numeric ratio)
```

### Color Interpolation

#### `barycentricInterpolation(...): HexColor`
Advanced interpolation for triangular color pickers.

```typescript
const color = barycentricInterpolation(
  { x: 50, y: 50 },  // Point to interpolate
  { x: 0, y: 0, color: '#FF0000' },    // Vertex A (red)
  { x: 100, y: 0, color: '#00FF00' },  // Vertex B (green)
  { x: 50, y: 100, color: '#0000FF' }  // Vertex C (blue)
);
// Returns blended color based on position
```

### Random Color Generation

#### `generateRandomColor(): HexColor`
Generate pleasant random colors with constrained saturation and lightness.

```typescript
const color1 = generateRandomColor();  // e.g., "#7BC4A8"
const color2 = generateRandomColor();  // e.g., "#C47B9E"
```

## Examples

### Building a Theme

```typescript
import { generateColorPalette, generateRandomColor } from 'color-utils';

// Generate a complete theme from a brand color
const primaryPalette = generateColorPalette('#3B82F6');
const accentPalette = generateColorPalette('#F59E0B');

const theme = {
  primary: {
    50: primaryPalette.steps[0].hex,
    100: primaryPalette.steps[1].hex,
    // ... etc
    900: primaryPalette.steps[9].hex,
  },
  accent: {
    50: accentPalette.steps[0].hex,
    // ... etc
  }
};

// Export CSS variables
console.log(`--color-primary-500: ${primaryPalette.steps[4].hex};`);
```

### Accessible Color Pairs

```typescript
import { generateColorPalette } from 'color-utils';

const palette = generateColorPalette('#3B82F6');

// Find colors that meet WCAG AA for white text
const accessibleForWhiteText = palette.steps
  .filter(step => step.wcagWhite === 'AA' || step.wcagWhite === 'AAA')
  .map(step => step.hex);

console.log(accessibleForWhiteText);
// ["#1E3A8A", "#1E40AF", "#1D4ED8", "#2563EB"]
```

### Dynamic Color Names

```typescript
import { classifyHexColor } from 'color-utils';

function generateCSSVariables(colors: Record<string, string>) {
  return Object.entries(colors)
    .map(([key, hex]) => {
      const { tokenName } = classifyHexColor(hex);
      return `--${key}-${tokenName}: ${hex};`;
    })
    .join('\n');
}

const css = generateCSSVariables({
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#F59E0B'
});

console.log(css);
// --primary-brightBlue: #3B82F6;
// --secondary-brightViolet: #8B5CF6;
// --accent-brightOrange: #F59E0B;
```

## Development

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Build
npm run build

# Watch mode
npm run watch

# Clean build output
npm run clean
```

## Project Structure

```
color-utils/
├── src/
│   ├── types.ts              # Shared TypeScript types
│   ├── colorConversions.ts   # Color space conversions
│   ├── colorNaming.ts        # Intelligent color naming
│   ├── colorPalette.ts       # Palette generation & WCAG
│   ├── colorInterpolation.ts # Barycentric interpolation
│   ├── colorRandom.ts        # Random color generation
│   └── index.ts              # Main export file
├── dist/                     # Compiled JavaScript + types
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! This is a well-structured, typed codebase with clear separation of concerns. Each module focuses on a specific aspect of color manipulation.

## License

MIT

## Related Projects

Looking for more features? Consider adding:
- Color harmony generation (complementary, triadic, analogous)
- Color manipulation (lighten, darken, saturate)
- LAB/LCH color space support
- Delta E color difference calculations
- Color blindness simulation
- APCA contrast (modern alternative to WCAG)
- Alpha channel support (RGBA, HSLA)

---

Made with care for developers who love colors 🎨

