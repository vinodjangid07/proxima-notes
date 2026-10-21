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
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-[#0e0e11]/95 backdrop-blur-md border-b border-[#dcdee0] dark:border-[#27272a] select-none font-sans">
      <div className="max-w-[1200px] mx-auto h-16 px-6 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
          <img
            src="/proxima_logo.webp"
            alt="Proxima Logo"
            className="w-7 h-7 object-contain invert dark:invert-0 shrink-0"
          />
          <span className="font-semibold text-sm tracking-tight text-[#171717] dark:text-[#ededed] whitespace-nowrap">
            Proxima
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/notes"
            className="text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-[#ededed] transition-colors"
          >
            Workspace
          </Link>
          <a
            href="https://github.com/vinodjangid07/proxima-notes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-[#ededed] transition-colors"
          >
            GitHub
          </a>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#171717] dark:text-[#ededed] bg-[#f0f0f3] dark:bg-[#1a1a1e] border border-[#dcdee0] dark:border-[#2e2e34] px-3 py-1.5 rounded-md">
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
                className="text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-[#ededed] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="h-10 px-[18px] inline-flex items-center justify-center bg-[#000000] hover:bg-[#1a1a1a] text-white dark:bg-white dark:hover:bg-[#f0f0f3] dark:text-[#171717] rounded-md font-medium text-sm transition-colors shadow-xs active:scale-98"
              >
                Get Started
              </Link>
            </div>
          )}

          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2" ref={dropdownRef}>
          <ThemeToggle />

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#171717] dark:text-[#ededed] cursor-pointer rounded-md px-3 py-1.5 bg-[#f0f0f3] dark:bg-[#1a1a1e] border border-[#dcdee0] dark:border-[#2e2e34]"
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
            <div className="absolute right-6 top-16 mt-2 w-48 bg-white dark:bg-[#1a1a1e] border border-[#dcdee0] dark:border-[#2e2e34] rounded-lg p-2 flex flex-col gap-1 z-50 shadow-lg">
              <Link
                to="/notes"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#171717] dark:text-[#ededed] hover:bg-[#f0f0f3] dark:hover:bg-[#27272a] rounded-md transition-colors"
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
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#171717] dark:text-[#ededed] hover:bg-[#f0f0f3] dark:hover:bg-[#27272a] rounded-md transition-colors"
                  >
                    <span>Log In</span>
                    <LogIn className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#171717] dark:text-[#ededed] hover:bg-[#f0f0f3] dark:hover:bg-[#27272a] rounded-md transition-colors"
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
