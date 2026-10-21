import { useState, useMemo, useCallback } from "react";
import NoteCard from "../components/Notes/NoteCard";
import NoteModal from "../components/Notes/NoteModal";
import SyncStatusBadge from "../components/Notes/SyncStatusBadge";
import ViewToggleButton from "../components/Notes/ViewToggleButton";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "../hooks/useDebounce";
import { extractTags, stripMarkdown } from "../lib/markdown";
import Fuse from "fuse.js";
import { FileText, Search, LayoutGrid, List, X, Pin, Hash } from "lucide-react";

const Notes = () => {
    const { 
        notes: noteList, 
        syncStatus, 
        pendingCount, 
        addNote: hookAddNote, 
        togglePinNote,
        editNote, 
        deleteNote, 
        retrySync 
    } = useNotes();

    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 200);

    const selectedNote = useMemo(() => {
        if (!selectedNoteId) return null;
        return noteList.find(n => n.id === selectedNoteId) || null;
    }, [noteList, selectedNoteId]);

    const tagCounts = useMemo(() => {
        const counts = {};
        noteList.forEach((note) => {
            const tags = extractTags(`${note.title || ""} ${note.content || ""}`);
            tags.forEach((tag) => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return counts;
    }, [noteList]);

    const allTags = useMemo(() => {
        return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
    }, [tagCounts]);

    const pinnedCount = useMemo(() => {
        return noteList.filter((n) => n.pinned).length;
    }, [noteList]);

    const searchableNotes = useMemo(() => {
        return noteList.map((note) => ({
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

    const handleAddNote = useCallback(() => {
        if (!noteContent.trim() && !noteTitle.trim()) {
            return;
        }
        hookAddNote(noteTitle, noteContent);
        setNoteTitle('');
        setNoteContent('');
    }, [hookAddNote, noteTitle, noteContent]);

    const handleKeyDownCreate = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleAddNote();
        }
    }, [handleAddNote]);

    const openNoteModal = useCallback((note) => {
        setSelectedNoteId(note.id);
        setIsModalOpen(true);
    }, []);

    const closeNoteModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedNoteId(null);
    }, []);

    const handleDeleteNote = useCallback((id) => {
        deleteNote(id);
        setSelectedNoteId((currentId) => {
            if (currentId === id) {
                setIsModalOpen(false);
                return null;
            }
            return currentId;
        });
    }, [deleteNote]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    const handleTagSelect = useCallback((tag) => {
        setSelectedTag((prev) => (prev === tag ? null : tag));
    }, []);

    const setGridView = useCallback(() => setViewMode('grid'), []);
    const setListView = useCallback(() => setViewMode('list'), []);

    const filteredNotes = useMemo(() => {
        const query = debouncedSearchQuery.trim();

        let matched = query
            ? fuseInstance.search(query).map((r) => r.item)
            : noteList;

        if (selectedTag) {
            matched = matched.filter((note) => {
                if (selectedTag === '__pinned__') {
                    return Boolean(note.pinned);
                }
                const noteTags = extractTags(`${note.title || ""} ${note.content || ""}`);
                return noteTags.includes(selectedTag);
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
    }, [noteList, debouncedSearchQuery, selectedTag, fuseInstance]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0e0e11] px-4 sm:px-8 py-8 sm:py-16 text-[#171717] dark:text-[#ededed] transition-colors duration-200 w-full font-sans">
            <div className="flex flex-col gap-10 sm:gap-14 w-full max-w-5xl mx-auto">
                <div className="flex flex-col gap-8 w-full items-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-2xl pb-1 select-none">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] dark:text-white">
                                Workspace
                            </h1>
                            <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] mt-0.5 font-normal">
                                Local-first thought repository. Stored on-device and synced to cloud.
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                            <SyncStatusBadge 
                                status={syncStatus} 
                                pendingCount={pendingCount} 
                                onRetry={retrySync} 
                            />
                            <span className="h-7 inline-flex items-center text-xs text-[#60646c] dark:text-[#a0a4ab] font-medium bg-[#f0f0f3] dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] px-3 rounded-full whitespace-nowrap shrink-0">
                                {noteList.length} {noteList.length === 1 ? 'Note' : 'Notes'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] hover:border-black/20 dark:hover:border-[#383842] rounded-3xl p-6 sm:p-7 flex flex-col gap-3.5 w-full max-w-2xl transition-all duration-200 shadow-xs focus-within:border-black/40 dark:focus-within:border-white/40">
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            onKeyDown={handleKeyDownCreate}
                            placeholder="Note title..."
                            className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-white placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent"
                        />
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            onKeyDown={handleKeyDownCreate}
                            placeholder="Write in markdown... Use - [ ] for checklists, ## for headings, > for quotes"
                            rows={3}
                            className="text-sm sm:text-base text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent resize-none min-h-[90px] leading-relaxed font-normal"
                        />
                        
                        <div className="flex justify-between items-center pt-3 border-t border-[#f0f0f3] dark:border-[#27272a]">
                            <span className="text-xs text-[#60646c] dark:text-[#a0a4ab]">
                                Press <kbd className="px-2 py-0.5 rounded-full bg-[#f0f0f3] dark:bg-[#111113] border border-[#dcdee0] dark:border-[#27272a] text-[11px] font-mono">Ctrl+Enter</kbd> to save
                            </span>
                            <button
                                className="bg-[#000000] hover:bg-[#1f1f1f] text-white dark:bg-white dark:hover:bg-[#f0f0f3] dark:text-black px-5 py-2 rounded-full font-semibold text-xs tracking-tight transition-all cursor-pointer active:scale-95 shadow-xs"
                                onClick={handleAddNote}
                            >
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full pb-1">
                        <h2 className="text-sm font-semibold text-[#60646c] dark:text-[#a0a4ab] select-none">
                            All Notes ({filteredNotes.length})
                        </h2>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-72 h-11 flex items-center">
                                <Search className="w-4 h-4 text-[#60646c] dark:text-[#a0a4ab] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes..."
                                    className="w-full h-full bg-[#f0f0f3] dark:bg-[#161619] hover:bg-[#eaebee] dark:hover:bg-[#1e1e22] focus:bg-white dark:focus:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] focus:border-black/40 dark:focus:border-white/40 rounded-full pl-10 pr-9 text-sm text-[#171717] dark:text-[#ededed] placeholder-[#60646c] dark:placeholder-[#a0a4ab] focus:outline-none transition-all shadow-xs"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={handleClearSearch}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#60646c] hover:text-[#171717] dark:hover:text-white cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center h-11 bg-[#f0f0f3] dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] p-1 rounded-full shrink-0">
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
                    </div>

                    {(allTags.length > 0 || pinnedCount > 0) && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none w-full">
                            <button
                                type="button"
                                onClick={() => setSelectedTag(null)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                    !selectedTag
                                        ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold"
                                        : "bg-[#f0f0f3] dark:bg-[#161619] text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white border border-[#dcdee0] dark:border-[#27272a]"
                                }`}
                            >
                                All Notes
                                <span className="opacity-70 text-[11px]">({noteList.length})</span>
                            </button>

                            {pinnedCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedTag(selectedTag === "__pinned__" ? null : "__pinned__")}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                        selectedTag === "__pinned__"
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold"
                                            : "bg-[#f0f0f3] dark:bg-[#161619] text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white border border-[#dcdee0] dark:border-[#27272a]"
                                    }`}
                                >
                                    <Pin className={`w-3 h-3 ${selectedTag === "__pinned__" ? "fill-current" : ""}`} />
                                    Pinned
                                    <span className="opacity-70 text-[11px]">({pinnedCount})</span>
                                </button>
                            )}

                            {allTags.map((tag) => {
                                const isSelected = selectedTag === tag;
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleTagSelect(tag)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                            isSelected
                                                ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold"
                                                : "bg-[#f0f0f3] dark:bg-[#161619] text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white border border-[#dcdee0] dark:border-[#27272a]"
                                        }`}
                                    >
                                        <Hash className="w-3 h-3 opacity-60" />
                                        {tag}
                                        <span className="opacity-70 text-[11px]">({tagCounts[tag]})</span>
                                    </button>
                                );
                            })}

                            {(selectedTag || debouncedSearchQuery) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedTag(null);
                                        setSearchQuery("");
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 dark:bg-red-500/10 transition-all cursor-pointer whitespace-nowrap shrink-0 ml-auto"
                                >
                                    <X className="w-3 h-3" />
                                    Reset
                                </button>
                            )}
                        </div>
                    )}

                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
                            : "flex flex-col gap-3 w-full"
                    }>
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <NoteCard 
                                    key={note.id} 
                                    note={note} 
                                    viewMode={viewMode} 
                                    deleteNote={handleDeleteNote} 
                                    onOpenModal={openNoteModal}
                                    onTogglePin={togglePinNote}
                                    onTagClick={handleTagSelect}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center select-none bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] rounded-3xl p-8 shadow-xs">
                                <div className="w-12 h-12 rounded-2xl bg-[#f0f0f3] dark:bg-[#111113] border border-[#dcdee0] dark:border-[#27272a] flex items-center justify-center mb-4">
                                    <FileText className="w-5 h-5 text-[#60646c] dark:text-[#a0a4ab]" />
                                </div>
                                <h3 className="text-base font-semibold text-[#171717] dark:text-white">
                                    {debouncedSearchQuery || selectedTag 
                                        ? `No notes matched your filter` 
                                        : "Your workspace is waiting"}
                                </h3>
                                <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] max-w-sm mt-1.5 leading-relaxed">
                                    {debouncedSearchQuery || selectedTag 
                                        ? "Try selecting a different tag, clearing your search query, or creating a new note." 
                                        : "Jot down your first thought above or press Ctrl+Enter to save a quick note."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <NoteModal
                note={selectedNote}
                isOpen={isModalOpen}
                onClose={closeNoteModal}
                editNote={editNote}
                deleteNote={handleDeleteNote}
                togglePinNote={togglePinNote}
            />
        </div>
    );
};

export default Notes;
