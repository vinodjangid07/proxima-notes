import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
    X, 
    Trash2, 
    Copy, 
    Check, 
    Calendar, 
    Maximize2, 
    Minimize2, 
    Eye, 
    Edit3, 
    Columns, 
    Bold, 
    Italic, 
    Heading2, 
    ListTodo, 
    Code, 
    Quote,
    Pin,
    MoreHorizontal,
    ChevronLeft,
    Palette
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { 
    renderMarkdown, 
    calculateReadingStats, 
    getChecklistProgress, 
    toggleChecklistTask 
} from "../../lib/markdown";
import { NOTE_COLOR_LIST, getNoteColor } from "../../lib/noteColors";
import { toast } from "react-toastify";
import ArchiveModal from "./ArchiveModal";
import ToolbarButton from "./ToolbarButton";
import EditorTabButton from "./EditorTabButton";
import SyncStatusBadge from "./SyncStatusBadge";

const NoteModalContent = ({ note, onClose, addNote, editNote, deleteNote, togglePinNote }) => {
    const isDraftRef = useRef(Boolean(note?.isDraft));
    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    const [color, setColor] = useState(note?.color || "default");
    const [copied, setCopied] = useState(false);
    const [saveStatus, setSaveStatus] = useState(note?.isDraft ? "Draft" : "Saved");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isKebabOpen, setIsKebabOpen] = useState(false);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const kebabRef = useRef(null);
    const colorMenuRef = useRef(null);

    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartRef = useRef(null);

    const [isZenMode, setIsZenMode] = useState(false);
    const [viewTab, setViewTab] = useState("edit");

    const isInitialMount = useRef(true);
    const lastSavedRef = useRef({ title: note?.title || "", content: note?.content || "", color: note?.color || "default" });
    const textareaRef = useRef(null);

    const debouncedTitle = useDebounce(title, 600);
    const debouncedContent = useDebounce(content, 600);

    const noteColor = useMemo(() => getNoteColor(color), [color]);
    const stats = useMemo(() => calculateReadingStats(content), [content]);
    const checklist = useMemo(() => getChecklistProgress(content), [content]);
    const renderedHtml = useMemo(() => renderMarkdown(content), [content]);

    const handleColorSelect = useCallback((selectedColorId) => {
        setColor(selectedColorId);
        setIsColorMenuOpen(false);
        if (!isDraftRef.current && note?.id) {
            editNote(note.id, title, content, selectedColorId);
        }
    }, [note?.id, title, content, editNote]);

    const handleTouchStart = (e) => {
        touchStartRef.current = {
            y: e.touches[0].clientY,
            time: Date.now()
        };
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!touchStartRef.current) return;
        const deltaY = e.touches[0].clientY - touchStartRef.current.y;
        if (deltaY > 0) {
            setDragY(deltaY);
        }
    };

    const handleTouchEnd = () => {
        if (!touchStartRef.current) return;
        const deltaY = dragY;
        const elapsed = Date.now() - touchStartRef.current.time;
        const velocity = deltaY / Math.max(elapsed, 1);
        touchStartRef.current = null;
        setIsDragging(false);

        if (deltaY > 100 || (deltaY > 40 && velocity > 0.45)) {
            setDragY(window.innerHeight);
            setTimeout(() => {
                handleSafeClose();
            }, 160);
        } else {
            setDragY(0);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (kebabRef.current && !kebabRef.current.contains(e.target)) {
                setIsKebabOpen(false);
            }
            if (colorMenuRef.current && !colorMenuRef.current.contains(e.target)) {
                setIsColorMenuOpen(false);
            }
        };
        if (isKebabOpen || isColorMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isKebabOpen, isColorMenuOpen]);

    const handleSafeClose = useCallback((options = {}) => {
        const fromPopState = options?.fromPopState || false;

        if (!fromPopState && window.history.state?.proximaNoteModal) {
            window.history.back();
        }

        if (isDraftRef.current) {
            const initialContent = (note?.content || "").trim();
            const hasUserTyped = 
                title.trim().length > 0 || 
                (content.trim().length > 0 && content.trim() !== initialContent);

            if (!hasUserTyped) {
                onClose();
                return;
            }
            if (addNote) {
                addNote(title, content, {
                    id: note.id,
                    silent: true,
                    createdAt: note.createdAt,
                    pinned: Boolean(note.pinned),
                    color
                });
                isDraftRef.current = false;
            }
            onClose();
            return;
        }

        if (!title.trim() && !content.trim()) {
            deleteNote(note.id);
            onClose();
            return;
        }

        if (
            title !== lastSavedRef.current.title ||
            content !== lastSavedRef.current.content ||
            color !== lastSavedRef.current.color
        ) {
            lastSavedRef.current = { title, content, color };
            editNote(note.id, title, content, color);
        }
        onClose();
    }, [title, content, color, note?.id, note?.content, note?.createdAt, note?.pinned, addNote, editNote, deleteNote, onClose]);

    useEffect(() => {
        window.history.pushState({ proximaNoteModal: true }, "");

        const handlePopState = () => {
            handleSafeClose({ fromPopState: true });
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [handleSafeClose]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !confirmDelete) {
                if (isZenMode) {
                    setIsZenMode(false);
                } else {
                    handleSafeClose();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [confirmDelete, isZenMode, handleSafeClose]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const hasChanged = 
            debouncedTitle !== lastSavedRef.current.title || 
            debouncedContent !== lastSavedRef.current.content ||
            color !== lastSavedRef.current.color;

        if (hasChanged) {
            lastSavedRef.current = { title: debouncedTitle, content: debouncedContent, color };
            if (isDraftRef.current) {
                const initialContent = (note?.content || "").trim();
                const hasUserTyped = 
                    debouncedTitle.trim().length > 0 || 
                    (debouncedContent.trim().length > 0 && debouncedContent.trim() !== initialContent);

                if (hasUserTyped && addNote) {
                    addNote(debouncedTitle, debouncedContent, {
                        id: note.id,
                        silent: true,
                        createdAt: note.createdAt,
                        pinned: Boolean(note.pinned),
                        color
                    });
                    isDraftRef.current = false;
                    setSaveStatus("Saved");
                }
            } else {
                editNote(note.id, debouncedTitle, debouncedContent, color);
                setSaveStatus("Saved");
            }
        }
    }, [debouncedTitle, debouncedContent, color, note?.id, note?.content, note?.createdAt, note?.pinned, addNote, editNote]);

    const insertMarkdown = useCallback((prefix, suffix = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.slice(start, end);
        const before = content.slice(0, start);
        const after = content.slice(end);

        const replacement = `${prefix}${selected || "text"}${suffix}`;
        const newContent = `${before}${replacement}${after}`;

        setContent(newContent);
        setSaveStatus("Saving...");

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + prefix.length,
                start + prefix.length + (selected ? selected.length : 4)
            );
        }, 0);
    }, [content]);

    const insertTask = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = content.slice(0, start);
        const after = content.slice(end);
        
        const lastNewline = before.lastIndexOf("\n");
        const isStartOfLine = lastNewline === -1 ? start === 0 : start === lastNewline + 1;
        const prefix = isStartOfLine ? "- [ ] " : "\n- [ ] ";
        
        const newContent = `${before}${prefix}${after}`;
        setContent(newContent);
        setSaveStatus("Saving...");

        setTimeout(() => {
            textarea.focus();
            const newCursor = start + prefix.length;
            textarea.setSelectionRange(newCursor, newCursor);
        }, 0);
    }, [content]);

    const handleTextareaKeyDown = useCallback((e) => {
        const isMac = typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0;
        const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

        // Save immediately
        if (cmdOrCtrl && e.key.toLowerCase() === "s") {
            e.preventDefault();
            if (!isDraftRef.current && note?.id) {
                editNote(note.id, title, content, color);
                setSaveStatus("Saved");
            }
            return;
        }

        // New Task: Alt + T or Ctrl + Shift + T
        if ((e.altKey && e.key.toLowerCase() === "t") || (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "t")) {
            e.preventDefault();
            insertTask();
            return;
        }

        // Bold: Ctrl + B
        if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "b") {
            e.preventDefault();
            insertMarkdown("**", "**");
            return;
        }

        // Italic: Ctrl + I
        if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === "i") {
            e.preventDefault();
            insertMarkdown("*", "*");
            return;
        }

        // Strikethrough: Ctrl + Shift + X
        if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "x") {
            e.preventDefault();
            insertMarkdown("~~", "~~");
            return;
        }

        // Code: Ctrl + Shift + C
        if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "c") {
            e.preventDefault();
            insertMarkdown("`", "`");
            return;
        }

        // Quote: Ctrl + Shift + Q
        if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "q") {
            e.preventDefault();
            insertMarkdown("> ");
            return;
        }

        // Heading: Ctrl + Shift + H
        if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "h") {
            e.preventDefault();
            insertMarkdown("## ");
            return;
        }

        // Zen Mode toggle: Alt + Z
        if (e.altKey && e.key.toLowerCase() === "z") {
            e.preventDefault();
            setIsZenMode(prev => !prev);
            return;
        }

        // Auto-continue checklist on Enter
        if (e.key === "Enter" && !e.shiftKey) {
            const textarea = e.currentTarget;
            const pos = textarea.selectionStart;
            const before = content.slice(0, pos);
            const lineStart = before.lastIndexOf("\n") + 1;
            const currentLine = before.slice(lineStart);

            const checklistMatch = currentLine.match(/^(\s*-\s*\[([ xX])\]\s*)(.*)$/);
            if (checklistMatch) {
                e.preventDefault();
                const [fullMatch, checkPrefix, checkState, itemText] = checklistMatch;
                
                // If the item text is empty, pressing Enter removes the checklist bullet
                if (!itemText.trim()) {
                    const newBefore = content.slice(0, lineStart);
                    const newAfter = content.slice(pos);
                    const newContent = `${newBefore}${newAfter}`;
                    setContent(newContent);
                    setTimeout(() => {
                        textarea.setSelectionRange(lineStart, lineStart);
                    }, 0);
                    return;
                }

                // Otherwise continue checklist on next line
                const indent = checkPrefix.match(/^\s*/)[0];
                const newLine = `\n${indent}- [ ] `;
                const after = content.slice(pos);
                const newContent = `${before}${newLine}${after}`;
                setContent(newContent);
                setTimeout(() => {
                    const newPos = pos + newLine.length;
                    textarea.setSelectionRange(newPos, newPos);
                }, 0);
            }
        }
    }, [content, insertTask, insertMarkdown, isDraftRef, note?.id, editNote, title, color]);

    const handlePreviewClick = useCallback((e) => {
        const target = e.target;
        if (target && target.tagName === "INPUT" && target.type === "checkbox") {
            const container = e.currentTarget;
            const checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));
            const index = checkboxes.indexOf(target);
            if (index !== -1) {
                e.preventDefault();
                setContent((prevContent) => {
                    const newContent = toggleChecklistTask(prevContent, index);
                    lastSavedRef.current = { ...lastSavedRef.current, content: newContent };
                    editNote(note.id, title, newContent);
                    return newContent;
                });
                setSaveStatus("Saved");
            }
        }
    }, [title, note.id, editNote]);

    const handleCopy = () => {
        const fullText = `${title ? title + "\n\n" : ""}${content}`;
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        toast.info("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmDelete = (id) => {
        if (!isDraftRef.current && deleteNote) {
            deleteNote(id);
        }
        onClose();
    };

    const formattedDate = note.createdAt 
        ? new Date(note.createdAt?.seconds ? note.createdAt.seconds * 1000 : note.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : "Just now";

    return (
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200 ${
                isZenMode ? "p-0" : "p-0 sm:p-6"
            }`}
            onClick={handleSafeClose}
        >
            <ArchiveModal 
                isOpen={confirmDelete} 
                onClose={() => setConfirmDelete(false)} 
                onConfirm={() => {
                    handleConfirmDelete(note.id);
                    setConfirmDelete(false);
                }}
                noteTitle={title || note.title}
            />

            <div 
                style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' } : undefined}
                className={`${noteColor.modalBg} shadow-2xl flex flex-col overflow-hidden select-text relative transition-colors duration-150 ${
                    isZenMode 
                        ? "w-full h-full rounded-none max-w-none" 
                        : "w-full max-w-4xl h-full sm:h-auto max-h-full sm:max-h-[90vh] rounded-none sm:rounded-2xl animate-in zoom-in-95 duration-150"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    className="sm:hidden w-full pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="w-10 h-1 rounded-full bg-black/15 dark:bg-white/20" />
                </div>

                <div 
                    className="flex items-center justify-between px-4 sm:px-8 py-2.5 sm:py-3 shrink-0 gap-2 select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleSafeClose()}
                            className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            title="Back to workspace (Esc)"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <SyncStatusBadge 
                            status={saveStatus === "Saving..." ? "saving" : (saveStatus === "Error" ? "error" : "saved")} 
                        />
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#60646c] dark:text-[#a0a4ab] font-medium ml-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center bg-[#f0f0f3] dark:bg-[#101013] p-1 rounded-lg text-xs font-medium">
                        <EditorTabButton
                            active={viewTab === "edit"}
                            onClick={() => setViewTab("edit")}
                            icon={Edit3}
                            label="Edit"
                            title="Edit Mode"
                        />
                        <EditorTabButton
                            active={viewTab === "split"}
                            onClick={() => setViewTab("split")}
                            icon={Columns}
                            label="Split"
                            title="Split Editor & Preview"
                        />
                        <EditorTabButton
                            active={viewTab === "preview"}
                            onClick={() => setViewTab("preview")}
                            icon={Eye}
                            label="Preview"
                            title="Rendered Markdown Preview"
                        />
                    </div>

                    <div className="sm:hidden flex items-center gap-1">
                        <div className="relative" ref={kebabRef}>
                            <button
                                type="button"
                                onClick={() => setIsKebabOpen(prev => !prev)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                    isKebabOpen
                                        ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white"
                                }`}
                                title="More options"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {isKebabOpen && (
                                <div className="absolute right-0 top-9 w-48 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-xl border border-black/10 dark:border-white/10 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                                    <div className="px-3 py-1.5">
                                        <span className="text-[10px] font-semibold text-[#60646c] dark:text-[#a0a4ab] uppercase tracking-wider block mb-1.5">
                                            Color
                                        </span>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {NOTE_COLOR_LIST.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => {
                                                        handleColorSelect(c.id);
                                                        setIsKebabOpen(false);
                                                    }}
                                                    title={c.name}
                                                    className={`w-5 h-5 rounded-full transition-transform flex items-center justify-center cursor-pointer ${c.swatchClass} ${
                                                        color === c.id ? "ring-2 ring-black dark:ring-white scale-105" : ""
                                                    }`}
                                                >
                                                    {color === c.id && (
                                                        <Check className="w-2.5 h-2.5 text-black dark:text-white stroke-[2.5]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                                    {togglePinNote && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                togglePinNote(note.id);
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
                                        onClick={() => {
                                            handleCopy();
                                            setIsKebabOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy Content"}</span>
                                    </button>
                                    <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setConfirmDelete(true);
                                            setIsKebabOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Move to Trash</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                        <div className="relative" ref={colorMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsColorMenuOpen(prev => !prev)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                    isColorMenuOpen
                                        ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                }`}
                                title="Background Color"
                            >
                                <Palette className="w-3.5 h-3.5" />
                            </button>

                            {isColorMenuOpen && (
                                <div className="absolute right-0 top-9 p-2 bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-xl border border-black/10 dark:border-white/10 z-50 animate-in fade-in-50 zoom-in-95 duration-100 flex items-center gap-1.5">
                                    {NOTE_COLOR_LIST.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => handleColorSelect(c.id)}
                                            title={c.name}
                                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${c.swatchClass} ${
                                                color === c.id ? "ring-2 ring-black dark:ring-white scale-105" : ""
                                            }`}
                                        >
                                            {color === c.id && (
                                                <Check className="w-3 h-3 text-black dark:text-white stroke-[2.5]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {togglePinNote && (
                            <button
                                onClick={() => togglePinNote(note.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                    note.pinned 
                                        ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold" 
                                        : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227]"
                                    }`}
                                title={note.pinned ? "Unpin note" : "Pin note to top"}
                            >
                                <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-current" : ""}`} />
                            </button>
                        )}
                        <button
                            onClick={() => setIsZenMode(prev => !prev)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227] transition-colors cursor-pointer"
                            title={isZenMode ? "Exit Zen Mode (Esc)" : "Zen Fullscreen Mode"}
                        >
                            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227] transition-colors cursor-pointer"
                            title="Copy content"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Move to Trash"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {viewTab !== "preview" && (
                    <div className="flex items-center gap-1 sm:gap-1.5 px-4 sm:px-8 py-2 bg-black/[0.02] dark:bg-black/20 border-y border-black/5 dark:border-white/5 overflow-x-auto scrollbar-none select-none">
                        <ToolbarButton
                            onClick={() => insertMarkdown("**", "**")}
                            title="Bold (**text**)"
                        >
                            <Bold className="w-3.5 h-3.5" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => insertMarkdown("*", "*")}
                            title="Italic (*text*)"
                        >
                            <Italic className="w-3.5 h-3.5" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => insertMarkdown("## ")}
                            title="Heading (## text)"
                        >
                            <Heading2 className="w-3.5 h-3.5" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={insertTask}
                            title="Checklist task (Alt+T)"
                        >
                            <ListTodo className="w-3.5 h-3.5" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => insertMarkdown("```\n", "\n```")}
                            title="Code block (```code```)"
                        >
                            <Code className="w-3.5 h-3.5" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => insertMarkdown("> ")}
                            title="Quote (> text)"
                        >
                            <Quote className="w-3.5 h-3.5" />
                        </ToolbarButton>
                    </div>
                )}

                <div className={`flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-5 flex flex-col gap-3 ${
                    isZenMode ? "max-w-4xl mx-auto w-full" : ""
                }`}>
                    <input
                        type="text"
                        value={title}
                        autoFocus={!title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (e.target.value !== lastSavedRef.current.title) {
                                setSaveStatus("Saving...");
                            }
                        }}
                        placeholder="Untitled Note"
                        className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent"
                    />

                    {viewTab === "edit" && (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onKeyDown={handleTextareaKeyDown}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (e.target.value !== lastSavedRef.current.content) {
                                    setSaveStatus("Saving...");
                                }
                            }}
                            placeholder="Write in markdown... Use # for headings, - [ ] for checklists, > for quotes, and ``` for code"
                            className="text-base text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent resize-none flex-1 min-h-[350px] leading-relaxed font-normal"
                        />
                    )}

                    {viewTab === "preview" && (
                        <div 
                            onClick={handlePreviewClick}
                            dangerouslySetInnerHTML={{ __html: renderedHtml || '<p class="text-[#60646c] dark:text-[#a0a4ab] italic">No content to preview yet. Switch to Edit to write markdown.</p>' }}
                            className="prose-proxima text-base text-[#171717] dark:text-[#ededed] flex-1 min-h-[350px] select-text"
                        />
                    )}

                    {viewTab === "split" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 min-h-[350px]">
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onKeyDown={handleTextareaKeyDown}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    if (e.target.value !== lastSavedRef.current.content) {
                                        setSaveStatus("Saving...");
                                    }
                                }}
                                placeholder="Write markdown on the left..."
                                className="text-base text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent resize-none leading-relaxed pr-6"
                            />
                            <div 
                                onClick={handlePreviewClick}
                                dangerouslySetInnerHTML={{ __html: renderedHtml || '<p class="text-[#60646c] dark:text-[#a0a4ab] italic">Live preview will render here...</p>' }}
                                className="prose-proxima text-base text-[#171717] dark:text-[#ededed] overflow-y-auto select-text"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between px-4 sm:px-8 py-2.5 sm:py-3 shrink-0 text-xs text-[#60646c] dark:text-[#a0a4ab] font-medium select-none gap-2 bg-transparent">
                    <div className="sm:hidden flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-2 text-xs text-[#60646c] dark:text-[#a0a4ab]">
                            <span>{stats.readingTime}m read</span>
                            {checklist.hasChecklist && (
                                <>
                                    <span className="opacity-40">•</span>
                                    <span className="font-sans font-medium text-[#171717] dark:text-white">
                                        {checklist.completed}/{checklist.total}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="flex items-center bg-[#f0f0f3] dark:bg-[#1e1e23] p-1 rounded-xl text-xs font-medium shrink-0 shadow-xs">
                            <button
                                type="button"
                                onClick={() => setViewTab("edit")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                    viewTab === "edit"
                                        ? "bg-white dark:bg-[#2a2a30] text-[#171717] dark:text-white font-semibold shadow-xs"
                                        : "text-[#60646c] dark:text-[#a0a4ab]"
                                }`}
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewTab("preview")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                    viewTab === "preview"
                                        ? "bg-white dark:bg-[#2a2a30] text-[#171717] dark:text-white font-semibold shadow-xs"
                                        : "text-[#60646c] dark:text-[#a0a4ab]"
                                }`}
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                            </button>
                        </div>
                    </div>

                    <span className="hidden sm:inline-block text-[#60646c] dark:text-[#a0a4ab]">
                        {stats.readingTime} min read • {stats.words} words
                    </span>

                    {checklist.hasChecklist && (
                        <div className="hidden sm:flex items-center gap-2.5">
                            <span className="text-xs font-medium text-[#171717] dark:text-white">
                                {checklist.completed} of {checklist.total} tasks completed ({checklist.percent}%)
                            </span>
                            <div className="w-20 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                    style={{ width: `${checklist.percent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NoteModal = ({ note, isOpen = true, onClose, addNote, editNote, deleteNote, togglePinNote }) => {
    if (!isOpen || !note) return null;

    return (
        <NoteModalContent 
            key={note.id} 
            note={note} 
            onClose={onClose} 
            addNote={addNote}
            editNote={editNote} 
            deleteNote={deleteNote} 
            togglePinNote={togglePinNote}
        />
    );
};

export default NoteModal;
