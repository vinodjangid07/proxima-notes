import { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import ConfirmCard from './ConfirmCard';
import ChecklistBadge from './ChecklistBadge';
import NoteCardActions from './NoteCardActions';
import { stripMarkdown, getChecklistProgress, extractTags } from '../../lib/markdown';
import { getNoteColor } from '../../lib/noteColors';
import { Pin, MoreHorizontal, Copy, Check, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

const NoteCard = memo(({ 
    note, 
    viewMode = 'grid', 
    deleteNote, 
    onRestore,
    restoreNote,
    onOpenModal, 
    openModal, 
    onTogglePin, 
    togglePinNote, 
    onTagClick 
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isKebabOpen, setIsKebabOpen] = useState(false);
    const kebabRef = useRef(null);

    useEffect(() => {
        if (!isKebabOpen) return;
        const handleOutsideClick = (e) => {
            if (kebabRef.current && !kebabRef.current.contains(e.target)) {
                setIsKebabOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [isKebabOpen]);

    const triggerOpenModal = onOpenModal || openModal;
    const triggerTogglePin = onTogglePin || togglePinNote;
    const triggerRestore = onRestore || restoreNote;

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
        if (note.deletedAt) {
            toast.info("Note is in Trash. Restore it to view or edit.");
            return;
        }
        if (typeof triggerOpenModal === 'function') triggerOpenModal(note);
    }, [triggerOpenModal, note]);

    const handleOpenModal = useCallback((e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (typeof triggerOpenModal === 'function') triggerOpenModal(note);
    }, [triggerOpenModal, note]);

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

    const noteColor = useMemo(() => getNoteColor(note.color), [note.color]);

    if (viewMode === 'list') {
        return (
            <div 
                onClick={handleCardClick}
                className={`group relative flex items-center justify-between w-full ${noteColor.cardBg} rounded-2xl p-4 sm:p-5 transition-all duration-150 cursor-pointer gap-4`}
            >
                <ConfirmCard 
                    confirmDelete={confirmDelete} 
                    setConfirmDelete={setConfirmDelete} 
                    deleteNote={deleteNote}
                    noteId={note.id}
                    isPermanent={Boolean(note.deletedAt)}
                    noteTitle={note.title}
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
                                        className="text-[11px] font-medium text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white bg-[#eaebee] dark:bg-[#202025] hover:bg-[#dcdee0] dark:hover:bg-[#28282e] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
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

                {note.deletedAt ? (
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (triggerRestore) triggerRestore(note.id);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#171717] dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
                            title="Restore note"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Restore</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete permanently"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-medium text-[#60646c] dark:text-[#a0a4ab] hidden sm:inline-block">
                            {formattedDate}
                        </span>

                        <div className="relative" ref={kebabRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsKebabOpen((prev) => !prev);
                                }}
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                    isKebabOpen
                                        ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227]"
                                }`}
                                title="More options"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {isKebabOpen && (
                                <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-8 w-40 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-100 select-none text-left"
                                >
                                    {triggerTogglePin && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                triggerTogglePin(note.id);
                                                setIsKebabOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
                                        >
                                            <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-current" : ""}`} />
                                            <span>{note.pinned ? "Unpin Note" : "Pin to Top"}</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(e);
                                            setIsKebabOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy Note"}</span>
                                    </button>
                                    <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(e);
                                            setIsKebabOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete Note</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div 
            onClick={handleCardClick}
            className={`group relative flex flex-col justify-between ${noteColor.cardBg} rounded-2xl p-5 sm:p-6 min-h-[190px] transition-all duration-150 cursor-pointer overflow-hidden`}
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={deleteNote}
                noteId={note.id}
                isPermanent={Boolean(note.deletedAt)}
                noteTitle={note.title}
            />

            <div className="flex flex-col flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                        {note.pinned && !note.deletedAt && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-black dark:text-white bg-[#eaebee] dark:bg-[#202025] px-2 py-0.5 rounded-full select-none shrink-0">
                                <Pin className="w-2.5 h-2.5 fill-current" />
                                Pinned
                            </span>
                        )}
                        <span className="text-xs font-medium text-[#60646c] dark:text-[#a0a4ab]">
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

                {tags.length > 0 && !note.deletedAt && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 select-none">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onTagClick) onTagClick(tag);
                                }}
                                className="text-[11px] font-medium text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white bg-[#eaebee] dark:bg-[#202025] hover:bg-[#dcdee0] dark:hover:bg-[#28282e] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end mt-4 pt-1 shrink-0 select-none relative z-10">
                {note.deletedAt ? (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (triggerRestore) triggerRestore(note.id);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#171717] dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
                            title="Restore note"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete permanently"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    </div>
                ) : (
                    <NoteCardActions 
                        onOpenModal={handleOpenModal}
                        onCopy={handleCopy}
                        onDelete={handleDeleteClick}
                        onTogglePin={triggerTogglePin ? (e) => { e.stopPropagation(); triggerTogglePin(note.id); } : undefined}
                        isPinned={Boolean(note.pinned)}
                        copied={copied}
                    />
                )}
            </div>
        </div>
    );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;