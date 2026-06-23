import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { THEMES, Theme, ThemeColors } from "@/utils/colors";

const KEY = "app_theme";

type ThemeCtx = {
  theme: Theme;
  colors: ThemeColors;
  ready: boolean;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: "sombre",
  colors: THEMES.sombre,
  ready: false,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("sombre");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(v => { if (v && v in THEMES) setThemeState(v as Theme); })
      .catch(() => {})
      .then(() => setReady(true));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    AsyncStorage.setItem(KEY, t).catch(() => {});
  }, []);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, colors: THEMES[theme], ready, setTheme } },
    children
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
