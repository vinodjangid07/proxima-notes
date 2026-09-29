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
        <div className="w-full flex flex-col justify-between bg-zinc-100/60 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 rounded-2xl p-5 min-h-[170px] transition-all duration-200 shadow-sm hover:shadow-md relative group">
            <ConfirmCard 
            confirmDelete={confirmDelete} 
            setConfirmDelete={setConfirmDelete} 
            deleteNote={deleteNote}
            noteId={note.id}/>
            {isEditing ? (
                <div className="flex flex-col gap-3 w-full h-full flex-1">
                    <input 
                        autoFocus 
                        type='text' 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        placeholder="Title"
                        className='bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-3.5 py-2.5 text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 w-full' 
                    />
                    <textarea 
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)} 
                        placeholder="Content"
                        rows={4}
                        className='bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 p-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 w-full resize-none flex-1 min-h-[100px] leading-relaxed' 
                    />
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-w-0 cursor-pointer" onDoubleClick={() => setIsEditing(true)} title="Double click to edit">
                    <div className="flex items-start justify-between gap-3 w-full">
                        <h3 className="text-base font-semibold truncate flex-1 text-zinc-900 dark:text-zinc-100 tracking-tight">
                            {note.title || "Untitled"}
                        </h3>
                    </div>
                    
                    <p className="text-sm font-normal mt-2 flex-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {note.content || "No content"}
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-1.5 mt-4 pt-3 shrink-0 select-none">
                {isEditing ? (
                    <>
                        <button
                            className="p-2 rounded-xl text-zinc-400 hover:text-green-600 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            onClick={saveEdit}
                            title="Save changes"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            onClick={cancelEdit}
                            title="Cancel edit"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            onClick={() => setIsEditing(true)}
                            title="Edit note"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
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