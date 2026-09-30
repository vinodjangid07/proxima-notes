import { useEffect, useState, useCallback, useRef } from "react";
import NoteCard from "../components/Notes/NoteCard";
import { dbGetNotes, dbAddNote, dbUpdateNote, dbDeleteNote } from "../services/notesServices";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";
import SyncStatusBadge from "../components/Notes/SyncStatusBadge";
import { FileText } from "lucide-react";

const Notes = () => {
    const { currentUser, loading } = useAuth();
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteList, setNoteList] = useState(() => {
        const savedNotes = localStorage.getItem('Notes List');
        return savedNotes ? JSON.parse(savedNotes) : [];
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
        setNoteList((prevList) => [...prevList, { id: randomId, userId: currentUser?.uid || 'guest', title: noteTitle, content: noteContent }]);
        if (currentUser) {
            dbAddNote(randomId, currentUser.uid, noteTitle, noteContent).catch(err => console.error(err))
        }
        setNoteTitle('');
        setNoteContent('');
        toast.success("Note added!")
    }

    const editNote = useCallback((id, newTitle, newContent) => {
        setNoteList((prevList) => prevList.map((note) => note.id === id ? { ...note, title: newTitle, content: newContent } : note));

        if (currentUser) {
            dbUpdateNote(id, newTitle, newContent).then(() => {
                toast.success("Note updated!")
            }).catch(err => {
                toast.error("Failed to edit!");
                console.error(err);
            })
        }
        else{
            toast.success("Note updated! (locally)");
        }

    }, [currentUser])

    const deleteNote = useCallback((id) => {
        setNoteList((prevList) => prevList.filter((note) => note.id !== id));
        if (currentUser) {
            dbDeleteNote(id).then(() => {
                toast.success("Note deleted!");
            }).catch(err => {
                toast.error("Failed to delete!");
                console.error(err);
            })
        }
        else {
            toast.success("Note deleted! (locally)");
        }

    }, [currentUser])

    useEffect(() => {
        localStorage.setItem('Notes List', JSON.stringify(noteList));
    }, [noteList]);

    useEffect(() => {
        const clearNotesOnLogout = () => {
            setNoteList([]);
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
                const unsynced = currentNotes.filter((note) => note.userId !== currentUser.uid);
                for (const note of unsynced) {
                    await dbAddNote(note.id, currentUser.uid, note.title, note.content);
                }
            }
            const serverNotes = await dbGetNotes(currentUser.uid);
            setNoteList(serverNotes);
        };

        loadAndSyncNotes().catch(err => console.error("Sync/Fetch error:", err));

        const handleOnline = () => {
            loadAndSyncNotes().catch(err => console.error("Sync/Fetch error on online:", err));
        };

        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);

    }, [currentUser, loading]);



    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 sm:px-8 py-8 sm:py-16 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 w-full">
            <div className="flex flex-col gap-10 sm:gap-14 w-full max-w-5xl mx-auto">


                <div className="flex flex-col gap-8 w-full items-center">
                    <div className="w-full flex justify-between items-center max-w-xl pb-2 select-none">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Personal Workspace</h1>
                        <div className="flex items-center gap-3">
                            <SyncStatusBadge />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                                {noteList.length} {noteList.length === 1 ? 'Note' : 'Notes'}
                            </span>
                        </div>
                    </div>

                    <div className="group bg-zinc-50 dark:bg-zinc-900/40 focus-within:bg-zinc-100 dark:focus-within:bg-zinc-800/60 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-4 w-full max-w-2xl transition-all duration-300 shadow-sm focus-within:shadow-md relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-focus-within:opacity-10 transition-opacity duration-500 pointer-events-none">
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900 dark:text-white"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </div>

                        <div className="flex items-center gap-2 mb-2 opacity-50">
                            <div className="h-px w-6 bg-zinc-400 dark:bg-zinc-600"></div>
                            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] font-mono">
                                Create
                            </span>
                        </div>

                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="Note Title"
                            className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none w-full relative z-10"
                        />
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Start typing your thoughts..."
                            rows={3}
                            className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none w-full resize-none min-h-[100px] leading-relaxed relative z-10"
                        />
                        
                        <div className="flex justify-between items-center mt-0 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 relative z-10">
                            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500 hidden sm:inline-block">
                                Local-first workspace
                            </span>
                            <button
                                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-3 rounded-xl font-semibold text-xs transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ml-auto sm:ml-0"
                                onClick={addNote}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col gap-6 w-full">
                    <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em] pl-1 select-none">All Notes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {noteList.length > 0 ? (
                            noteList.map((note) => (
                                <NoteCard key={note.id} note={note} editNote={editNote} deleteNote={deleteNote} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center select-none animate-in fade-in duration-200">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                                    <FileText className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No notes yet</h3>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-[240px] mt-1 leading-relaxed">
                                    Start writing above to create your first note.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notes