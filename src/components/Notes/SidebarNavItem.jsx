import { NavLink } from "react-router-dom";

const SidebarNavItem = ({ to, icon: Icon, label, isCollapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center h-10 md:h-11 rounded-md text-sm font-medium transition-all duration-150 w-auto md:w-full select-none overflow-hidden ${
                    isActive
                        ? "bg-[#f4f4f5] dark:bg-[#1c1c1f] text-[#18181b] dark:text-[#f4f4f5] border border-[#e4e4e7] dark:border-[#2e2e34] shadow-xs font-semibold"
                        : "text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]"
                }`
            }
        >
            <div className="w-10 h-10 md:h-11 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 shrink-0" />
            </div>
            <span className={`hidden md:block whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px] pr-4'}`}>
                {label}
            </span>
        </NavLink>
    );
};

export default SidebarNavItem;
