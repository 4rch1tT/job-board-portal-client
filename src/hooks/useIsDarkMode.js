import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useIsDarkMode = () => {
  const theme = useSelector((state) => state.theme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (theme.theme === "dark") return true;
  if (theme.theme === "light") return false;
  return systemPrefersDark;
};

export default useIsDarkMode;