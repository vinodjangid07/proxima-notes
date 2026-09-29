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
    <div className="w-full flex justify-center pt-6 px-6 z-50 sticky top-0">
      <header className="w-full max-w-5xl h-16 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-2xl rounded-3xl flex items-center justify-between px-6 sm:px-8 shrink-0 transition-all duration-300 select-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
        <img
          src="/proxima_logo.webp"
          alt="Proxima Logo"
          className="w-7 h-7 object-contain invert dark:invert-0 shrink-0"
        />
        <span className="hidden sm:inline-block font-bold text-xs tracking-[0.25em] uppercase text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
          Proxima Notes
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/notes"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Workspace
        </Link>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full">
              {currentUser.displayName || currentUser.email?.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full">
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span>Guest</span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 rounded-xl transition-colors cursor-pointer"
          title={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-700" />
          )}
        </button>
      </nav>

      <div className="md:hidden flex items-center gap-3" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer rounded-xl px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900"
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
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-6 top-16 mt-2 w-48 bg-white dark:bg-zinc-950 rounded-xl p-2 flex flex-col gap-1 z-50 shadow-xl dark:shadow-none dark:bg-zinc-900">
            <Link
              to="/notes"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
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
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-left cursor-pointer"
              >
                <span>Log Out</span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <span>Log In</span>
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <span>Sign Up</span>
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
              </>
            )}


            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-left cursor-pointer"
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
    </div>
  );
};

export default Navbar;
