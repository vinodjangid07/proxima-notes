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
    Type,
    Pin
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { 
    renderMarkdown, 
    calculateReadingStats, 
    getChecklistProgress, 
    toggleChecklistTask 
} from "../../lib/markdown";
import { toast } from "react-toastify";
import ConfirmCard from "./ConfirmCard";
import ToolbarButton from "./ToolbarButton";
import EditorTabButton from "./EditorTabButton";

const NoteModalContent = ({ note, onClose, editNote, deleteNote, togglePinNote }) => {
    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    const [copied, setCopied] = useState(false);
    const [saveStatus, setSaveStatus] = useState("Saved");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [isZenMode, setIsZenMode] = useState(false);
    const [viewTab, setViewTab] = useState("edit");
    const [isMonoFont, setIsMonoFont] = useState(false);

    const isInitialMount = useRef(true);
    const lastSavedRef = useRef({ title: note?.title || "", content: note?.content || "" });
    const textareaRef = useRef(null);

    const debouncedTitle = useDebounce(title, 600);
    const debouncedContent = useDebounce(content, 600);

    const stats = useMemo(() => calculateReadingStats(content), [content]);
    const checklist = useMemo(() => getChecklistProgress(content), [content]);
    const renderedHtml = useMemo(() => renderMarkdown(content), [content]);

    // Flush unsaved edits on close before debounce triggers
    const handleSafeClose = useCallback(() => {
        if (
            title !== lastSavedRef.current.title ||
            content !== lastSavedRef.current.content
        ) {
            lastSavedRef.current = { title, content };
            editNote(note.id, title, content);
        }
        onClose();
    }, [title, content, note.id, editNote, onClose]);

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
            debouncedContent !== lastSavedRef.current.content;

        if (hasChanged) {
            lastSavedRef.current = { title: debouncedTitle, content: debouncedContent };
            editNote(note.id, debouncedTitle, debouncedContent);
            setSaveStatus("Saved");
        }
    }, [debouncedTitle, debouncedContent, note.id, editNote]);

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
        deleteNote(id);
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
                isZenMode ? "p-0" : "p-4 sm:p-6"
            }`}
            onClick={handleSafeClose}
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={handleConfirmDelete}
                noteId={note.id}
            />

            <div 
                className={`bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] shadow-2xl flex flex-col overflow-hidden transition-all duration-200 select-text relative ${
                    isZenMode 
                        ? "w-full h-full rounded-none max-w-none border-none" 
                        : "w-full max-w-4xl rounded-3xl max-h-[90vh] animate-in zoom-in-95 duration-150"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-wrap items-center justify-between px-6 sm:px-8 py-3.5 shrink-0 border-b border-[#dcdee0] dark:border-[#27272a] gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-[#60646c] dark:text-[#a0a4ab] font-mono font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border transition-colors duration-150 ${
                            saveStatus === "Saving..." 
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" 
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}>
                            {saveStatus}
                        </span>
                    </div>

                    <div className="flex items-center bg-[#f0f0f3] dark:bg-[#111113] border border-[#dcdee0] dark:border-[#27272a] p-1 rounded-full text-xs font-medium">
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
                            className="hidden sm:flex"
                        />
                        <EditorTabButton
                            active={viewTab === "preview"}
                            onClick={() => setViewTab("preview")}
                            icon={Eye}
                            label="Preview"
                            title="Rendered Markdown Preview"
                        />
                    </div>

                    <div className="flex items-center gap-1">
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
                            onClick={() => setIsMonoFont(prev => !prev)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-colors cursor-pointer ${
                                isMonoFont 
                                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold" 
                                    : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227]"
                            }`}
                            title="Toggle Monospace Font"
                        >
                            <Type className="w-3.5 h-3.5" />
                        </button>
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
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete note"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={handleSafeClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227] transition-colors cursor-pointer ml-1"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {viewTab !== "preview" && (
                    <div className="flex items-center gap-1.5 px-6 sm:px-8 py-2 border-b border-[#dcdee0] dark:border-[#27272a] bg-[#fafafb] dark:bg-[#111113] overflow-x-auto select-none">
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
                            onClick={() => insertMarkdown("- [ ] ")}
                            title="Checklist task (- [ ] task)"
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
                        <span className="text-xs text-[#60646c] dark:text-[#a0a4ab] font-medium pl-2">
                            Markdown supported
                        </span>
                    </div>
                )}

                <div className={`flex-1 overflow-y-auto px-6 sm:px-10 py-5 flex flex-col gap-4 ${
                    isZenMode ? "max-w-4xl mx-auto w-full" : ""
                }`}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (e.target.value !== lastSavedRef.current.title) {
                                setSaveStatus("Saving...");
                            }
                        }}
                        placeholder="Untitled Note"
                        className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent"
                    />

                    {viewTab === "edit" && (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (e.target.value !== lastSavedRef.current.content) {
                                    setSaveStatus("Saving...");
                                }
                            }}
                            placeholder="Write in markdown... Use # for headings, - [ ] for checklists, > for quotes, and ``` for code"
                            className={`text-base text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent resize-none flex-1 min-h-[350px] leading-relaxed font-normal ${
                                isMonoFont ? "font-mono text-sm leading-relaxed" : ""
                            }`}
                        />
                    )}

                    {viewTab === "preview" && (
                        <div 
                            onClick={handlePreviewClick}
                            dangerouslySetInnerHTML={{ __html: renderedHtml || '<p class="text-[#60646c] dark:text-[#a0a4ab] italic">No content to preview yet. Switch to Edit to write markdown.</p>' }}
                            className={`prose-proxima text-base text-[#171717] dark:text-[#ededed] flex-1 min-h-[350px] select-text ${
                                isMonoFont ? "font-mono text-sm" : ""
                            }`}
                        />
                    )}

                    {viewTab === "split" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 min-h-[350px]">
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    if (e.target.value !== lastSavedRef.current.content) {
                                        setSaveStatus("Saving...");
                                    }
                                }}
                                placeholder="Write markdown on the left..."
                                className={`text-base text-[#171717] dark:text-[#ededed] placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none w-full bg-transparent resize-none leading-relaxed border-r border-[#dcdee0] dark:border-[#2e2e34] pr-6 ${
                                    isMonoFont ? "font-mono text-sm" : ""
                                }`}
                            />
                            <div 
                                onClick={handlePreviewClick}
                                dangerouslySetInnerHTML={{ __html: renderedHtml || '<p class="text-[#60646c] dark:text-[#a0a4ab] italic">Live preview will render here...</p>' }}
                                className={`prose-proxima text-base text-[#171717] dark:text-[#ededed] overflow-y-auto select-text ${
                                    isMonoFont ? "font-mono text-sm" : ""
                                }`}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between px-6 sm:px-10 py-3 shrink-0 border-t border-[#dcdee0] dark:border-[#27272a] text-xs text-[#60646c] dark:text-[#a0a4ab] font-medium select-none gap-2 bg-[#fafaf9] dark:bg-[#111113]">
                    <span className="text-[#60646c] dark:text-[#a0a4ab] font-mono">
                        {stats.readingTime} min read
                    </span>

                    {checklist.hasChecklist && (
                        <div className="flex items-center gap-2">
                            <span className="text-[#171717] dark:text-white font-semibold">
                                {checklist.completed}/{checklist.total} tasks ({checklist.percent}%)
                            </span>
                            <div className="w-16 h-1.5 bg-[#dcdee0] dark:bg-[#27272a] rounded-full overflow-hidden">
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

const NoteModal = ({ note, isOpen, onClose, editNote, deleteNote, togglePinNote }) => {
    if (!isOpen || !note) return null;

    return (
        <NoteModalContent 
            key={note.id} 
            note={note} 
            onClose={onClose} 
            editNote={editNote} 
            deleteNote={deleteNote} 
            togglePinNote={togglePinNote}
        />
    );
};

export default NoteModal;
