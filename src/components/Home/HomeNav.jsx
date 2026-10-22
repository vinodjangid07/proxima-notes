import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import ThemeToggle from "../common/ThemeToggle";
import { ArrowRight, User } from "lucide-react";

const HomeNav = () => {
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-[#0e0e11]/85 backdrop-blur-md shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <img
            src="/proxima_logo.webp"
            alt="Proxima"
            className="w-7 h-7 object-contain rounded-md invert dark:invert-0 transition-transform group-hover:scale-105"
          />
          <span className="font-semibold text-base text-[#171717] dark:text-white tracking-tight">
            Proxima
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          {currentUser ? (
            <Link
              to="/notes"
              className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>Workspace</span>
            </Link>
          ) : (
            <Link
              to="/notes"
              className="h-10 px-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs"
            >
              <span>Open workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeNav;
