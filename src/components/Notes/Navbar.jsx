import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { User } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-[#0e0e11]/95 backdrop-blur-md select-none font-sans">
      <div className="max-w-[1200px] mx-auto h-16 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
          <img
            src="/proxima_logo.webp"
            alt="Proxima Logo"
            className="w-7 h-7 object-contain invert dark:invert-0 shrink-0 rounded-md"
          />
          <span className="font-semibold text-base tracking-tight text-[#171717] dark:text-[#ededed] whitespace-nowrap">
            Proxima
          </span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-4">
          {currentUser ? (
            <>
              <Link
                to="/notes"
                className="text-xs sm:text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-[#ededed] transition-colors px-2 py-1"
              >
                Workspace
              </Link>

              <ThemeToggle />

              <Link
                to="/profile"
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                title={currentUser.displayName || currentUser.email || "Profile Settings"}
                aria-label="Profile"
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : currentUser ? (
                  <div className="w-full h-full bg-[#e4e4e7] dark:bg-[#202025] text-[#171717] dark:text-white font-semibold text-xs flex items-center justify-center uppercase select-none">
                    {(currentUser.displayName || currentUser.email || "U")[0]}
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#f0f0f3] dark:bg-[#1c1c21] text-[#60646c] dark:text-[#a0a4ab] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              <ThemeToggle />

              <Link
                to="/signup"
                className="h-10 px-4 inline-flex items-center justify-center bg-black hover:bg-[#1a1a1a] text-white dark:bg-white dark:hover:bg-[#f0f0f3] dark:text-[#171717] rounded-lg font-medium text-xs sm:text-sm transition-all shadow-xs active:scale-98"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
