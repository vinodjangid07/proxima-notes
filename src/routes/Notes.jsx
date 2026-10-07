import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import NoteCard from "../components/Notes/NoteCard";
import NoteModal from "../components/Notes/NoteModal";
import { dbGetNotes, dbAddNote, dbUpdateNote, dbDeleteNote } from "../services/notesServices";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";
import SyncStatusBadge from "../components/Notes/SyncStatusBadge";
import { FileText, Search, LayoutGrid, List, X } from "lucide-react";

const DEFAULT_DEMO_NOTES = [
    {
        id: "demo-note-1",
        userId: "guest",
        title: "Welcome to Proxima Notes ✨",
        content: "A distraction-free, local-first workspace. Notes are saved instantly in your browser cache and sync to the cloud when online.\n\nClick any note to open the full reader and auto-save editor view!",
        createdAt: new Date().toISOString()
    },
    {
        id: "demo-note-2",
        userId: "guest",
        title: "Productivity & Focus",
        content: "“Simplicity is about subtracting the obvious and adding the meaningful.” — John Maeda\n\nDraft quick thoughts, organize ideas, and switch seamlessly between grid and list views.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
    }
];

const Notes = () => {
    const { currentUser, loading } = useAuth();
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [noteList, setNoteList] = useState(() => {
        const savedNotes = localStorage.getItem('Notes List');
        if (savedNotes) {
            try {
                const parsed = JSON.parse(savedNotes);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse saved notes", e);
            }
        }
        return DEFAULT_DEMO_NOTES;
    });

    const noteListRef = useRef(noteList);
    useEffect(() => {
        noteListRef.current = noteList;
    }, [noteList]);

    const addNote = () => {
        if (!noteContent.trim() && !noteTitle.trim()) {
            return;
        }
        const randomId = crypto.randomUUID();
        const newNote = {
            id: randomId,
            userId: currentUser?.uid || 'guest',
            title: noteTitle,
            content: noteContent,
            createdAt: new Date().toISOString()
        };

        setNoteList((prevList) => [newNote, ...prevList]);

        if (currentUser) {
            dbAddNote(randomId, currentUser.uid, noteTitle, noteContent).catch(err => console.error(err));
        }

        setNoteTitle('');
        setNoteContent('');
        toast.success("Note added!");
    };

    const handleKeyDownCreate = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            addNote();
        }
    };

    const editNote = useCallback((id, newTitle, newContent) => {
        setNoteList((prevList) => prevList.map((note) => 
            note.id === id ? { ...note, title: newTitle, content: newContent } : note
        ));

        setSelectedNote((prev) => prev && prev.id === id ? { ...prev, title: newTitle, content: newContent } : prev);

        if (currentUser) {
            dbUpdateNote(id, newTitle, newContent).catch(err => {
                toast.error("Failed to sync edit!");
                console.error(err);
            });
        }
    }, [currentUser]);

    const deleteNote = useCallback((id) => {
        setNoteList((prevList) => prevList.filter((note) => note.id !== id));

        if (selectedNote && selectedNote.id === id) {
            setIsModalOpen(false);
            setSelectedNote(null);
        }

        if (currentUser) {
            dbDeleteNote(id).then(() => {
                toast.success("Note deleted!");
            }).catch(err => {
                toast.error("Failed to delete!");
                console.error(err);
            });
        } else {
            toast.success("Note deleted! (locally)");
        }
    }, [currentUser, selectedNote]);

    const openNoteModal = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    const closeNoteModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    useEffect(() => {
        localStorage.setItem('Notes List', JSON.stringify(noteList));
    }, [noteList]);

    useEffect(() => {
        const clearNotesOnLogout = () => {
            setNoteList(DEFAULT_DEMO_NOTES);
        };

        window.addEventListener("local-logout", clearNotesOnLogout);
        return () => window.removeEventListener("local-logout", clearNotesOnLogout);
    }, []);

    useEffect(() => {
        if (loading) return;

        const loadAndSyncNotes = async () => {
            if (!currentUser || !navigator.onLine) {
                return;
            }

            const currentNotes = noteListRef.current;
            if (currentNotes.length > 0) {
                const unsynced = currentNotes.filter((note) => note.userId !== currentUser.uid && !note.id.startsWith("demo-note-"));
                for (const note of unsynced) {
                    await dbAddNote(note.id, currentUser.uid, note.title, note.content);
                }
            }
            const serverNotes = await dbGetNotes(currentUser.uid);
            if (serverNotes && serverNotes.length > 0) {
                setNoteList(serverNotes);
            }
        };

        loadAndSyncNotes().catch(err => console.error("Sync/Fetch error:", err));

        const handleOnline = () => {
            loadAndSyncNotes().catch(err => console.error("Sync/Fetch error on online:", err));
        };

        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, [currentUser, loading]);

    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) return noteList;
        const query = searchQuery.toLowerCase();
        return noteList.filter(
            note => (note.title && note.title.toLowerCase().includes(query)) || 
                    (note.content && note.content.toLowerCase().includes(query))
        );
    }, [noteList, searchQuery]);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 sm:px-8 py-8 sm:py-16 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 w-full">
            <div className="flex flex-col gap-10 sm:gap-14 w-full max-w-5xl mx-auto">

                {/* Header & Quick Creator */}
                <div className="flex flex-col gap-8 w-full items-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-2xl pb-1 select-none">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Personal Workspace
                        </h1>
                        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                            <SyncStatusBadge />
                            <span className="h-7 inline-flex items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium bg-zinc-100 dark:bg-zinc-900 px-3 rounded-full whitespace-nowrap shrink-0">
                                {noteList.length} {noteList.length === 1 ? 'Note' : 'Notes'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Creator */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 focus-within:bg-zinc-100/90 dark:focus-within:bg-zinc-900/80 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-4 w-full max-w-2xl transition-all duration-300 relative overflow-hidden">
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            onKeyDown={handleKeyDownCreate}
                            placeholder="Note Title"
                            className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none w-full bg-transparent"
                        />
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            onKeyDown={handleKeyDownCreate}
                            placeholder="Start typing your thoughts..."
                            rows={3}
                            className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none w-full bg-transparent resize-none min-h-[100px] leading-relaxed font-normal"
                        />
                        
                        <div className="flex justify-end items-center pt-1">
                            <button
                                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 cursor-pointer active:scale-95"
                                onClick={addNote}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Toolbar & Controls */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full pb-1">
                        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 select-none">
                            Notes ({filteredNotes.length})
                        </h2>

                        {/* Search & View Controls */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial sm:w-64 h-10 flex items-center">
                                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes..."
                                    className="w-full h-full bg-zinc-100 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:bg-zinc-100 dark:focus:bg-zinc-900 rounded-xl pl-10 pr-8 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-all"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center h-10 bg-zinc-100 dark:bg-zinc-900/60 p-1 rounded-xl shrink-0">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`h-full aspect-square flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`h-full aspect-square flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                    }`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notes Grid / List */}
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                            : "flex flex-col gap-4 w-full"
                    }>
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <NoteCard 
                                    key={note.id} 
                                    note={note} 
                                    viewMode={viewMode}
                                    deleteNote={deleteNote} 
                                    onOpenModal={openNoteModal}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center select-none animate-in fade-in duration-200">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                                    <FileText className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                                    {searchQuery ? "No matching notes" : "No notes yet"}
                                </h3>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-[240px] mt-1 leading-relaxed">
                                    {searchQuery ? "Try searching for another keyword" : "Start writing above to create your first note."}
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
                deleteNote={deleteNote}
            />
        </div>
    );
};

export default Notes;
