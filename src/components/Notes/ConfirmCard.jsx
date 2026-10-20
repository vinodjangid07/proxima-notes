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
                className="bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] w-full max-w-sm rounded-xl p-6 flex flex-col gap-5 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-150 select-none"
            >
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5]">Delete Note</h3>
                    <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">Are you sure you want to delete this note? This action cannot be undone.</p>
                </div>
                
                <div className="flex gap-2.5 justify-end w-full pt-1">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(false);
                        }}
                        className="px-4 py-2 rounded-md text-sm font-medium border border-[#e4e4e7] dark:border-[#3f3f46] bg-transparent text-[#18181b] dark:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        className="px-4 py-2 rounded-md text-sm font-medium bg-[#ef4444] hover:bg-[#dc2626] text-white transition-colors cursor-pointer shadow-xs"
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
