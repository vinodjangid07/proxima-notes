import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
    Search, 
    Plus, 
    Sun, 
    Moon, 
    LayoutGrid, 
    List, 
    Download, 
    Upload, 
    Trash2, 
    FileText, 
    Tag, 
    CornerDownLeft,
    X,
    Archive
} from "lucide-react";
import { useTheme } from "next-themes";
import { stripMarkdown } from "../../lib/markdown";
import { getNoteColor } from "../../lib/noteColors";

const CommandPalette = ({
    isOpen,
    onClose,
    notes = [],
    allTags = [],
    onSelectNote,
    onCreateNote,
    viewMode = "grid",
    onToggleViewMode,
    onSelectFilter,
    onSelectTag,
    onExportJson,
    onExportMarkdown,
    onImportNotes
}) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const fileInputRef = useRef(null);
    const { theme, setTheme, resolvedTheme } = useTheme();

    const activeNotes = useMemo(() => notes.filter(n => !n.deletedAt), [notes]);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const filteredNotes = useMemo(() => {
        if (!query.trim()) return activeNotes.slice(0, 5);
        const q = query.toLowerCase();
        return activeNotes
            .filter(n => 
                (n.title && n.title.toLowerCase().includes(q)) ||
                (n.content && n.content.toLowerCase().includes(q))
            )
            .slice(0, 6);
    }, [activeNotes, query]);

    const filteredTags = useMemo(() => {
        if (!query.trim()) return allTags.slice(0, 4);
        const q = query.toLowerCase().replace(/^#/, "");
        return allTags.filter(t => t.toLowerCase().includes(q)).slice(0, 4);
    }, [allTags, query]);

    const actions = useMemo(() => {
        const list = [
            {
                id: "action-new-note",
                category: "Actions",
                title: "Create New Note",
                icon: Plus,
                shortcut: "N",
                perform: () => {
                    onCreateNote();
                    onClose();
                }
            },
            {
                id: "action-toggle-theme",
                category: "Actions",
                title: resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
                icon: resolvedTheme === "dark" ? Sun : Moon,
                shortcut: "T",
                perform: () => {
                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                    onClose();
                }
            },
            {
                id: "action-toggle-view",
                category: "Actions",
                title: viewMode === "grid" ? "Switch to List View" : "Switch to Grid View",
                icon: viewMode === "grid" ? List : LayoutGrid,
                shortcut: "V",
                perform: () => {
                    if (onToggleViewMode) onToggleViewMode();
                    onClose();
                }
            },
            {
                id: "action-view-all",
                category: "Navigation",
                title: "View All Notes",
                icon: FileText,
                perform: () => {
                    if (onSelectFilter) onSelectFilter("all");
                    onClose();
                }
            },
            {
                id: "action-view-pinned",
                category: "Navigation",
                title: "View Pinned Notes",
                icon: FileText,
                perform: () => {
                    if (onSelectFilter) onSelectFilter("pinned");
                    onClose();
                }
            },
            {
                id: "action-view-trash",
                category: "Navigation",
                title: "View Trash",
                icon: Trash2,
                perform: () => {
                    if (onSelectFilter) onSelectFilter("trash");
                    onClose();
                }
            },
            {
                id: "action-export-json",
                category: "Data Portability",
                title: "Export Notes (JSON Backup)",
                icon: Download,
                shortcut: "E",
                perform: () => {
                    if (onExportJson) onExportJson();
                    onClose();
                }
            },
            {
                id: "action-export-md",
                category: "Data Portability",
                title: "Export Notes (Markdown)",
                icon: Download,
                perform: () => {
                    if (onExportMarkdown) onExportMarkdown();
                    onClose();
                }
            },
            {
                id: "action-import-json",
                category: "Data Portability",
                title: "Import Notes from JSON",
                icon: Upload,
                shortcut: "I",
                perform: () => {
                    fileInputRef.current?.click();
                }
            }
        ];

        if (!query.trim()) return list;
        const q = query.toLowerCase();
        return list.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
    }, [query, resolvedTheme, viewMode, onCreateNote, setTheme, onToggleViewMode, onSelectFilter, onExportJson, onExportMarkdown, onClose]);

    const allItems = useMemo(() => {
        const combined = [];
        
        filteredNotes.forEach(n => {
            combined.push({
                type: "note",
                id: `note-${n.id}`,
                data: n,
                perform: () => {
                    onSelectNote(n);
                    onClose();
                }
            });
        });

        actions.forEach(a => {
            combined.push({
                type: "action",
                id: a.id,
                data: a,
                perform: a.perform
            });
        });

        filteredTags.forEach(t => {
            combined.push({
                type: "tag",
                id: `tag-${t}`,
                data: t,
                perform: () => {
                    if (onSelectTag) onSelectTag(t);
                    onClose();
                }
            });
        });

        return combined;
    }, [filteredNotes, actions, filteredTags, onSelectNote, onSelectTag, onClose]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % Math.max(allItems.length, 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + allItems.length) % Math.max(allItems.length, 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = allItems[selectedIndex];
            if (item) {
                item.perform();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
        }
    }, [isOpen, allItems, selectedIndex, onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result);
                if (onImportNotes) {
                    onImportNotes(parsed);
                }
            } catch (err) {
                console.error("Failed to parse imported JSON:", err);
            }
            onClose();
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    if (!isOpen) return null;

    let itemCursor = 0;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-14 sm:pt-24 px-4 animate-in fade-in duration-150 select-none"
            onClick={onClose}
        >
            <input 
                ref={fileInputRef}
                type="file" 
                accept=".json"
                className="hidden" 
                onChange={handleFileChange}
            />

            <div 
                className="w-full max-w-xl bg-white dark:bg-[#141417] rounded-2xl shadow-2xl dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/5 dark:border-white/5 shrink-0">
                    <Search className="w-4 h-4 text-[#60646c] dark:text-[#a0a4ab] shrink-0" />
                    <input 
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search notes..."
                        className="w-full bg-transparent text-sm sm:text-base text-[#171717] dark:text-white placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-[#60646c] dark:text-[#a0a4ab] bg-black/5 dark:bg-white/5 rounded-md">
                        ESC
                    </kbd>
                </div>

                <div 
                    ref={listRef}
                    className="overflow-y-auto p-2 flex flex-col gap-1 scrollbar-none flex-1"
                >
                    {allItems.length === 0 ? (
                        <div className="py-12 text-center text-sm text-[#60646c] dark:text-[#a0a4ab]">
                            No results found for &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        <>
                            {filteredNotes.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#60646c] dark:text-[#a0a4ab]">
                                        Notes
                                    </div>
                                    {filteredNotes.map((note) => {
                                        const currentIndex = itemCursor++;
                                        const isSelected = selectedIndex === currentIndex;
                                        const noteColor = getNoteColor(note.color);
                                        const cleanText = stripMarkdown(note.content || "");

                                        return (
                                            <button
                                                key={note.id}
                                                type="button"
                                                onClick={() => {
                                                    onSelectNote(note);
                                                    onClose();
                                                }}
                                                onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                                                    isSelected 
                                                        ? "bg-[#f0f0f3] dark:bg-[#1f1f25] text-[#171717] dark:text-white" 
                                                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${noteColor.swatchClass}`} />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-[#171717] dark:text-white truncate">
                                                            {note.title || "Untitled Note"}
                                                        </div>
                                                        <div className="text-xs text-[#60646c] dark:text-[#a0a4ab] truncate mt-0.5">
                                                            {cleanText || "No additional text"}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <CornerDownLeft className="w-3.5 h-3.5 text-[#60646c] dark:text-[#a0a4ab] shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {filteredTags.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#60646c] dark:text-[#a0a4ab]">
                                        Tags
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 px-3 py-1">
                                        {filteredTags.map((tag) => {
                                            const currentIndex = itemCursor++;
                                            const isSelected = selectedIndex === currentIndex;
                                            return (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => {
                                                        if (onSelectTag) onSelectTag(tag);
                                                        onClose();
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                                            : "bg-black/5 dark:bg-white/5 text-[#171717] dark:text-[#ededed] hover:bg-black/10 dark:hover:bg-white/10"
                                                    }`}
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    <span>#{tag}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {actions.length > 0 && (
                                <div>
                                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#60646c] dark:text-[#a0a4ab]">
                                        Actions
                                    </div>
                                    {actions.map((act) => {
                                        const currentIndex = itemCursor++;
                                        const isSelected = selectedIndex === currentIndex;
                                        const IconComp = act.icon;

                                        return (
                                            <button
                                                key={act.id}
                                                type="button"
                                                onClick={act.perform}
                                                onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                                                    isSelected 
                                                        ? "bg-[#f0f0f3] dark:bg-[#1f1f25] text-[#171717] dark:text-white" 
                                                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconComp className="w-4 h-4 shrink-0" />
                                                    <span className="text-sm font-medium">{act.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {act.shortcut && (
                                                        <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[#60646c] dark:text-[#a0a4ab] bg-black/5 dark:bg-white/5 rounded">
                                                            {act.shortcut}
                                                        </kbd>
                                                    )}
                                                    {isSelected && (
                                                        <CornerDownLeft className="w-3.5 h-3.5 text-[#60646c] dark:text-[#a0a4ab] shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-t border-black/5 dark:border-white/5 bg-[#fafafb] dark:bg-[#111113] text-[11px] text-[#60646c] dark:text-[#a0a4ab]">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-black/5 dark:bg-white/5 rounded">↑</kbd>
                            <kbd className="px-1 py-0.5 bg-black/5 dark:bg-white/5 rounded">↓</kbd>
                            to navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-black/5 dark:bg-white/5 rounded">↵</kbd>
                            to select
                        </span>
                    </div>
                    <span>Proxima Command</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
