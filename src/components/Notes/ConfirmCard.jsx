import { memo } from "react";

const ConfirmCard = memo(({ confirmDelete, setConfirmDelete, deleteNote, noteId }) => {
    if (!confirmDelete) return null;

    return (
        <div 
            onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-sans"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] w-full max-w-sm rounded-3xl p-6 flex flex-col gap-5 shadow-2xl animate-in zoom-in-95 duration-150 select-none"
            >
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-white">Delete Note</h3>
                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">Are you sure you want to delete this note? This action cannot be undone.</p>
                </div>
                
                <div className="flex gap-2.5 justify-end w-full pt-1">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(false);
                        }}
                        className="px-4 py-2 rounded-full text-xs font-semibold border border-[#dcdee0] dark:border-[#27272a] bg-transparent text-[#171717] dark:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#202025] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-xs active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(noteId);
                        }}
                    >
                        Delete Note
                    </button>
                </div>
            </div>
        </div>
    );
});

ConfirmCard.displayName = "ConfirmCard";

export default ConfirmCard;
