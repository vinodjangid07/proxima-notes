import { useState, useEffect, useRef } from "react";
import { X, Trash2, Copy, Check, Calendar } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import ConfirmCard from "./ConfirmCard";

const NoteModal = ({ note, isOpen, onClose, editNote, deleteNote }) => {
    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    const [copied, setCopied] = useState(false);
    const [saveStatus, setSaveStatus] = useState("Saved");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const isInitialMount = useRef(true);

    const debouncedTitle = useDebounce(title, 500);
    const debouncedContent = useDebounce(content, 500);

    useEffect(() => {
        if (note) {
            setTitle(note.title || "");
            setContent(note.content || "");
            isInitialMount.current = true;
            setSaveStatus("Saved");
            setConfirmDelete(false);
        }
    }, [note]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !confirmDelete) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, confirmDelete, onClose]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (!note) return;

        if (debouncedTitle !== note.title || debouncedContent !== note.content) {
            setSaveStatus("Saving...");
            editNote(note.id, debouncedTitle, debouncedContent);
            const timer = setTimeout(() => {
                setSaveStatus("Saved");
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [debouncedTitle, debouncedContent, note, editNote]);

    if (!isOpen || !note) return null;

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
            className="fixed inset-0 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={handleConfirmDelete}
                noteId={note.id}
            />

            <div 
                className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 select-text relative pb-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                            {saveStatus}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Copy content"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-4 flex flex-col gap-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setSaveStatus("Typing...");
                        }}
                        placeholder="Untitled Note"
                        className="text-2xl sm:text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none w-full bg-transparent"
                    />

                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setSaveStatus("Typing...");
                        }}
                        placeholder="Start writing..."
                        className="text-base text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none w-full bg-transparent resize-none flex-1 min-h-[250px] leading-relaxed font-normal"
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
