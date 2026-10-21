import { useState, memo, useMemo, useCallback } from 'react';
import ConfirmCard from './ConfirmCard';
import ChecklistBadge from './ChecklistBadge';
import NoteCardActions from './NoteCardActions';
import { stripMarkdown, getChecklistProgress, extractTags } from '../../lib/markdown';
import { Pin } from 'lucide-react';
import { toast } from 'react-toastify';

const NoteCard = memo(({ note, viewMode = 'grid', deleteNote, onOpenModal, onTogglePin, onTagClick }) => {
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

    const cleanContent = useMemo(() => stripMarkdown(note.content), [note.content]);
    const checklist = useMemo(() => getChecklistProgress(note.content), [note.content]);
    const tags = useMemo(() => {
        return extractTags(`${note.title || ""} ${note.content || ""}`);
    }, [note.title, note.content]);

    if (viewMode === 'list') {
        return (
            <div 
                onClick={handleCardClick}
                className="group relative flex items-center justify-between bg-white dark:bg-[#161619] hover:bg-[#fafaf9] dark:hover:bg-[#1a1a1e] border border-[#dcdee0] dark:border-[#27272a] hover:border-black/25 dark:hover:border-[#383842] rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer overflow-hidden gap-4 shadow-xs"
            >
                <ConfirmCard 
                    confirmDelete={confirmDelete} 
                    setConfirmDelete={setConfirmDelete} 
                    deleteNote={deleteNote}
                    noteId={note.id}
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:w-1/3 min-w-0">
                        {note.pinned && (
                            <Pin className="w-3.5 h-3.5 fill-current text-black dark:text-white shrink-0" title="Pinned" />
                        )}
                        <h3 className="text-base font-semibold tracking-tight text-[#171717] dark:text-white truncate">
                            {note.title || "Untitled Note"}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <p className="text-sm font-normal text-[#60646c] dark:text-[#a0a4ab] truncate flex-1">
                            {cleanContent || "No additional text"}
                        </p>
                        {tags.length > 0 && (
                            <div className="hidden md:flex items-center gap-1 shrink-0">
                                {tags.slice(0, 2).map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onTagClick) onTagClick(tag);
                                        }}
                                        className="text-[11px] font-medium text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white bg-[#f0f0f3] dark:bg-[#202025] hover:bg-[#eaebee] dark:hover:bg-[#2a2a30] border border-[#dcdee0] dark:border-[#27272a] px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                                {tags.length > 2 && (
                                    <span className="text-[10px] text-[#60646c] dark:text-[#a0a4ab]">+{tags.length - 2}</span>
                                )}
                            </div>
                        )}
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
                    <span className="text-xs font-mono font-medium text-[#60646c] dark:text-[#a0a4ab] hidden sm:inline-block">
                        {formattedDate}
                    </span>

                    <NoteCardActions 
                        onOpenModal={handleOpenModal}
                        onCopy={handleCopy}
                        onDelete={handleDeleteClick}
                        onTogglePin={onTogglePin ? (e) => { e.stopPropagation(); onTogglePin(note.id); } : undefined}
                        isPinned={Boolean(note.pinned)}
                        copied={copied}
                    />
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={handleCardClick}
            className="group relative flex flex-col justify-between bg-white dark:bg-[#161619] hover:bg-[#fafaf9] dark:hover:bg-[#1a1a1e] border border-[#dcdee0] dark:border-[#27272a] hover:border-black/25 dark:hover:border-[#383842] rounded-3xl p-6 min-h-[200px] transition-all duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-sm"
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={deleteNote}
                noteId={note.id}
            />

            <div className="flex flex-col flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                        {note.pinned && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-black dark:text-white bg-[#f0f0f3] dark:bg-[#202025] border border-[#dcdee0] dark:border-[#27272a] px-2 py-0.5 rounded-full select-none shrink-0">
                                <Pin className="w-2.5 h-2.5 fill-current" />
                                Pinned
                            </span>
                        )}
                        <span className="text-xs font-mono font-medium text-[#60646c] dark:text-[#a0a4ab]">
                            {formattedDate}
                        </span>
                    </div>
                    {checklist.hasChecklist && (
                        <ChecklistBadge 
                            completed={checklist.completed} 
                            total={checklist.total} 
                        />
                    )}
                </div>
                
                <h3 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-white line-clamp-2 leading-snug">
                    {note.title || "Untitled Note"}
                </h3>
                
                <p className="text-sm font-normal mt-2.5 flex-1 text-[#60646c] dark:text-[#a0a4ab] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {cleanContent || "No additional text"}
                </p>

                {tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 select-none">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onTagClick) onTagClick(tag);
                                }}
                                className="text-[11px] font-medium text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white bg-[#f0f0f3] dark:bg-[#202025] hover:bg-[#eaebee] dark:hover:bg-[#2a2a30] border border-[#dcdee0] dark:border-[#27272a] px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end mt-4 pt-3 shrink-0 select-none relative z-10 border-t border-[#f0f0f3] dark:border-[#27272a]">
                <NoteCardActions 
                    onOpenModal={handleOpenModal}
                    onCopy={handleCopy}
                    onDelete={handleDeleteClick}
                    onTogglePin={onTogglePin ? (e) => { e.stopPropagation(); onTogglePin(note.id); } : undefined}
                    isPinned={Boolean(note.pinned)}
                    copied={copied}
                />
            </div>
        </div>
    );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;