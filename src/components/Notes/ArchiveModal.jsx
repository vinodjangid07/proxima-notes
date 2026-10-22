import { memo, useEffect } from "react";

const ArchiveModal = memo(({ isOpen, onClose, onConfirm, noteTitle }) => {
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
                className="bg-white dark:bg-[#151518] w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-150 select-none"
            >
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-white">
                        Move to Trash?
                    </h3>
                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                        {noteTitle ? `"${noteTitle}"` : "This note"} will be moved to the Trash. You can restore it anytime within 30 days.
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
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#171717] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-xs active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                    >
                        Move to Trash
                    </button>
                </div>
            </div>
        </div>
    );
});

ArchiveModal.displayName = "ArchiveModal";

export default ArchiveModal;
