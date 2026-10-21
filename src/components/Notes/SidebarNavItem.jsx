import { NavLink } from "react-router-dom";

const SidebarNavItem = ({ to, icon: Icon, label, isCollapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center h-10 md:h-11 rounded-xl text-sm font-medium transition-all duration-150 w-auto md:w-full select-none overflow-hidden ${
                    isActive
                        ? "bg-[#f0f0f3] dark:bg-[#161619] text-[#171717] dark:text-[#ffffff] border border-[#dcdee0] dark:border-[#27272a] shadow-xs font-semibold"
                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ffffff] hover:bg-[#f0f0f3] dark:hover:bg-[#161619]/60"
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
