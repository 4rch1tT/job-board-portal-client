import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("vite-ui-theme");
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      return savedTheme;
    }
  }
  return "system";
};

const applyTheme = (theme) => {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

const initialState = {
  theme: getInitialTheme(),
};

applyTheme(initialState.theme);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const newTheme = action.payload;
      if (["light", "dark", "system"].includes(newTheme)) {
        state.theme = newTheme;

        if (typeof window !== "undefined") {
          localStorage.setItem("vite-ui-theme", newTheme);
        }
        applyTheme(newTheme);
      } else {
        console.error("Invalid theme:", newTheme);
      }
    },
    initializeTheme: (state) => {
      applyTheme(state.theme);
    },
  },
});

export const { setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
