import { db } from "../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";

export const dbGetNotes = async (userId) => {
    const notesQuery = query(
        collection(db, 'Notes'),
        where('userId', "==", userId)
    );

    const querySnapshot = await getDocs(notesQuery);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const dbAddNote = async (noteId, userId, title, content) => {
    const noteRef = (doc(db, 'Notes', noteId));

    await setDoc(noteRef, {
        userId,
        title,
        content,
        createdAt: new Date()
    });
}

export const dbUpdateNote = async (noteId, title, content) => {
    const noteRef = (doc(db, 'Notes', noteId));
    await updateDoc(noteRef, {
        title,
        content
    })
}

export const dbDeleteNote = async (noteId) => {
    const noteRef = doc(db, "Notes", noteId);
    await deleteDoc(noteRef);
}