import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_W = 375;  // iPhone SE — smallest common phone
const MAX_SCALE = 1.35; // cap: tablet won't blow up beyond 35% of phone size

export const isTablet = width >= 600;

const scale = Math.min(width / BASE_W, MAX_SCALE);

/** Scale a size (padding, margin, dimension) — capped for tablets */
export const rs = (size: number) => Math.round(size * scale);

/** Scale a font size — clamped between 88% and 115% */
export const rf = (size: number) =>
  Math.round(Math.max(size * 0.88, Math.min(size * 1.15, size * scale)));

export const screenWidth = width;
export const screenHeight = height;
