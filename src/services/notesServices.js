import { db } from "../lib/firebase";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc, 
    setDoc, 
    updateDoc,
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
                    // Normalize createdAt to ISO string or formatted timestamp
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
            createdAt: data.createdAt?.toDate 
                ? data.createdAt.toDate().toISOString() 
                : (data.createdAt || new Date().toISOString())
        };
    });
};

export const dbAddNote = async (noteId, userId, title, content, createdAt) => {
    const noteRef = doc(db, 'Notes', noteId);
    await setDoc(noteRef, {
        userId,
        title,
        content,
        createdAt: createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
};

export const dbUpdateNote = async (noteId, title, content) => {
    const noteRef = doc(db, 'Notes', noteId);
    await updateDoc(noteRef, {
        title,
        content,
        updatedAt: new Date().toISOString()
    });
};

export const dbDeleteNote = async (noteId) => {
    const noteRef = doc(db, "Notes", noteId);
    await deleteDoc(noteRef);
};