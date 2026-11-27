import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";
import ThemeToggle from "../common/ThemeToggle";

const HomeNav = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [openPath, setOpenPath] = useState(null);
  const dropdownOpen = openPath === location.pathname;
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenPath(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenPath(null);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const headerClass = isHome
    ? `fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-300 ${
        scrolled
          ? "bg-[#faf9f6]/80 dark:bg-[#09090b]/80 backdrop-blur-md"
          : "bg-transparent"
      }`
    : "sticky top-0 z-50 h-16 bg-[#faf9f6]/90 dark:bg-[#09090b]/90 backdrop-blur-md transition-colors duration-200";

  return (
    <header className={headerClass}>
      <nav
        aria-label="Primary"
        className="max-w-[1440px] h-full mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 group select-none shrink-0 min-h-[36px] rounded-md"
        >
          <img
            src="/proxima_logo.webp"
            alt="Proxima"
            width="28"
            height="28"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-md invert dark:invert-0 transition-transform duration-300 group-hover:scale-105 shrink-0"
          />
          <span className="roll font-semibold text-sm sm:text-base text-[#141416] dark:text-[#f4f4f2] tracking-tight">
            <span>Proxima</span>
            <span aria-hidden="true">Proxima</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <ThemeToggle className="min-w-[36px] min-h-[36px]" />

          {currentUser ? (
            <Link
              to="/notes"
              data-fill
              className="flood-btn flood-btn--solid h-10 px-4 inline-flex items-center gap-2.5 rounded-lg text-sm font-medium whitespace-nowrap"
            >
              <span className="flood-btn__fill" aria-hidden="true" />
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User avatar"}
                  width="20"
                  height="20"
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
              )}
              <span>Workspace</span>
              <span className="arrow-nudge" aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-draw inline-flex items-center min-h-[36px] px-2 text-sm font-medium text-[#565961] hover:text-[#141416] dark:text-[#a1a4ab] dark:hover:text-[#f4f4f2] transition-colors whitespace-nowrap"
              >
                Log in
              </Link>

              <Link
                to="/notes"
                data-fill
                className="flood-btn flood-btn--solid group h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                <span className="flood-btn__fill" aria-hidden="true" />
                <span>Open workspace</span>
                <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </>
          )}
        </div>

        <div className="flex sm:hidden items-center relative" ref={dropdownRef}>
          {currentUser ? (
            <Link
              to="/notes"
              className="flood-btn flood-btn--solid h-9 px-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-medium whitespace-nowrap"
            >
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User avatar"}
                  width="16"
                  height="16"
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              )}
              <span>Workspace →</span>
            </Link>
          ) : (
            <>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpenPath((prev) => (prev === location.pathname ? null : location.pathname))}
                className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium bg-[#ecebe4] dark:bg-[#1a1a20] text-[#141416] dark:text-[#f4f4f2] active:scale-97 transition-transform cursor-pointer whitespace-nowrap select-none"
                aria-expanded={dropdownOpen}
                aria-controls="mobile-guest-menu"
              >
                <span>Guest</span>
                <span
                  aria-hidden="true"
                  className={`text-[11px] leading-none transition-transform duration-200 ${
                    dropdownOpen ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>

              {dropdownOpen && (
                <div
                  id="mobile-guest-menu"
                  className="absolute top-full right-0 mt-2 w-52 rounded-xl bg-[#faf9f6] dark:bg-[#15151a] p-2 z-50 flex flex-col gap-1"
                >
                  <Link
                    to="/notes"
                    onClick={() => setOpenPath(null)}
                    className="w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-[#141416] text-[#faf9f6] dark:bg-[#f4f4f2] dark:text-[#09090b] active:scale-98 transition-transform"
                  >
                    <span>Open workspace</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <Link
                    to="/login"
                    onClick={() => setOpenPath(null)}
                    className="w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#141416] dark:text-[#f4f4f2] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span>Log in</span>
                    <span className="text-[#565961] dark:text-[#a1a4ab]" aria-hidden="true">↗</span>
                  </Link>

                  <div className="flex items-center justify-between px-3 py-1.5 min-h-[38px] text-xs font-medium text-[#565961] dark:text-[#a1a4ab]">
                    <span>Appearance</span>
                    <ThemeToggle className="min-w-[32px] min-h-[32px]" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HomeNav;
