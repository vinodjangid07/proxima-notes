import { useState, useEffect, useCallback, useRef } from "react";
import { dbLocal, migrateFromLocalStorage } from "../lib/db";
import { 
    subscribeToUserNotes, 
    dbAddNote, 
    dbUpdateNote, 
    dbDeleteNote 
} from "../services/notesServices";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";

export const DEFAULT_DEMO_NOTES = [
    {
        id: "demo-note-1",
        userId: "guest",
        title: "Welcome to Proxima Notes",
        content: "A distraction-free, local-first workspace with live markdown support.\n\n### Quick Start\n- [x] Create a note without signing up\n- [ ] Try Markdown formatting (**bold**, *italic*, `code`)\n- [ ] Toggle Zen mode using the expand icon in the top right\n- [ ] Sign in to sync across devices in real time\n\n> Simplicity is about subtracting the obvious and adding the meaningful.",
        createdAt: new Date().toISOString()
    },
    {
        id: "demo-note-2",
        userId: "guest",
        title: "Markdown & Code Snippet",
        content: "Proxima Notes formats your code and checklists automatically:\n\n```javascript\nconst workspace = {\n  localFirst: true,\n  realtimeSync: true,\n  zenMode: 'active'\n};\n```\n\nSwitch to **Preview** or **Split** mode above to inspect live formatting.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
    }
];

const sortNotesDesc = (list) => {
    return [...list].sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
    });
};

/**
 * Intelligent queue coalescing:
 * Ensures only 1 operation exists in syncQueue per noteId.
 * - Editing the same note offline multiple times updates the existing pending edit with the latest payload.
 * - Editing a note created offline updates the pending add's payload.
 * - Deleting a note created offline removes it entirely from syncQueue (never hits cloud).
 */
const queueOrUpdateSyncAction = async (action, noteId, payload) => {
    try {
        const existingItems = await dbLocal.syncQueue
            .where("noteId")
            .equals(noteId)
            .toArray();

        if (existingItems.length > 0) {
            const existing = existingItems[0];
            if (existing.action === "add") {
                if (action === "update") {
                    // Update the payload of the pending add with latest edits
                    await dbLocal.syncQueue.update(existing.id, {
                        payload: { ...existing.payload, ...payload },
                        timestamp: Date.now()
                    });
                    return;
                } else if (action === "delete") {
                    // Created offline and deleted offline: never touch cloud!
                    await dbLocal.syncQueue.delete(existing.id);
                    return;
                }
            } else if (existing.action === "update") {
                if (action === "update") {
                    // Overwrite with the latest update payload
                    await dbLocal.syncQueue.update(existing.id, {
                        payload: { ...existing.payload, ...payload },
                        timestamp: Date.now()
                    });
                    return;
                } else if (action === "delete") {
                    // Was updated, now deleted: convert action to delete
                    await dbLocal.syncQueue.update(existing.id, {
                        action: "delete",
                        payload: null,
                        timestamp: Date.now()
                    });
                    return;
                }
            } else if (existing.action === "delete") {
                // Already queued for deletion; ignore subsequent edits
                return;
            }
        }

        // Add new queue item if no existing operation found
        await dbLocal.syncQueue.add({
            noteId,
            action,
            payload,
            timestamp: Date.now()
        });
    } catch (err) {
        console.error("Failed to queue sync action:", err);
    }
};

