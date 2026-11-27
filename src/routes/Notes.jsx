import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import useAuth from "../context/useAuth";
import NoteCard from "../components/Notes/NoteCard";
import NoteModal from "../components/Notes/NoteModal";
import ShortcutsModal from "../components/Notes/ShortcutsModal";
import SyncStatusBadge from "../components/Notes/SyncStatusBadge";
import ViewToggleButton from "../components/Notes/ViewToggleButton";
import ThemeToggle from "../components/common/ThemeToggle";
import useNotesContext from "../context/useNotesContext";
import { useDebounce } from "../hooks/useDebounce";
import { extractTags, stripMarkdown } from "../lib/markdown";
import Fuse from "fuse.js";
import { 
    Search, 
    LayoutGrid, 
    List, 
    X, 
    Plus, 
    FileText,
    Pin,
    Hash,
    User,
    Sun,
    Moon,
    Trash2,
    HelpCircle
} from "lucide-react";

const Notes = () => {
    const { 
        notes: noteList, 
        allTags,
        syncStatus, 
        pendingCount, 
        addNote: hookAddNote, 
        togglePinNote,
        editNote, 
        deleteNote, 
        restoreNote,
        permanentlyDeleteNote,
        emptyTrash,
        exportNotesJson,
        exportNotesMarkdown,
        importNotes,
        trashedCount,
        retrySync
    } = useNotesContext();

    const { currentUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const activeFilter = searchParams.get("filter");
    const activeTag = searchParams.get("tag");

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeNote, setActiveNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

    useEffect(() => {
        document.title = "Workspace | Proxima Notes";
    }, []);

    const searchInputRef = useRef(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 200);

    const selectedNote = useMemo(() => {
        if (!activeNote) return null;
        return noteList.find(n => n.id === activeNote.id) || activeNote;
    }, [noteList, activeNote]);

    const searchableNotes = useMemo(() => {
        return noteList
            .filter((n) => !n.deletedAt)
            .map((note) => ({
                ...note,
                cleanContent: stripMarkdown(note.content || ""),
                tags: extractTags(`${note.title || ""} ${note.content || ""}`)
            }));
    }, [noteList]);

    const fuseInstance = useMemo(() => {
        return new Fuse(searchableNotes, {
            keys: [
                { name: "title", weight: 0.5 },
                { name: "tags", weight: 0.35 },
                { name: "cleanContent", weight: 0.15 }
            ],
            threshold: 0.32,
            ignoreLocation: true,
            minMatchCharLength: 2,
            shouldSort: true
        });
    }, [searchableNotes]);

    const handleCreateNewNote = useCallback((initialTag = null) => {
        const defaultContent = initialTag ? `#${initialTag} ` : "";
        const draftNote = {
            id: crypto.randomUUID(),
            title: "",
            content: defaultContent,
            pinned: false,
            color: "default",
            isDraft: true,
            createdAt: new Date().toISOString()
        };
        setActiveNote(draftNote);
        setIsModalOpen(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const target = e.target;
            const isTyping = target && (
                target.tagName === "INPUT" || 
                target.tagName === "TEXTAREA" || 
                target.isContentEditable
            );

            const isMac = typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0;
            const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

            if ((e.altKey && e.key.toLowerCase() === "n") || (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "n")) {
                e.preventDefault();
                if (!isModalOpen) {
                    handleCreateNewNote(activeTag);
                }
                return;
            }

            if (!isTyping && e.key === "/") {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }
            if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "f") {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }

            if (!isTyping && e.key === "?") {
                e.preventDefault();
                setIsShortcutsOpen(prev => !prev);
                return;
            }

            if (e.altKey && e.key.toLowerCase() === "v") {
                e.preventDefault();
                setViewMode(prev => prev === "grid" ? "list" : "grid");
                return;
            }

            if (e.key === "Escape") {
                if (isShortcutsOpen) {
                    setIsShortcutsOpen(false);
                } else if (searchQuery) {
                    setSearchQuery("");
                    searchInputRef.current?.blur();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, isShortcutsOpen, searchQuery, activeTag, handleCreateNewNote]);

    useEffect(() => {
        if (location.state?.autoCreate) {
            handleCreateNewNote(activeTag);
            window.history.replaceState({}, document.title);
        }
    }, [location.state, handleCreateNewNote, activeTag]);

    useEffect(() => {
        const handleCustomCreate = () => {
            handleCreateNewNote(activeTag);
        };

        window.addEventListener("proxima-create-note", handleCustomCreate);
        return () => {
            window.removeEventListener("proxima-create-note", handleCustomCreate);
        };
    }, [handleCreateNewNote, activeTag]);

    const openNoteModal = useCallback((note) => {
        setActiveNote(note);
        setIsModalOpen(true);
    }, []);

    const closeNoteModal = useCallback(() => {
        setIsModalOpen(false);
        setActiveNote(null);
    }, []);

    const handleDeleteNote = useCallback((id) => {
        deleteNote(id);
        setActiveNote((current) => {
            if (current && current.id === id) {
                setIsModalOpen(false);
                return null;
            }
            return current;
        });
    }, [deleteNote]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    const handleTagSelect = useCallback((tag) => {
        if (activeTag === tag) {
            setSearchParams({});
        } else {
            setSearchParams({ tag });
        }
    }, [activeTag, setSearchParams]);

    const handleResetFilters = useCallback(() => {
        setSearchParams({});
        setSearchQuery('');
    }, [setSearchParams]);

    const setGridView = useCallback(() => setViewMode('grid'), []);
    const setListView = useCallback(() => setViewMode('list'), []);

    const isTrash = activeFilter === "trash";

    const filteredNotes = useMemo(() => {
        const query = debouncedSearchQuery.trim();

        if (isTrash) {
            let matched = noteList.filter((n) => Boolean(n.deletedAt));
            if (query) {
                const q = query.toLowerCase();
                matched = matched.filter(
                    (n) =>
                        (n.title && n.title.toLowerCase().includes(q)) ||
                        (n.content && n.content.toLowerCase().includes(q))
                );
            }
            return matched;
        }

        let matched = query
            ? fuseInstance.search(query).map((r) => r.item)
            : noteList.filter((n) => !n.deletedAt);

        if (activeFilter === "pinned") {
            matched = matched.filter((n) => Boolean(n.pinned) && !n.deletedAt);
        } else if (activeTag) {
            matched = matched.filter((note) => {
                if (note.deletedAt) return false;
                const noteTags = extractTags(`${note.title || ""} ${note.content || ""}`);
                return noteTags.includes(activeTag);
            });
        }

        if (!query) {
            return matched;
        }

        return [...matched].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
        });
    }, [noteList, debouncedSearchQuery, activeFilter, activeTag, fuseInstance, isTrash]);

    const currentTitle = useMemo(() => {
        if (activeTag) return `#${activeTag}`;
        if (activeFilter === "pinned") return "Pinned Notes";
        if (activeFilter === "trash") return "Trash";
        return "All Notes";
    }, [activeTag, activeFilter]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0e0e11] text-[#171717] dark:text-[#ededed] transition-colors duration-200 w-full font-sans flex flex-col">
            
            <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-[#0e0e11]/90 backdrop-blur-md h-14 sm:h-16 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <h1 className="text-base sm:text-[17px] font-semibold tracking-tight text-[#171717] dark:text-white truncate">
                        {currentTitle}
                    </h1>
                    <span className="text-xs font-medium text-[#60646c] dark:text-[#a0a4ab] px-2 py-0.5 rounded-full bg-[#f0f0f3] dark:bg-[#1a1a1e] shrink-0">
                        {filteredNotes.length}
                    </span>
                    <div className="hidden sm:inline-flex items-center">
                        <SyncStatusBadge 
                            status={syncStatus} 
                            pendingCount={pendingCount} 
                            onRetry={retrySync} 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsShortcutsOpen(true)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title="Keyboard Shortcuts (?)"
                        aria-label="Keyboard Shortcuts"
                    >
                        <HelpCircle className="w-4 h-4" />
                    </button>

                    <ThemeToggle />

                    <Link
                        to="/profile"
                        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                        title={currentUser ? (currentUser.displayName || currentUser.email) : "Profile Settings"}
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
                </div>
            </header>

            <main className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5 w-full">
                    <div className="relative flex-1 max-w-sm sm:max-w-md h-10 flex items-center">
                        <Search className="w-4 h-4 text-[#60646c] dark:text-[#a0a4ab] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search thoughts..."
                            className="w-full h-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:bg-transparent rounded-lg pl-9 pr-14 text-xs sm:text-sm text-[#171717] dark:text-[#ededed] placeholder-[#60646c] dark:placeholder-[#a0a4ab] focus:outline-none focus:ring-1 focus:ring-black/15 dark:focus:ring-white/15 transition-all"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            {searchQuery ? (
                                <button 
                                    onClick={handleClearSearch}
                                    className="text-[#60646c] hover:text-[#171717] dark:hover:text-white cursor-pointer"
                                    title="Clear search"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#a0a4ab] dark:text-[#60646c] bg-black/5 dark:bg-white/5 rounded select-none pointer-events-none">
                                    /
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center h-10 bg-[#f8f8fa] dark:bg-[#151518] p-1 rounded-lg shrink-0">
                        <ViewToggleButton
                            active={viewMode === 'grid'}
                            onClick={setGridView}
                            icon={LayoutGrid}
                            title="Grid View"
                        />
                        <ViewToggleButton
                            active={viewMode === 'list'}
                            onClick={setListView}
                            icon={List}
                            title="List View"
                        />
                    </div>
                </div>

                {isTrash && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-4 bg-[#f8f8fa] dark:bg-[#151518] rounded-xl text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab]">
                        <span>Notes in Trash are automatically deleted after 30 days.</span>
                        {filteredNotes.length > 0 && (
                            <button
                                type="button"
                                onClick={emptyTrash}
                                className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            >
                                Empty Trash
                            </button>
                        )}
                    </div>
                )}

                {allTags && allTags.length > 0 && !isTrash && (
                    <div className="md:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 shrink-0">
                        <button
                            type="button"
                            onClick={() => handleTagSelect(activeTag)}
                            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                                !activeTag
                                    ? "bg-[#171717] dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                                    : "bg-[#f0f0f3] dark:bg-[#18181b] text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white"
                            }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => {
                            const isSelected = activeTag === tag;
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleTagSelect(tag)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
                                        isSelected
                                            ? "bg-[#171717] dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                                            : "bg-[#f0f0f3] dark:bg-[#18181b] text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white"
                                    }`}
                                >
                                    <span className="opacity-60 text-[11px]">#</span>
                                    <span>{tag}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {filteredNotes.length > 0 ? (
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full"
                            : "flex flex-col gap-2.5 w-full"
                    }>
                        {filteredNotes.map((note) => (
                            <NoteCard 
                                key={note.id} 
                                note={note} 
                                viewMode={viewMode} 
                                deleteNote={handleDeleteNote} 
                                onRestore={restoreNote}
                                restoreNote={restoreNote}
                                openModal={openNoteModal} 
                                onOpenModal={openNoteModal}
                                togglePinNote={togglePinNote} 
                                onTogglePin={togglePinNote}
                                onTagClick={handleTagSelect}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center text-center gap-3 select-none">
                        {activeFilter === "trash" ? (
                            <div className="flex flex-col items-center gap-2 max-w-sm">
                                <div className="w-12 h-12 rounded-2xl bg-[#f0f0f3] dark:bg-[#18181b] flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] mb-2">
                                    <Trash2 className="w-6 h-6 text-current" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#171717] dark:text-white">
                                    Trash is empty
                                </h3>
                                <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                                    Notes you delete will stay here for 30 days before being permanently removed.
                                </p>
                            </div>
                        ) : activeFilter === "pinned" ? (
                            <div className="flex flex-col items-center gap-2 max-w-sm">
                                <div className="w-12 h-12 rounded-2xl bg-[#f0f0f3] dark:bg-[#18181b] flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] mb-2">
                                    <Pin className="w-6 h-6 text-current" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#171717] dark:text-white">
                                    No pinned notes
                                </h3>
                                <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                                    Pin important notes to keep them anchored at the top of your workspace.
                                </p>
                            </div>
                        ) : activeTag ? (
                            <div className="flex flex-col items-center gap-2 max-w-sm">
                                <div className="w-12 h-12 rounded-2xl bg-[#f0f0f3] dark:bg-[#18181b] flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] mb-2">
                                    <Hash className="w-6 h-6 text-current" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#171717] dark:text-white">
                                    No notes tagged #{activeTag}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                                    Add #{activeTag} anywhere inside a note to group it under this tag.
                                </p>
                            </div>
                        ) : searchQuery ? (
                            <div className="flex flex-col items-center gap-2 max-w-sm">
                                <div className="w-12 h-12 rounded-2xl bg-[#f0f0f3] dark:bg-[#18181b] flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] mb-2">
                                    <Search className="w-6 h-6 text-current" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#171717] dark:text-white">
                                    No results for &ldquo;{searchQuery}&rdquo;
                                </h3>
                                <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                                    Try adjusting your search query or check for typos.
                                </p>
                                <button
                                    onClick={handleClearSearch}
                                    className="mt-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#171717] dark:text-white bg-[#f0f0f3] dark:bg-[#1e1e24] hover:bg-[#eaebee] dark:hover:bg-[#25252c] transition-colors cursor-pointer"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 max-w-sm">
                                <div className="w-12 h-12 rounded-2xl bg-[#f0f0f3] dark:bg-[#18181b] flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] mb-1">
                                    <FileText className="w-6 h-6 text-current" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-base sm:text-lg font-semibold text-[#171717] dark:text-white">
                                        No notes yet
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                                        Start capturing thoughts, checklists, meeting logs, and markdown ideas.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCreateNewNote()}
                                    className="mt-2 px-4 py-2 rounded-lg text-xs font-medium text-white bg-black hover:bg-[#1a1a1a] dark:text-black dark:bg-white dark:hover:bg-[#f0f0f3] transition-all cursor-pointer shadow-xs active:scale-95"
                                >
                                    + Create Note
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {isModalOpen && selectedNote && (
                <NoteModal 
                    note={selectedNote} 
                    isOpen={isModalOpen}
                    onClose={closeNoteModal} 
                    addNote={hookAddNote}
                    editNote={editNote} 
                    deleteNote={handleDeleteNote} 
                    togglePinNote={togglePinNote} 
                />
            )}

            <ShortcutsModal
                isOpen={isShortcutsOpen}
                onClose={() => setIsShortcutsOpen(false)}
            />
        </div>
    );
};

export default Notes;
