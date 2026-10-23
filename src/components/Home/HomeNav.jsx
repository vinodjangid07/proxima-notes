import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";
import ThemeToggle from "../common/ThemeToggle";
import { ArrowRight, User, ChevronDown, LogIn } from "lucide-react";

const HomeNav = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownOpen]);

  const headerClass = isHome
    ? `fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-[#0e0e11]/85 backdrop-blur-md shadow-xs"
          : "bg-transparent"
      }`
    : "sticky top-0 z-50 h-14 sm:h-16 bg-white/90 dark:bg-[#0e0e11]/90 backdrop-blur-md shadow-xs transition-colors duration-200";

  return (
    <header className={headerClass}>
      <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group select-none shrink-0">
          <img
            src="/proxima_logo.webp"
            alt="Proxima"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-md invert dark:invert-0 transition-transform group-hover:scale-105 shrink-0"
          />
          <span className="font-semibold text-sm sm:text-base text-[#171717] dark:text-white tracking-tight">
            Proxima
          </span>
        </Link>

        {/* Desktop Navigation (>= 640px) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {currentUser ? (
            <Link
              to="/notes"
              className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs whitespace-nowrap"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
              ) : (
                <User className="w-4 h-4 shrink-0" />
              )}
              <span>Workspace</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-white px-2.5 py-1.5 transition-colors whitespace-nowrap"
              >
                Log in
              </Link>

              <Link
                to="/notes"
                className="h-10 px-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs whitespace-nowrap"
              >
                <span>Open workspace</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation (< 640px) */}
        <div className="flex sm:hidden items-center relative" ref={dropdownRef}>
          {currentUser ? (
            <Link
              to="/notes"
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black active:scale-98 shadow-xs whitespace-nowrap"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <User className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>Workspace</span>
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium bg-[#f0f0f3] dark:bg-[#1c1c21] text-[#171717] dark:text-white active:scale-98 transition-all cursor-pointer shadow-2xs whitespace-nowrap select-none"
                aria-expanded={dropdownOpen}
                aria-label="Guest Menu"
              >
                <span>Guest</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#60646c] dark:text-[#a0a4ab] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#16161a] p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.65)] z-50 flex flex-col gap-1 border-0">
                  <Link
                    to="/notes"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black shadow-2xs active:scale-98 transition-all"
                  >
                    <span>Open workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-98 transition-colors"
                  >
                    <span>Log in</span>
                    <LogIn className="w-3.5 h-3.5 text-[#60646c] dark:text-[#a0a4ab]" />
                  </Link>

                  <div className="h-px bg-black/5 dark:bg-white/5 my-0.5" />

                  <div className="flex items-center justify-between px-3 py-1 text-xs font-medium text-[#60646c] dark:text-[#a0a4ab]">
                    <span>Appearance</span>
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeNav;
