import { memo, useEffect } from "react";

const DeleteModal = memo(({ isOpen, onClose, onConfirm, noteTitle }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-sans"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#151518] w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 shadow-2xl animate-in zoom-in-95 duration-150 select-none border border-black/5 dark:border-white/5"
            >
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-white">
                        Delete Permanently?
                    </h3>
                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                        Are you sure you want to permanently delete {noteTitle ? `"${noteTitle}"` : "this note"}? This action cannot be undone.
                    </p>
                </div>
                
                <div className="flex gap-2.5 justify-end w-full pt-1">
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#f0f0f3] dark:bg-[#202025] text-[#171717] dark:text-white hover:bg-[#e4e5e9] dark:hover:bg-[#28282f] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-xs active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
});

DeleteModal.displayName = "DeleteModal";

export default DeleteModal;
