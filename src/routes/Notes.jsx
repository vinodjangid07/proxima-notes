import { useEffect, useState, useCallback, useRef } from "react";
import NoteCard from "../components/Notes/NoteCard";
import { dbGetNotes, dbAddNote, dbUpdateNote, dbDeleteNote } from "../services/notesServices";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";

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
            <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto">

                <div className="flex flex-col gap-6 sm:gap-8 w-full items-center">
                    <div className="w-full flex justify-between items-center max-w-lg border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">Personal Workspace</h1>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                            {noteList.length} Notes
                        </span>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 w-full max-w-lg transition-all duration-200 shadow-sm focus-within:shadow-md focus-within:border-zinc-300 dark:focus-within:border-zinc-700">
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="Title"
                            className="bg-transparent text-base font-semibold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none w-full"
                        />
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Take a note..."
                            rows={3}
                            className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none w-full resize-none min-h-[80px]"
                        />
                        <div className="flex justify-between items-center pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">Draft saved locally</span>
                            <button
                                className="bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-5 py-2 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer"
                                onClick={addNote}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes Grid Layout */}
                <div className="flex flex-col gap-4 w-full">
                    <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">All Notes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {noteList.length > 0 ? (
                            noteList.map((note) => (
                                <NoteCard key={note.id} note={note} editNote={editNote} deleteNote={deleteNote} />
                            ))
                        ) : (
                            <div className="col-span-full text-zinc-400 dark:text-zinc-500 text-base text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/5">
                                No notes found in workspace. Create one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notes