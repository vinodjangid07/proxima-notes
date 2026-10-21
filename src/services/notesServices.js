import { db } from "../lib/firebase";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc, 
    setDoc, 
    onSnapshot 
} from "firebase/firestore";

/**
 * Real-time Firestore subscription for authenticated user's notes.
 * Calls onNotesChange whenever notes are added, edited, or deleted on any device.
 */
export const subscribeToUserNotes = (userId, onNotesChange, onError) => {
    if (!userId) return () => {};

    const notesQuery = query(
        collection(db, 'Notes'),
        where('userId', "==", userId)
    );

    return onSnapshot(
        notesQuery, 
        (snapshot) => {
            const serverNotes = snapshot.docs.map(docSnapshot => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    pinned: Boolean(data.pinned),
                    color: data.color || "default",
                    archived: Boolean(data.archived),
                    deletedAt: data.deletedAt || null,
                    createdAt: data.createdAt?.toDate 
                        ? data.createdAt.toDate().toISOString() 
                        : (data.createdAt || new Date().toISOString())
                };
            });
            onNotesChange(serverNotes);
        },
        (error) => {
            console.error("Firestore onSnapshot error:", error);
            if (onError) onError(error);
        }
    );
};

export const dbGetNotes = async (userId) => {
    const notesQuery = query(
        collection(db, 'Notes'),
        where('userId', "==", userId)
    );

    const querySnapshot = await getDocs(notesQuery);

    return querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        return {
            id: docSnapshot.id,
            ...data,
            pinned: Boolean(data.pinned),
            color: data.color || "default",
            archived: Boolean(data.archived),
            deletedAt: data.deletedAt || null,
            createdAt: data.createdAt?.toDate 
                ? data.createdAt.toDate().toISOString() 
                : (data.createdAt || new Date().toISOString())
        };
    });
};

export const dbAddNote = async (noteId, userId, title, content, createdAt, extra = {}) => {
    const noteRef = doc(db, 'Notes', noteId);
    await setDoc(noteRef, {
        userId,
        title,
        content,
        createdAt: createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: Boolean(extra.pinned),
        color: extra.color || "default",
        archived: Boolean(extra.archived),
        deletedAt: extra.deletedAt || null,
        ...extra
    });
};

export const dbUpdateNote = async (noteId, title, content, extra = {}, userId = null, createdAt = null) => {
    const noteRef = doc(db, 'Notes', noteId);
    const updateData = {
        updatedAt: new Date().toISOString(),
        ...extra
    };
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (userId) updateData.userId = userId;
    if (createdAt) updateData.createdAt = createdAt;
    await setDoc(noteRef, updateData, { merge: true });
};

export const dbDeleteNote = async (noteId) => {
    const noteRef = doc(db, "Notes", noteId);
    await deleteDoc(noteRef);
};