export const useNotes = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState("synced"); // 'synced' | 'syncing' | 'offline' | 'error'
    const [pendingCount, setPendingCount] = useState(0);

    const isOnlineRef = useRef(navigator.onLine);
    const notesRef = useRef(notes);
    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    // Update pending queue count helper (counts distinct pending notes)
    const refreshPendingCount = useCallback(async () => {
        try {
            const queueItems = await dbLocal.syncQueue.toArray();
            const distinctNotes = new Set(queueItems.map(item => item.noteId));
            setPendingCount(distinctNotes.size);
            return distinctNotes.size;
        } catch {
            return 0;
        }
    }, []);

    // Process pending offline sync queue
    const processSyncQueue = useCallback(async () => {
        if (!currentUser || !navigator.onLine) return;
        try {
            const queueItems = await dbLocal.syncQueue.toArray();
            if (queueItems.length === 0) {
                setPendingCount(0);
                return;
            }

            setSyncStatus("syncing");
            for (const item of queueItems) {
                try {
                    if (item.action === "add") {
                        await dbAddNote(
                            item.noteId, 
                            currentUser.uid, 
                            item.payload.title, 
                            item.payload.content, 
                            item.payload.createdAt
                        );
                    } else if (item.action === "update") {
                        await dbUpdateNote(
                            item.noteId, 
                            item.payload.title, 
                            item.payload.content
                        );
                    } else if (item.action === "delete") {
                        await dbDeleteNote(item.noteId);
                    }
                    await dbLocal.syncQueue.delete(item.id);
                } catch (err) {
                    console.error("Failed to sync queue item:", item, err);
                }
            }

            const remainingItems = await dbLocal.syncQueue.toArray();
            const remainingCount = new Set(remainingItems.map(i => i.noteId)).size;
            setPendingCount(remainingCount);
            if (remainingCount === 0) {
                setSyncStatus("synced");
                toast.success("All pending offline changes synchronized!");
            } else {
                setSyncStatus("error");
            }
        } catch (err) {
            console.error("Error processing sync queue:", err);
            setSyncStatus("error");
        }
    }, [currentUser]);

    // Initial load & Guest mode handling
    useEffect(() => {
        let isMounted = true;

        const initNotes = async () => {
            await migrateFromLocalStorage();

            if (authLoading) return;

            if (!currentUser) {
                // GUEST MODE: Load from Dexie notes where userId is guest
                try {
                    const localNotes = await dbLocal.notes
                        .where("userId")
                        .equals("guest")
                        .toArray();

                    if (isMounted) {
                        if (localNotes.length > 0) {
                            setNotes(sortNotesDesc(localNotes));
                        } else {
                            // Seed default demo notes
                            await dbLocal.notes.bulkPut(DEFAULT_DEMO_NOTES);
                            setNotes(DEFAULT_DEMO_NOTES);
                        }
                        setSyncStatus(navigator.onLine ? "synced" : "offline");
                        setLoading(false);
                    }
                } catch (err) {
                    console.error("Failed to read local guest notes from Dexie:", err);
                    if (isMounted) {
                        setNotes(DEFAULT_DEMO_NOTES);
                        setLoading(false);
                    }
                }
            }
        };

        initNotes();

        return () => {
            isMounted = false;
        };
    }, [currentUser, authLoading]);

    // Authenticated Mode: Migration + Real-Time onSnapshot Subscription
    useEffect(() => {
        if (authLoading || !currentUser) return;

        let unsubscribeSnapshot = null;
        let isMounted = true;

        const setupAuthSync = async () => {
            setLoading(true);
            setSyncStatus("syncing");

            try {
                // 1. Check if there are unmigrated guest notes to upload to this account
                const guestNotes = await dbLocal.notes
                    .where("userId")
                    .equals("guest")
                    .toArray();

                const unsyncedGuests = guestNotes.filter(
                    n => !n.id.startsWith("demo-note-")
                );

                if (unsyncedGuests.length > 0 && navigator.onLine) {
                    for (const gNote of unsyncedGuests) {
                        await dbAddNote(
                            gNote.id,
                            currentUser.uid,
                            gNote.title,
                            gNote.content,
                            gNote.createdAt
                        );
                        // Update local Dexie record ownership to current user
                        await dbLocal.notes.update(gNote.id, { userId: currentUser.uid });
                    }
                    toast.info(`${unsyncedGuests.length} local note(s) saved to your account!`);
                }

                // Process any offline queue items
                await processSyncQueue();

                // 2. Subscribe to real-time Firestore updates (Live multi-device sync)
                unsubscribeSnapshot = subscribeToUserNotes(
                    currentUser.uid,
                    async (serverNotes) => {
                        if (!isMounted) return;

                        // Bulk put server notes to Dexie
                        if (serverNotes.length > 0) {
                            await dbLocal.notes.bulkPut(serverNotes);
                        }

                        // Remove locally cached notes for this user that were deleted from server,
                        // but preserve any notes that are currently pending in the offline sync queue
                        const serverIds = new Set(serverNotes.map(n => n.id));
                        const localUserNotes = await dbLocal.notes
                            .where("userId")
                            .equals(currentUser.uid)
                            .toArray();

                        const pendingQueue = await dbLocal.syncQueue.toArray();
                        const pendingNoteIds = new Set(pendingQueue.map(item => item.noteId));

                        for (const lNote of localUserNotes) {
                            if (!serverIds.has(lNote.id) && !pendingNoteIds.has(lNote.id)) {
                                await dbLocal.notes.delete(lNote.id);
                            }
                        }

                        // Seamlessly include pending offline notes so they don't flicker during sync
                        const pendingAdds = localUserNotes.filter(
                            lNote => !serverIds.has(lNote.id) && pendingNoteIds.has(lNote.id)
                        );
                        const mergedNotes = [...serverNotes, ...pendingAdds];

                        const sorted = sortNotesDesc(mergedNotes);
                        setNotes(sorted);
                        setSyncStatus(pendingNoteIds.size > 0 ? "offline" : "synced");
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Subscription error:", error);
                        if (!navigator.onLine) {
                            setSyncStatus("offline");
                        } else {
                            setSyncStatus("error");
                        }
                        setLoading(false);
                    }
                );
            } catch (err) {
                console.error("Auth sync setup error:", err);
                setSyncStatus("error");
                setLoading(false);
            }
        };

        setupAuthSync();

        return () => {
            isMounted = false;
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        };
    }, [currentUser, authLoading, processSyncQueue]);

    // Network connection and logout listeners
    useEffect(() => {
        const handleOnline = () => {
            isOnlineRef.current = true;
            if (currentUser) {
                processSyncQueue();
            } else {
                setSyncStatus("synced");
            }
        };

        const handleOffline = () => {
            isOnlineRef.current = false;
            setSyncStatus("offline");
        };

        const handleLogout = async () => {
            // Reset to guest demo notes cleanly
            try {
                const guestNotes = await dbLocal.notes
                    .where("userId")
                    .equals("guest")
                    .toArray();

                if (guestNotes.length > 0) {
                    setNotes(sortNotesDesc(guestNotes));
                } else {
                    await dbLocal.notes.bulkPut(DEFAULT_DEMO_NOTES);
                    setNotes(DEFAULT_DEMO_NOTES);
                }
            } catch {
                setNotes(DEFAULT_DEMO_NOTES);
            }
            setSyncStatus(navigator.onLine ? "synced" : "offline");
            setPendingCount(0);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        window.addEventListener("local-logout", handleLogout);

        let isMounted = true;
        const fetchInitialPending = async () => {
            try {
                const queueItems = await dbLocal.syncQueue.toArray();
                const distinctNotes = new Set(queueItems.map(item => item.noteId));
                if (isMounted) setPendingCount(distinctNotes.size);
            } catch {
                // ignore
            }
        };
        fetchInitialPending();

        return () => {
            isMounted = false;
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("local-logout", handleLogout);
        };
    }, [currentUser, processSyncQueue]);

    // Keep localStorage in sync as a fallback backup
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem("Notes List", JSON.stringify(notes));
        }
    }, [notes]);

    // Action: Add Note
    const addNote = useCallback(async (title, content) => {
        if (!title.trim() && !content.trim()) return null;

        const randomId = crypto.randomUUID();
        const newNote = {
            id: randomId,
            userId: currentUser ? currentUser.uid : "guest",
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Optimistic UI update
        setNotes((prev) => [newNote, ...prev]);

        // Save to Dexie
        await dbLocal.notes.put(newNote);

        if (currentUser) {
            if (navigator.onLine) {
                setSyncStatus("syncing");
                dbAddNote(randomId, currentUser.uid, newNote.title, newNote.content, newNote.createdAt)
                    .then(() => setSyncStatus("synced"))
                    .catch(async (err) => {
                        console.error("Online add failed, queuing offline:", err);
                        await queueOrUpdateSyncAction("add", randomId, newNote);
                        refreshPendingCount();
                        setSyncStatus("offline");
                    });
            } else {
                await queueOrUpdateSyncAction("add", randomId, newNote);
                refreshPendingCount();
                setSyncStatus("offline");
            }
        }

        toast.success("Note added!");
        return newNote;
    }, [currentUser, refreshPendingCount]);

    // Action: Edit Note
    const editNote = useCallback(async (id, newTitle, newContent) => {
        const updatedAt = new Date().toISOString();

        // Optimistic UI update
        setNotes((prevList) =>
            prevList.map((note) =>
                note.id === id ? { ...note, title: newTitle, content: newContent, updatedAt } : note
            )
        );

        // Update Dexie
        await dbLocal.notes.update(id, {
            title: newTitle,
            content: newContent,
            updatedAt
        });

        if (currentUser) {
            if (navigator.onLine) {
                dbUpdateNote(id, newTitle, newContent)
                    .catch(async (err) => {
                        console.error("Online update failed, queuing offline:", err);
                        await queueOrUpdateSyncAction("update", id, { title: newTitle, content: newContent });
                        refreshPendingCount();
                        setSyncStatus("offline");
                    });
            } else {
                await queueOrUpdateSyncAction("update", id, { title: newTitle, content: newContent });
                refreshPendingCount();
                setSyncStatus("offline");
            }
        }
    }, [currentUser, refreshPendingCount]);

    // Action: Delete Note
    const deleteNote = useCallback(async (id) => {
        // Optimistic UI update
        setNotes((prevList) => prevList.filter((note) => note.id !== id));

        // Delete from Dexie
        await dbLocal.notes.delete(id);

        if (currentUser) {
            if (navigator.onLine) {
                dbDeleteNote(id)
                    .then(() => toast.success("Note deleted!"))
                    .catch(async (err) => {
                        console.error("Online delete failed, queuing offline:", err);
                        await queueOrUpdateSyncAction("delete", id, null);
                        refreshPendingCount();
                        setSyncStatus("offline");
                    });
            } else {
                await queueOrUpdateSyncAction("delete", id, null);
                refreshPendingCount();
                setSyncStatus("offline");
                toast.success("Note deleted (queued for cloud sync)");
            }
        } else {
            toast.success("Note deleted! (locally)");
        }
    }, [currentUser, refreshPendingCount]);

    return {
        notes,
        loading,
        syncStatus,
        pendingCount,
        addNote,
        editNote,
        deleteNote,
        retrySync: processSyncQueue
    };
};
