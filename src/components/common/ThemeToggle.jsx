import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ className = "", iconClassName = "w-4 h-4" }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const current = resolvedTheme || theme || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  };

  const isDark = mounted ? (resolvedTheme === "dark" || theme === "dark") : true;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-8 h-8 flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className={`${iconClassName} text-amber-400 shrink-0`} />
      ) : (
        <Moon className={`${iconClassName} text-zinc-700 shrink-0`} />
      )}
    </button>
  );
};

export default ThemeToggle;
