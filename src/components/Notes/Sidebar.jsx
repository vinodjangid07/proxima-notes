import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { BookOpen, User, Sun, Moon, ChevronLeft} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

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
            className={`fixed bottom-0 left-0 right-0 h-16 w-full bg-white dark:bg-[#121214] border-t md:border-t-0 md:border-r border-[#e4e4e7] dark:border-[#2e2e34] flex flex-row justify-between items-center px-4 py-2 z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:h-screen md:flex-col md:items-start md:p-4 transition-all duration-200 ease-in-out font-sans ${
                isCollapsed ? "md:w-18" : "md:w-60"
            }`}
        >
            <div className="flex flex-row md:flex-col gap-3 md:gap-6 items-center md:items-start w-auto md:w-full">
                <Link to="/" className="flex items-center h-10 md:h-11 rounded-md overflow-hidden hover:opacity-85 transition-opacity w-10 md:w-full">
                    <div className="w-10 h-10 md:h-11 flex items-center justify-center shrink-0">
                        <img 
                          src="/proxima_logo.webp" 
                          alt="Proxima Logo" 
                          className="w-6 h-6 object-contain invert dark:invert-0 shrink-0" 
                        />
                    </div>
                    <span className={`hidden md:block font-semibold text-sm text-[#18181b] dark:text-[#f4f4f5] tracking-tight whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px] pr-4'}`}>
                        Proxima
                    </span>
                </Link>

                <nav className="flex flex-row md:flex-col gap-1.5 w-auto md:w-full">
                    <SidebarNavItem
                        to="/notes"
                        icon={BookOpen}
                        label="Workspace"
                        isCollapsed={isCollapsed}
                    />
                </nav>
            </div>

            <div className="flex flex-row md:flex-col gap-1.5 items-center md:items-start w-auto md:w-full">
                <button
                    onClick={toggleTheme}
                    className="flex items-center h-10 md:h-11 rounded-md text-sm font-medium text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-all duration-150 w-auto md:w-full cursor-pointer select-none overflow-hidden"
                    title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    <div className="w-10 h-10 md:h-11 flex items-center justify-center shrink-0">
                        {resolvedTheme === "dark" ? (
                            <Sun className="w-4.5 h-4.5 shrink-0 text-[#fbbf24]" />
                        ) : (
                            <Moon className="w-4.5 h-4.5 shrink-0 text-[#27272a]" />
                        )}
                    </div>
                    <span className={`hidden md:block whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px] pr-4'}`}>
                        {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                </button>

                <SidebarNavItem
                    to="/profile"
                    icon={User}
                    label="Profile"
                    isCollapsed={isCollapsed}
                />

                <button
                    onClick={toggleCollapse}
                    className="hidden md:flex items-center h-11 rounded-md text-sm font-medium text-[#71717a] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-all duration-150 w-full cursor-pointer select-none mt-2 overflow-hidden"
                >
                    <div className="w-10 h-11 flex items-center justify-center shrink-0">
                        <ChevronLeft className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                    <span className={`whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px] pr-4'}`}>
                        Collapse
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
