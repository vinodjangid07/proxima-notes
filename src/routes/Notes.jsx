import { useState, useMemo, useCallback } from "react";
import NoteCard from "../components/Notes/NoteCard";
import NoteModal from "../components/Notes/NoteModal";
import SyncStatusBadge from "../components/Notes/SyncStatusBadge";
import ViewToggleButton from "../components/Notes/ViewToggleButton";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "../hooks/useDebounce";
import { FileText, Search, LayoutGrid, List, X } from "lucide-react";

const Notes = () => {
    const { 
        notes: noteList, 
        syncStatus, 
        pendingCount, 
        addNote: hookAddNote, 
        editNote, 
        deleteNote, 
        retrySync 
    } = useNotes();

    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce search query to prevent excessive filtering during rapid typing
    const debouncedSearchQuery = useDebounce(searchQuery, 200);

    // Derived selected note: Automatically stays in sync with real-time onSnapshot updates
    const selectedNote = useMemo(() => {
        if (!selectedNoteId) return null;
        return noteList.find(n => n.id === selectedNoteId) || null;
    }, [noteList, selectedNoteId]);

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

    // Stable callbacks for NoteCard memoization
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

    const setGridView = useCallback(() => setViewMode('grid'), []);
    const setListView = useCallback(() => setViewMode('list'), []);

    const filteredNotes = useMemo(() => {
        const query = debouncedSearchQuery.trim().toLowerCase();
        if (!query) return noteList;
        return noteList.filter(
            note => (note.title && note.title.toLowerCase().includes(query)) || 
                    (note.content && note.content.toLowerCase().includes(query))
        );
    }, [noteList, debouncedSearchQuery]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214] px-4 sm:px-8 py-8 sm:py-16 text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200 w-full font-sans">
            <div className="flex flex-col gap-10 sm:gap-14 w-full max-w-5xl mx-auto">

                {/* Header & Quick Creator */}
                <div className="flex flex-col gap-8 w-full items-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-2xl pb-1 select-none">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5]">
                                Workspace
                            </h1>
                            <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] mt-0.5">
                                Local-first thought repository. Stored on-device and synced to cloud.
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                            <SyncStatusBadge 
                                status={syncStatus} 
                                pendingCount={pendingCount} 
                                onRetry={retrySync} 
                            />
                            <span className="h-7 inline-flex items-center text-xs text-[#52525b] dark:text-[#a1a1aa] font-medium bg-[#f4f4f5] dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] px-3 rounded-full whitespace-nowrap shrink-0">
                                {noteList.length} {noteList.length === 1 ? 'Note' : 'Notes'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Creator */}
                    <div className="bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-xl p-6 sm:p-7 flex flex-col gap-3 w-full max-w-2xl transition-all duration-200 shadow-xs focus-within:border-[#5645d4] dark:focus-within:border-[#5645d4]">
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            onKeyDown={handleKeyDownCreate}
                            placeholder="Note title..."
                            className="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5] placeholder-[#a1a1aa] dark:placeholder-[#71717a] focus:outline-none w-full bg-transparent"
                        />
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            onKeyDown={handleKeyDownCreate}
                            placeholder="Write in markdown... Use - [ ] for checklists, ## for headings, > for quotes"
                            rows={3}
                            className="text-sm sm:text-base text-[#18181b] dark:text-[#e4e4e7] placeholder-[#a1a1aa] dark:placeholder-[#71717a] focus:outline-none w-full bg-transparent resize-none min-h-[90px] leading-relaxed font-normal"
                        />
                        
                        <div className="flex justify-between items-center pt-2 border-t border-[#f4f4f5] dark:border-[#27272a]">
                            <span className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                                Press <kbd className="px-1.5 py-0.5 rounded-sm bg-[#f4f4f5] dark:bg-[#121214] border border-[#e4e4e7] dark:border-[#2e2e34] text-[11px] font-mono">Ctrl+Enter</kbd> to save
                            </span>
                            <button
                                className="bg-[#5645d4] hover:bg-[#4534b3] text-white px-5 py-2 rounded-md font-medium text-xs sm:text-sm transition-colors cursor-pointer active:scale-95 shadow-xs"
                                onClick={handleAddNote}
                            >
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>

                {/* Toolbar & Controls */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full pb-1">
                        <h2 className="text-sm font-semibold text-[#52525b] dark:text-[#a1a1aa] select-none">
                            All Notes ({filteredNotes.length})
                        </h2>

                        {/* Search & View Controls */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial sm:w-64 h-10 flex items-center">
                                <Search className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes by title or content..."
                                    className="w-full h-full bg-[#f4f4f5] dark:bg-[#1c1c1f] hover:bg-[#edece9] dark:hover:bg-[#242429] focus:bg-white dark:focus:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] focus:border-[#5645d4] dark:focus:border-[#5645d4] rounded-md pl-10 pr-8 text-sm text-[#18181b] dark:text-[#f4f4f5] placeholder-[#71717a] dark:placeholder-[#a1a1aa] focus:outline-none transition-all"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#18181b] dark:hover:text-[#f4f4f5] cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center h-10 bg-[#f4f4f5] dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] p-1 rounded-md shrink-0">
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

                    {/* Notes Grid / List */}
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
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center select-none bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-xl p-8">
                                <div className="w-12 h-12 rounded-full bg-[#f4f4f5] dark:bg-[#121214] border border-[#e4e4e7] dark:border-[#2e2e34] flex items-center justify-center mb-4">
                                    <FileText className="w-5 h-5 text-[#71717a] dark:text-[#a1a1aa]" />
                                </div>
                                <h3 className="text-base font-semibold text-[#18181b] dark:text-[#f4f4f5]">
                                    {debouncedSearchQuery ? `No notes matched "${debouncedSearchQuery}"` : "Your workspace is waiting"}
                                </h3>
                                <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] max-w-sm mt-1 leading-relaxed">
                                    {debouncedSearchQuery ? "Try searching for a different keyword or clear the filter." : "Jot down your first thought above or press Ctrl+Enter to save a quick note."}
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
            />
        </div>
    );
};

export default Notes;
