import { Trash2, Copy, Maximize2, Check } from 'lucide-react';
import { useState, memo } from 'react';
import ConfirmCard from './ConfirmCard';
import { toast } from 'react-toastify';

const NoteCard = memo(({ note, viewMode = 'grid', deleteNote, onOpenModal }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        const fullText = `${note.title ? note.title + "\n\n" : ""}${note.content || ""}`;
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        toast.info("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setConfirmDelete(true);
    };

    const formattedDate = note.createdAt 
        ? new Date(note.createdAt?.seconds ? note.createdAt.seconds * 1000 : note.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })
        : "Just now";

    if (viewMode === 'list') {
        return (
            <div 
                onClick={() => onOpenModal(note)}
                className="group relative flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/70 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-hidden gap-4"
            >
                <ConfirmCard 
                    confirmDelete={confirmDelete} 
                    setConfirmDelete={setConfirmDelete} 
                    deleteNote={deleteNote}
                    noteId={note.id}
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-light tracking-tight text-zinc-900 dark:text-zinc-100 truncate sm:w-1/3">
                        {note.title || "Untitled Note"}
                    </h3>
                    
                    <p className="text-xs sm:text-sm font-normal text-zinc-500 dark:text-zinc-400 truncate flex-1">
                        {note.content || "Empty note content..."}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 hidden sm:inline-block">
                        {formattedDate}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenModal(note);
                            }}
                            title="Read full note"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                            onClick={handleCopy}
                            title="Copy note"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            onClick={handleDeleteClick}
                            title="Delete note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={() => onOpenModal(note)}
            className="group relative flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/70 rounded-[2rem] p-6 sm:p-7 min-h-[200px] transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={deleteNote}
                noteId={note.id}
            />

            <div className="flex flex-col flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-3 opacity-60">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {formattedDate}
                    </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                    {note.title || "Untitled Note"}
                </h3>
                
                <p className="text-xs sm:text-sm font-normal mt-3 flex-1 text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {note.content || "Empty note content..."}
                </p>
            </div>

            <div className="flex items-center justify-end mt-4 pt-2 shrink-0 select-none relative z-10">
                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal(note);
                        }}
                        title="Read full note"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                        onClick={handleCopy}
                        title="Copy note"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                        className="p-2 rounded-xl text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        onClick={handleDeleteClick}
                        title="Delete note"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
})

export default NoteCard;