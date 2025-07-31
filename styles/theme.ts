"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Space Grotesk, sans-serif",
  headings: {
    fontFamily: "Space Grotesk, sans-serif",
  },
  colors: {
    // "beer" as the primary brand palette (golden yellow to amber)
    beer: [
      "#fdf9ea", // lightest for backgrounds, etc.
      "#fcf0c6", // cream/foam
      "#fce6a1", // foam highlight
      "#f4d27c", // mid gold
      "#F4B731", // your main golden yellow (brand color!)
      "#D68A1D", // amber
      "#b77d19", // deeper amber
      "#9b6717", // even deeper
      "#7f5214", // brown shadow
      "#2C2520", // darkest for contrast, outline, etc.
    ],
    // Oil platform/dark accent palette
    platform: [
      "#edeceb", // light metallic
      "#d7d5d2",
      "#b5b2ad",
      "#97928a",
      "#7c756a",
      "#655e53",
      "#4A403A", // metallic gray
      "#3b322b",
      "#2C2520", // dark brown/charcoal
      "#1a1613", // almost black
    ],
  },
  primaryColor: "beer",
  defaultRadius: "md",
  primaryShade: 4, // index of #F4B731 in beer array
  defaultGradient: { from: "beer.4", to: "beer.5", deg: 90 },
});
