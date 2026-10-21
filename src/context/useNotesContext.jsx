import { useContext } from "react";
import { NotesContext } from "./notesContextDef";

export const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error("useNotesContext must be used within a NotesProvider");
    }
    return context;
};

export default useNotesContext;
