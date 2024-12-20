import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage?.getItem("theme") as Theme) || "system"
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback((theme: Theme) => {
    localStorage?.setItem("theme", theme);
    setThemeState(theme);
  }, []);

  return {
    theme,
    setTheme,
  } as const;
}
