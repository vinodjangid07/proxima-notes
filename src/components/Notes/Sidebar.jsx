import { useState } from "react";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { 
    BookOpen, 
    Pin, 
    Hash, 
    Plus, 
    ChevronLeft,
    RefreshCw,
    Trash2
} from "lucide-react";
import useNotesContext from "../../context/useNotesContext";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { notes, pinnedCount, trashedCount, allTags, tagCounts, syncStatus, pendingCount, retrySync } = useNotesContext();

    const isOnNotesPage = location.pathname === "/notes";
    const activeFilter = isOnNotesPage ? searchParams.get("filter") : null;
    const activeTag = isOnNotesPage ? searchParams.get("tag") : null;
    const isAllNotes = isOnNotesPage && !activeFilter && !activeTag;

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    const handleCreateNote = () => {
        if (!isOnNotesPage) {
            navigate("/notes", { state: { autoCreate: true } });
        } else {
            window.dispatchEvent(new CustomEvent("proxima-create-note"));
        }
    };

    const selectAllNotes = () => {
        if (!isOnNotesPage) {
            navigate("/notes");
        } else {
            setSearchParams({});
        }
    };

    const selectPinned = () => {
        if (!isOnNotesPage) {
            navigate("/notes?filter=pinned");
        } else {
            setSearchParams({ filter: "pinned" });
        }
    };

    const selectTrash = () => {
        if (!isOnNotesPage) {
            navigate("/notes?filter=trash");
        } else {
            setSearchParams({ filter: "trash" });
        }
    };

    const selectTag = (tag) => {
        if (!isOnNotesPage) {
            navigate(`/notes?tag=${encodeURIComponent(tag)}`);
        } else {
            setSearchParams({ tag });
        }
    };

    const NavItem = ({ to, onClick, className, title, children }) => {
        if (isOnNotesPage) {
            return (
                <button
                    type="button"
                    onClick={onClick}
                    className={className}
                    title={title}
                >
                    {children}
                </button>
            );
        }
        return (
            <Link
                to={to}
                className={className}
                title={title}
            >
                {children}
            </Link>
        );
    };

    return (
        <aside 
            className={`fixed bottom-0 left-0 right-0 h-16 w-full bg-white dark:bg-[#0c0c0e] border-t md:border-t-0 md:border-r border-black/5 dark:border-white/5 flex flex-row justify-between items-center px-3 py-2 z-40 md:relative md:bottom-auto md:left-auto md:right-auto md:h-screen md:flex-col md:items-stretch md:p-3 transition-all duration-200 ease-in-out font-sans select-none ${
                isCollapsed ? "md:w-18" : "md:w-64"
            }`}
        >
            <div className="flex flex-col gap-4 w-full h-full overflow-hidden">
                <div className="hidden md:flex items-center justify-between px-2 pt-1 pb-1">
                    <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
                        <img 
                            src="/proxima_logo.webp" 
                            alt="Proxima Logo" 
                            className="w-7 h-7 object-contain invert dark:invert-0 shrink-0 transition-transform rounded-md" 
                        />
                        <span className={`font-semibold text-base text-[#171717] dark:text-[#ededed] tracking-tight whitespace-nowrap transition-all duration-200 ${
                            isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[150px]'
                        }`}>
                            Proxima
                        </span>
                    </Link>

                    {!isCollapsed && (
                        <div className="flex items-center gap-1.5">
                            {syncStatus === "syncing" && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" title="Syncing..." />
                            )}
                            {syncStatus === "offline" && (
                                <span className="w-2 h-2 rounded-full bg-amber-500" title={`Offline${pendingCount ? ` (${pendingCount})` : ''}`} />
                            )}
                            {syncStatus === "error" && (
                                <button onClick={retrySync} title="Sync issue - click to retry">
                                    <RefreshCw className="w-3.5 h-3.5 text-red-500 hover:rotate-180 transition-transform" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="hidden md:block w-full px-1">
                    <button
                        onClick={handleCreateNote}
                        className={`w-full h-10 bg-[#f0f0f3] hover:bg-[#eaebee] text-[#171717] dark:bg-[#18181b] dark:hover:bg-[#202025] dark:text-[#ededed] rounded-lg font-medium text-sm px-3 flex items-center transition-all cursor-pointer active:scale-98 overflow-hidden whitespace-nowrap ${
                            isCollapsed ? "px-0 justify-center w-10 mx-auto" : "justify-center gap-2"
                        }`}
                        title="New Note"
                    >
                        <Plus className="w-4 h-4 shrink-0 text-[#60646c] dark:text-[#a0a4ab]" />
                        <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                            isCollapsed ? "opacity-0 max-w-0 pointer-events-none" : "opacity-100 max-w-[120px]"
                        }`}>
                            New Note
                        </span>
                    </button>
                </div>

                <div className="hidden md:flex flex-col gap-6 w-full flex-1 overflow-y-auto scrollbar-none px-1">
                    <div className="flex flex-col gap-1">
                        {!isCollapsed && (
                            <span className="text-[11px] font-semibold text-[#60646c] dark:text-[#a0a4ab] uppercase tracking-wider px-2 py-1">
                                Views
                            </span>
                        )}

                        <NavItem
                            to="/notes"
                            onClick={selectAllNotes}
                            className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-all w-full cursor-pointer ${
                                isAllNotes
                                    ? "bg-[#f0f0f3] dark:bg-[#1a1a1e] text-[#171717] dark:text-white"
                                    : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3]/70 dark:hover:bg-[#161619]/60"
                            } ${isCollapsed ? "justify-center px-0 w-10 mx-auto" : "gap-2.5"}`}
                            title="All Notes"
                        >
                            <BookOpen className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">All Notes</span>}
                        </NavItem>

                        <NavItem
                            to="/notes?filter=pinned"
                            onClick={selectPinned}
                            className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-all w-full cursor-pointer ${
                                activeFilter === "pinned"
                                    ? "bg-[#f0f0f3] dark:bg-[#1a1a1e] text-[#171717] dark:text-white"
                                    : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3]/70 dark:hover:bg-[#161619]/60"
                            } ${isCollapsed ? "justify-center px-0 w-10 mx-auto" : "gap-2.5"}`}
                            title="Pinned Notes"
                        >
                            <Pin className={`w-4 h-4 shrink-0 ${activeFilter === "pinned" ? "fill-current" : ""}`} />
                            {!isCollapsed && <span className="truncate">Pinned</span>}
                        </NavItem>

                        <NavItem
                            to="/notes?filter=trash"
                            onClick={selectTrash}
                            className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-all w-full cursor-pointer ${
                                activeFilter === "trash"
                                    ? "bg-[#f0f0f3] dark:bg-[#1a1a1e] text-[#171717] dark:text-white"
                                    : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3]/70 dark:hover:bg-[#161619]/60"
                            } ${isCollapsed ? "justify-center px-0 w-10 mx-auto" : "justify-between gap-2.5"}`}
                            title="Trash"
                        >
                            <div className="flex items-center gap-2.5">
                                <Trash2 className="w-4 h-4 shrink-0" />
                                {!isCollapsed && <span className="truncate">Trash</span>}
                            </div>
                            {!isCollapsed && trashedCount > 0 && (
                                <span className="text-[11px] font-medium text-[#60646c] dark:text-[#a0a4ab] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5">
                                    {trashedCount}
                                </span>
                            )}
                        </NavItem>
                    </div>

                    <div className="flex flex-col gap-1">
                        {!isCollapsed && (
                            <div className="flex items-center justify-between px-2 py-1">
                                <span className="text-[11px] font-semibold text-[#60646c] dark:text-[#a0a4ab] uppercase tracking-wider">
                                    Tags
                                </span>
                            </div>
                        )}

                        {allTags.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {allTags.map((tag) => {
                                    const isSelected = activeTag === tag;
                                    return (
                                        <NavItem
                                            key={tag}
                                            to={`/notes?tag=${encodeURIComponent(tag)}`}
                                            onClick={() => selectTag(tag)}
                                            className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-all w-full cursor-pointer ${
                                                isSelected
                                                    ? "bg-[#f0f0f3] dark:bg-[#1a1a1e] text-[#171717] dark:text-white"
                                                    : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3]/70 dark:hover:bg-[#161619]/60"
                                            } ${isCollapsed ? "justify-center px-0 w-10 mx-auto" : "gap-2.5"}`}
                                            title={`#${tag}`}
                                        >
                                            <Hash className="w-4 h-4 opacity-60 shrink-0" />
                                            {!isCollapsed && (
                                                <span className="truncate">
                                                    {tag}
                                                </span>
                                            )}
                                        </NavItem>
                                    );
                                })}
                            </div>
                        ) : (
                            !isCollapsed && (
                                <p className="text-[11px] text-[#60646c] dark:text-[#a0a4ab] px-2 py-1 italic leading-relaxed">
                                    Use #tag anywhere in notes to group thoughts.
                                </p>
                            )
                        )}
                    </div>
                </div>

                <div className="md:hidden flex items-center justify-around w-full h-full">
                    <NavItem
                        to="/notes"
                        onClick={selectAllNotes}
                        className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium py-1 px-3 rounded-lg ${
                            isAllNotes ? "text-black dark:text-white font-semibold" : "text-[#60646c] dark:text-[#a0a4ab]"
                        }`}
                        title="All Notes"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="text-[10px]">All</span>
                    </NavItem>

                    <button
                        onClick={handleCreateNote}
                        className="w-10 h-10 rounded-full bg-[#f0f0f3] dark:bg-[#18181b] text-[#171717] dark:text-[#ededed] flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                        title="New Note"
                    >
                        <Plus className="w-5 h-5" />
                    </button>

                    <NavItem
                        to="/notes?filter=pinned"
                        onClick={selectPinned}
                        className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium py-1 px-3 rounded-lg ${
                            activeFilter === "pinned" ? "text-black dark:text-white font-semibold" : "text-[#60646c] dark:text-[#a0a4ab]"
                        }`}
                        title="Pinned Notes"
                    >
                        <Pin className="w-4 h-4" />
                        <span className="text-[10px]">Pinned</span>
                    </NavItem>
                </div>

                <div className="hidden md:flex flex-col gap-1 w-full pt-2 px-1">
                    <button
                        onClick={toggleCollapse}
                        className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#161619] transition-all w-full cursor-pointer ${
                            isCollapsed ? "justify-center px-0 w-10 mx-auto" : "gap-2.5"
                        }`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                            isCollapsed ? 'rotate-180' : 'rotate-0'
                        }`} />
                        {!isCollapsed && <span>Collapse</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
