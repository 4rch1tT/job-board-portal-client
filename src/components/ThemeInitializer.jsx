import React,{ useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeTheme } from "@/store/slices/themeSlice";

const ThemeInitializer = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    dispatch(initializeTheme());

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        if (theme === "system") {
          dispatch(initializeTheme());
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [dispatch, theme]);

  return null; 
};

export default ThemeInitializer;
