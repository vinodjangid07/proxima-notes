
const ConfirmCard = ({confirmDelete, setConfirmDelete, deleteNote, noteId}) => {
  return (
    <div className={`fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/70 backdrop-blur-sm items-center justify-center z-50 p-4 ${confirmDelete === true ? 'flex' : 'hidden'}`}>
        <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Delete Note</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Are you sure you want to delete this note? This action cannot be undone.</p>
            </div>
            
            <div className="flex gap-3 justify-end w-full pt-1">
                <button 
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button 
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-xs"
                    onClick={() => deleteNote(noteId)}
                >
                    Delete Note
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmCard;
