export const colors = {
  primary: "#4F46E5", // Indigo
  primaryLight: "#EEF2FF",
  primaryHover: "#4338CA",
  secondary: "#9333EA", // Purple
  accent: "#F472B6", // Pink

  background: "#F8FAFC", // Modern Light Gray/Blue
  surface: "#FFFFFF",
  white: "#FFFFFF",

  text: "#1E293B", // Slate 800
  textMuted: "#64748B", // Slate 500
  dark: "#0f172a",
  light: "#f8fafc",
  gray: "#94a3b8",

  border: "#E2E8F0",
  shadow: "#000000",

  error: "#EF4444",
  success: "#10B981",

  glass: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export const lightTheme = {
  ...colors,
};

export const darkTheme = {
  primary: "#8B5CF6",
  primaryLight: "#1E293B",
  primaryHover: "#7C3AED",
  secondary: "#C084FC",
  accent: "#FB7185",

  background: "#0F172A",
  surface: "#111827",
  white: "#F8FAFC",

  text: "#E2E7FF",
  textMuted: "#CBD5E1",
  dark: "#020617",
  light: "#0F172A",
  gray: "#94A3B8",

  border: "#334155",
  shadow: "#000000",

  error: "#FCA5A5",
  success: "#4ADE80",

  glass: "rgba(15, 23, 42, 0.85)",
  glassBorder: "rgba(148, 163, 184, 0.18)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
};
