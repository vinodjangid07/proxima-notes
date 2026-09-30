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
        <div 
            className="group relative flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-[2rem] p-6 sm:p-8 min-h-[220px] transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            onDoubleClick={() => !isEditing && setIsEditing(true)}
            title={!isEditing ? "Double click to edit" : ""}
        >
            <ConfirmCard 
                confirmDelete={confirmDelete} 
                setConfirmDelete={setConfirmDelete} 
                deleteNote={deleteNote}
                noteId={note.id}
            />


            {isEditing ? (
                <div className="flex flex-col gap-3 w-full h-full flex-1 relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-50">
                        <div className="h-px w-6 bg-zinc-400 dark:bg-zinc-600"></div>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] font-mono">
                            Editing...
                        </span>
                    </div>
                    <input 
                        autoFocus 
                        type='text' 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        placeholder="Note Title"
                        className='bg-transparent text-zinc-900 dark:text-zinc-100 text-2xl sm:text-3xl font-light tracking-tight placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none w-full' 
                    />
                    <textarea 
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)} 
                        placeholder="Start typing your thoughts..."
                        className='bg-transparent text-zinc-600 dark:text-zinc-400 text-sm focus:outline-none w-full resize-none flex-1 min-h-[100px] leading-relaxed mt-2' 
                    />
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-6 opacity-80">
                        <div className="h-px w-6 bg-zinc-300 dark:bg-zinc-700"></div>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] font-mono">
                            {note.title ? "Saved" : "Untitled"}
                        </span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">
                        {note.title || "Untitled"}
                    </h3>
                    
                    <p className="text-sm font-normal mt-4 flex-1 text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                        {note.content || "No content"}
                    </p>
                </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 shrink-0 select-none relative z-10 border-t border-zinc-200/50 dark:border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase">
                    Actions
                </span>
                <div className="flex justify-end gap-1">
                    {isEditing ? (
                        <>
                            <button
                                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                                onClick={saveEdit}
                                title="Save changes"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                                onClick={cancelEdit}
                                title="Cancel edit"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                                onClick={() => setIsEditing(true)}
                                title="Edit note"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                className="p-2 rounded-xl text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                                onClick={() => setConfirmDelete(true)}
                                title="Delete note"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
})

export default NoteCard