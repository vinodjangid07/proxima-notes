
const ConfirmCard = ({confirmDelete, setConfirmDelete, deleteNote, noteId}) => {
  return (
    <div className={`fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/65 backdrop-blur-xs items-center justify-center z-50 p-4 ${confirmDelete === true ? 'flex' : 'hidden'}`}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Delete Note</h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-450 leading-relaxed">Are you sure you want to delete this note? This action cannot be undone.</p>
            </div>
            
            <div className="flex gap-3 justify-end w-full">
                <button 
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button 
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    onClick={() => deleteNote(noteId)}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmCard;
