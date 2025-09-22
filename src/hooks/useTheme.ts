import { useEffect } from "react";
import { useAppSelector } from "../hooks/redux";

export const useTheme = () => {
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [theme]);

  return theme;
};
