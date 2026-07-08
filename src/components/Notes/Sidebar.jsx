import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { BookOpen, User, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <aside 
            className={`h-screen border-r border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-md flex flex-col justify-between p-3 sm:p-4 transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-16 sm:w-20" : "w-64"
            }`}
        >
            <div className="flex flex-col gap-8">
                <Link to="/" className="flex items-center gap-3 px-2 h-10 overflow-hidden hover:opacity-80 transition-opacity">
                    <img 
                      src="/proxima_logo.webp" 
                      alt="Proxima Logo" 
                      className="w-8 h-8 object-contain invert dark:invert-0 shrink-0" 
                    />
                    {!isCollapsed && (
                        <span className="font-semibold text-lg text-zinc-800 dark:text-zinc-100 tracking-tight whitespace-nowrap animate-fade-in">
                            Proxima Notes
                        </span>
                    )}
                </Link>

                <nav className="flex flex-col gap-2">
                    <NavLink
                        to="/notes"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-950 dark:text-white"
                                    : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30"
                            }`
                        }
                    >
                        <BookOpen className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Notes</span>}
                    </NavLink>
                </nav>
            </div>

            <div className="flex flex-col gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30 transition-all w-full cursor-pointer"
                    title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {resolvedTheme === "dark" ? (
                        <Sun className="w-5 h-5 shrink-0 text-amber-500" />
                    ) : (
                        <Moon className="w-5 h-5 shrink-0 text-zinc-700" />
                    )}
                    {!isCollapsed && (
                        <span className="whitespace-nowrap">
                            {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                    )}
                </button>

                {/* Profile Link */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                                ? "bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-950 dark:text-white"
                                : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30"
                        }`
                    }
                >
                    <User className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap">Profile</span>}
                </NavLink>

                {/* Collapse Toggle */}
                <button
                    onClick={toggleCollapse}
                    className="flex items-center gap-3 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30 transition-all w-full cursor-pointer border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4 mt-2"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 shrink-0" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 shrink-0" />
                    )}
                    {!isCollapsed && <span className="whitespace-nowrap">Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
