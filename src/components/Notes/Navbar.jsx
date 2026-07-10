import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import useAuth from "../../context/useAuth";
import { Sun, Moon, User, ChevronDown, LogOut, ArrowRight, LogIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full h-20 border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 sm:px-16 shrink-0 relative transition-colors duration-200 z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img 
          src="/proxima_logo.webp" 
          alt="Proxima Logo" 
          className="w-8 h-8 object-contain invert dark:invert-0 shrink-0" 
        />
        <span className="font-semibold text-sm tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
          Proxima Notes
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/notes"
          className="text-sm font-medium text-zinc-505 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Workspace
        </Link>

        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Hello, {currentUser.displayName || currentUser.email?.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <User className="h-4.5 w-4.5" />
            <span>Guest</span>
          </div>
        )}

          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-lg transition-colors cursor-pointer"
            title={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4.5 h-4.5 text-amber-500" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-zinc-700" />
            )}
          </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className="md:hidden flex items-center gap-3" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
        >
          {currentUser ? (
            <span className="max-w-[100px] truncate">
              {currentUser.displayName || currentUser.email?.split("@")[0]}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> Guest
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-6 top-16 mt-2 w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 flex flex-col gap-1 z-50">
            <Link
              to="/notes"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
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
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-left cursor-pointer"
              >
                <span>Log Out</span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <span>Log In</span>
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-750 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <span>Sign Up</span>
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            <div className="h-px bg-zinc-200 dark:bg-zinc-900 my-1"></div>

            {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-left cursor-pointer"
              >
                <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                {resolvedTheme === "dark" ? (
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-zinc-700" />
                )}
              </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
