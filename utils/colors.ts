export type Theme = "sombre" | "claire" | "nuit";

export type ThemeColors = {
  bg: string;
  surface: string;
  surfaceHigh: string;
  accent: string;
  accentDim: string;
  accentText: string;
  text: string;
  textSub: string;
  textMuted: string;
  border: string;
  borderAccent: string;
  tabBg: string;
  tabBorder: string;
  pillBg: string;
  pillText: string;
  iconActive: string;
  iconInactive: string;
  statusBar: "light-content" | "dark-content";
  overlay: string;
};

const SOMBRE: ThemeColors = {
  bg:           "#020118",
  surface:      "#06033a",
  surfaceHigh:  "#0f056b",
  accent:       "#facc15",
  accentDim:    "rgba(250,204,21,0.08)",
  accentText:   "#020118",
  text:         "#ffffff",
  textSub:      "#b5c6d6",
  textMuted:    "#5a6e90",
  border:       "rgba(255,255,255,0.07)",
  borderAccent: "rgba(250,204,21,0.2)",
  tabBg:        "#070530",
  tabBorder:    "rgba(250,204,21,0.18)",
  pillBg:       "#facc15",
  pillText:     "#0a0630",
  iconActive:   "#0a0630",
  iconInactive: "#4a6080",
  statusBar:    "light-content",
  overlay:      "rgba(2,1,24,0.82)",
};

const CLAIRE: ThemeColors = {
  bg:           "#f0f4fa",
  surface:      "#ffffff",
  surfaceHigh:  "#dce6f0",
  accent:       "#1e3a5f",
  accentDim:    "rgba(30,58,95,0.07)",
  accentText:   "#ffffff",
  text:         "#111827",
  textSub:      "#4b6080",
  textMuted:    "#8499b0",
  border:       "rgba(30,58,95,0.09)",
  borderAccent: "rgba(30,58,95,0.15)",
  tabBg:        "#ffffff",
  tabBorder:    "rgba(30,58,95,0.12)",
  pillBg:       "#1e3a5f",
  pillText:     "#ffffff",
  iconActive:   "#ffffff",
  iconInactive: "#7a90a8",
  statusBar:    "dark-content",
  overlay:      "rgba(17,24,39,0.6)",
};

const NUIT: ThemeColors = {
  bg:           "#0c0600",
  surface:      "#1a0c00",
  surfaceHigh:  "#261200",
  accent:       "#e07020",
  accentDim:    "rgba(224,112,32,0.1)",
  accentText:   "#ffffff",
  text:         "#f0d8b0",
  textSub:      "#b89060",
  textMuted:    "#6b4820",
  border:       "rgba(224,112,32,0.1)",
  borderAccent: "rgba(224,112,32,0.2)",
  tabBg:        "#1a0c00",
  tabBorder:    "rgba(224,112,32,0.2)",
  pillBg:       "#e07020",
  pillText:     "#ffffff",
  iconActive:   "#ffffff",
  iconInactive: "#6b4820",
  statusBar:    "light-content",
  overlay:      "rgba(12,6,0,0.85)",
};

export const THEMES: Record<Theme, ThemeColors> = {
  sombre: SOMBRE,
  claire: CLAIRE,
  nuit:   NUIT,
};
