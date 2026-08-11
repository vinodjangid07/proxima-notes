import { Trash2, Pencil, Check, X } from 'lucide-react';
import { useState, memo } from 'react';
import ConfirmCard from './ConfirmCard';

const NoteCard = memo(({ note, editNote, deleteNote }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content || '');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const saveEdit = () => {
        if (!editTitle.trim() && !editContent.trim()) return;
        setIsEditing(false);
        editNote(note.id, editTitle, editContent);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditTitle(note.title);
        setEditContent(note.content || '');
    }

    return (
        <div className="w-full flex flex-col justify-between border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20 rounded-2xl p-5 min-h-[160px] transition-all duration-200 shadow-sm hover:shadow relative">
            <ConfirmCard 
            confirmDelete={confirmDelete} 
            setConfirmDelete={setConfirmDelete} 
            deleteNote={deleteNote}
            noteId={note.id}/>
            {isEditing ? (
                <div className="flex flex-col gap-2 w-full h-full flex-1">
                    <input 
                        autoFocus 
                        type='text' 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        placeholder="Title"
                        className='bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 w-full' 
                    />
                    <textarea 
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)} 
                        placeholder="Content"
                        rows={4}
                        className='bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 p-3 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 w-full resize-none flex-1 min-h-[90px]' 
                    />
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-w-0" onDoubleClick={() => setIsEditing(true)}>
                    <div className="flex items-start justify-between gap-3 w-full">
                        <h3 className="text-base font-semibold truncate flex-1 text-zinc-900 dark:text-zinc-100">
                            {note.title || "Untitled"}
                        </h3>
                    </div>
                    
                    <p className="text-sm font-normal mt-2 flex-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">
                        {note.content || "No content"}
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-1 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
                {isEditing ? (
                    <>
                        <button
                            className="note-button hover:text-green-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                            onClick={saveEdit}
                            title="Save changes"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            className="note-button hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100/30 dark:hover:bg-red-950/20"
                            onClick={cancelEdit}
                            title="Cancel edit"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="note-button hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                            onClick={() => setIsEditing(true)}
                            title="Edit note"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            className="note-button hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100/30 dark:hover:bg-red-950/20"
                            onClick={() => setConfirmDelete(true)}
                            title="Delete note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
})

export default NoteCard