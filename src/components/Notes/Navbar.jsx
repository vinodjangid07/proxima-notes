import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { User, ChevronDown, LogOut, ArrowRight, LogIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('Notes List');
    window.dispatchEvent(new Event("local-logout"));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#e4e4e7] dark:border-[#2e2e34] select-none font-sans">
      <div className="max-w-5xl mx-auto h-16 px-6 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
          <img
            src="/proxima_logo.webp"
            alt="Proxima Logo"
            className="w-7 h-7 object-contain invert dark:invert-0 shrink-0"
          />
          <span className="font-semibold text-sm tracking-tight text-[#18181b] dark:text-[#f4f4f5] whitespace-nowrap">
            Proxima
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link
            to="/notes"
            className="text-sm font-medium text-[#52525b] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] transition-colors"
          >
            Workspace
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] bg-[#f4f4f5] dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] px-3 py-1.5 rounded-full">
                {currentUser.displayName || currentUser.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-[#ef4444] hover:text-[#dc2626] transition-colors cursor-pointer px-2 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-[#52525b] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-[#5645d4] hover:bg-[#4534b3] text-white px-3.5 py-1.5 rounded-md font-medium text-xs transition-colors shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}

          <ThemeToggle />
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2" ref={dropdownRef}>
          <ThemeToggle />

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] cursor-pointer rounded-md px-3 py-1.5 bg-[#f4f4f5] dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34]"
          >
            {currentUser ? (
              <span className="max-w-[100px] truncate">
                {currentUser.displayName || currentUser.email?.split("@")[0]}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Guest
              </span>
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-6 top-16 mt-2 w-48 bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-xl p-2 flex flex-col gap-1 z-50 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.3)]">
              <Link
                to="/notes"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] rounded-md transition-colors"
              >
                <span>Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {currentUser ? (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#ef4444] hover:bg-[#fee2e2] dark:hover:bg-[#ef4444]/15 rounded-md transition-colors text-left cursor-pointer"
                >
                  <span>Log Out</span>
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] rounded-md transition-colors"
                  >
                    <span>Log In</span>
                    <LogIn className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#5645d4] hover:bg-[#5645d4]/10 dark:hover:bg-[#5645d4]/20 rounded-md transition-colors"
                  >
                    <span>Sign Up</span>
                    <LogIn className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
