import { memo } from "react";
import ArchiveModal from "./ArchiveModal";
import DeleteModal from "./DeleteModal";

const ConfirmCard = memo(({ 
    confirmDelete, 
    setConfirmDelete, 
    deleteNote, 
    noteId, 
    isPermanent = false,
    noteTitle = ""
}) => {
    if (!confirmDelete) return null;

    if (isPermanent) {
        return (
            <DeleteModal 
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => {
                    deleteNote(noteId);
                    setConfirmDelete(false);
                }}
                noteTitle={noteTitle}
            />
        );
    }

    return (
        <ArchiveModal 
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={() => {
                deleteNote(noteId);
                setConfirmDelete(false);
            }}
            noteTitle={noteTitle}
        />
    );
});

ConfirmCard.displayName = "ConfirmCard";

export default ConfirmCard;
