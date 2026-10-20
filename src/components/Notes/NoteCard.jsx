import { useState, memo, useMemo, useCallback } from 'react';
import ConfirmCard from './ConfirmCard';
import ChecklistBadge from './ChecklistBadge';
import NoteCardActions from './NoteCardActions';
import { stripMarkdown, getChecklistProgress } from '../../lib/markdown';
import { toast } from 'react-toastify';

const NoteCard = memo(({ note, viewMode = 'grid', deleteNote, onOpenModal }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback((e) => {
        e.stopPropagation();
        const fullText = `${note.title ? note.title + "\n\n" : ""}${note.content || ""}`;
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        toast.info("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    }, [note.title, note.content]);

    const handleDeleteClick = useCallback((e) => {
        e.stopPropagation();
        setConfirmDelete(true);
    }, []);

    const handleCardClick = useCallback(() => {
        onOpenModal(note);
    }, [onOpenModal, note]);

    const handleOpenModal = useCallback((e) => {
        e.stopPropagation();
        onOpenModal(note);
    }, [onOpenModal, note]);

    const formattedDate = useMemo(() => {
        if (!note.createdAt) return "Just now";
        try {
            const dateObj = note.createdAt?.seconds 
                ? new Date(note.createdAt.seconds * 1000) 
                : new Date(note.createdAt);
            return isNaN(dateObj.getTime())
                ? "Just now"
                : dateObj.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
        } catch {
            return "Just now";
        }
    }, [note.createdAt]);

    // Strip markdown formatting for card preview
    const cleanContent = useMemo(() => stripMarkdown(note.content), [note.content]);

    // Task checklist count
    const checklist = useMemo(() => getChecklistProgress(note.content), [note.content]);

    if (viewMode === 'list') {
        return (
            <div 
                onClick={handleCardClick}
                className="group relative flex items-center justify-between bg-white dark:bg-[#1c1c1f] hover:bg-[#fafaf9] dark:hover:bg-[#242429] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-pointer overflow-hidden gap-4 shadow-xs"
            >
                <ConfirmCard 
                    confirmDelete={confirmDelete} 
                    setConfirmDelete={setConfirmDelete} 
                    deleteNote={deleteNote}
                    noteId={note.id}
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 flex-1 min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5] truncate sm:w-1/3">
                        {note.title || "Untitled Note"}
                    </h3>
                    
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <p className="text-sm font-normal text-[#52525b] dark:text-[#a1a1aa] truncate flex-1">
                            {cleanContent || "No additional text"}
                        </p>
                        {checklist.hasChecklist && (
                            <ChecklistBadge 
                                completed={checklist.completed} 
                                total={checklist.total} 
                                className="hidden sm:inline-flex"
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-[#71717a] dark:text-[#a1a1aa] hidden sm:inline-block">
                        {formattedDate}
                    </span>

                    <NoteCardActions 
                        onOpenModal={handleOpenModal}
                        onCopy={handleCopy}
                        onDelete={handleDeleteClick}
                        copied={copied}
                    />
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={handleCardClick}
            className="group relative flex flex-col justify-between bg-white dark:bg-[#1c1c1f] hover:bg-[#fafaf9] dark:hover:bg-[#242429] border border-[#e4e4e7] dark:border-[#2e2e34] hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] rounded-xl p-5 sm:p-6 min-h-[190px] transition-all duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-sm"
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={deleteNote}
                noteId={note.id}
            />

            <div className="flex flex-col flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-medium text-[#71717a] dark:text-[#a1a1aa]">
                        {formattedDate}
                    </span>
                    {checklist.hasChecklist && (
                        <ChecklistBadge 
                            completed={checklist.completed} 
                            total={checklist.total} 
                        />
                    )}
                </div>
                
                <h3 className="text-lg font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5] line-clamp-2 leading-snug">
                    {note.title || "Untitled Note"}
                </h3>
                
                <p className="text-sm font-normal mt-2.5 flex-1 text-[#52525b] dark:text-[#d4d4d8] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {cleanContent || "No additional text"}
                </p>
            </div>

            <div className="flex items-center justify-end mt-4 pt-2 shrink-0 select-none relative z-10 border-t border-[#f4f4f5] dark:border-[#27272a]">
                <NoteCardActions 
                    onOpenModal={handleOpenModal}
                    onCopy={handleCopy}
                    onDelete={handleDeleteClick}
                    copied={copied}
                />
            </div>
        </div>
    );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;