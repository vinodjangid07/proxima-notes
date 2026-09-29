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
            className={`fixed bottom-0 left-0 right-0 h-16 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl flex flex-row justify-between items-center px-4 py-2 z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:h-screen md:flex-col md:items-start md:p-4 transition-all duration-300 ease-in-out shadow-[0_-4px_10px_rgba(0,0,0,0.02)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none ${
                isCollapsed ? "md:w-18" : "md:w-60"
            }`}
        >
            <div className="flex flex-row md:flex-col gap-4 md:gap-8 items-center md:items-start w-auto md:w-full">
                <Link to="/" className="hidden md:flex items-center gap-3 px-3 h-10 overflow-hidden hover:opacity-80 transition-opacity w-full">
                    <img 
                      src="/proxima_logo.webp" 
                      alt="Proxima Logo" 
                      className="w-7 h-7 object-contain invert dark:invert-0 shrink-0" 
                    />
                    {!isCollapsed && (
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-50 tracking-[0.25em] uppercase whitespace-nowrap">
                            Proxima
                        </span>
                    )}
                </Link>

                <nav className="flex flex-row md:flex-col gap-1.5 w-auto md:w-full">
                    <NavLink
                        to="/notes"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-auto md:w-full select-none ${
                                isActive
                                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                            }`
                        }
                    >
                        <BookOpen className="w-4.5 h-4.5 shrink-0" />
                        {!isCollapsed && <span className="hidden md:inline whitespace-nowrap">Workspace</span>}
                    </NavLink>
                </nav>
            </div>

            <div className="flex flex-row md:flex-col gap-1.5 items-center md:items-start w-auto md:w-full">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all w-auto md:w-full cursor-pointer select-none"
                    title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {resolvedTheme === "dark" ? (
                        <Sun className="w-4.5 h-4.5 shrink-0 text-amber-500" />
                    ) : (
                        <Moon className="w-4.5 h-4.5 shrink-0 text-zinc-700" />
                    )}
                    {!isCollapsed && (
                        <span className="hidden md:inline whitespace-nowrap">
                            {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                    )}
                </button>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-auto md:w-full select-none ${
                            isActive
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                        }`
                    }
                >
                    <User className="w-4.5 h-4.5 shrink-0" />
                    {!isCollapsed && <span className="hidden md:inline whitespace-nowrap">Profile</span>}
                </NavLink>

                <button
                    onClick={toggleCollapse}
                    className="hidden md:flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all w-full cursor-pointer select-none mt-2"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4.5 h-4.5 shrink-0" />
                    ) : (
                        <ChevronLeft className="w-4.5 h-4.5 shrink-0" />
                    )}
                    {!isCollapsed && <span className="whitespace-nowrap">Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
