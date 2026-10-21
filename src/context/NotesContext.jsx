import { useMemo } from "react";
import { useNotes } from "../hooks/useNotes";
import { extractTags } from "../lib/markdown";
import { NotesContext } from "./notesContextDef";

export const NotesProvider = ({ children }) => {
    const notesData = useNotes();
    const { notes } = notesData;

    const activeNotes = useMemo(() => notes.filter(n => !n.deletedAt), [notes]);
    const trashedCount = useMemo(() => notes.filter(n => Boolean(n.deletedAt)).length, [notes]);

    const tagCounts = useMemo(() => {
        const counts = {};
        activeNotes.forEach((note) => {
            const tags = extractTags(`${note.title || ""} ${note.content || ""}`);
            tags.forEach((tag) => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return counts;
    }, [activeNotes]);

    const allTags = useMemo(() => {
        return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
    }, [tagCounts]);

    const pinnedCount = useMemo(() => {
        return activeNotes.filter((n) => n.pinned).length;
    }, [activeNotes]);

    const value = useMemo(() => ({
        ...notesData,
        tagCounts,
        allTags,
        pinnedCount,
        trashedCount
    }), [notesData, tagCounts, allTags, pinnedCount, trashedCount]);

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};

export default NotesProvider;
