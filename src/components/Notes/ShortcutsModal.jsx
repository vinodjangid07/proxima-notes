import { memo, useEffect } from "react";
import { X } from "lucide-react";

const SHORTCUT_GROUPS = [
    {
        title: "Workspace & Navigation",
        items: [
            { label: "Create new note", keys: ["Alt", "N"] },
            { label: "Search thoughts", keys: ["/"] },
            { label: "Toggle Grid / List view", keys: ["Alt", "V"] },
            { label: "Keyboard shortcuts", keys: ["?"] },
            { label: "Close modal / Clear search", keys: ["Esc"] }
        ]
    },
    {
        title: "Note Editor",
        items: [
            { label: "New checklist task", keys: ["Alt", "T"] },
            { label: "Continue task list", keys: ["Enter"] },
            { label: "Bold text", keys: ["Ctrl", "B"] },
            { label: "Italic text", keys: ["Ctrl", "I"] },
            { label: "Strikethrough", keys: ["Ctrl", "Shift", "X"] },
            { label: "Heading 2", keys: ["Ctrl", "Shift", "H"] },
            { label: "Code block", keys: ["Ctrl", "Shift", "C"] },
            { label: "Quote block", keys: ["Ctrl", "Shift", "Q"] },
            { label: "Toggle Zen mode", keys: ["Alt", "Z"] },
            { label: "Save note", keys: ["Ctrl", "S"] }
        ]
    }
];

const ShortcutsModal = memo(({ isOpen, onClose }) => {
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-sans"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#151518] w-full max-w-lg rounded-2xl p-6 sm:p-7 flex flex-col gap-6 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-150 select-none max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between pb-1 border-b border-black/5 dark:border-white/5">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-white">
                            Keyboard Shortcuts
                        </h2>
                        <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] mt-0.5">
                            Speed up your workflow across Proxima
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {SHORTCUT_GROUPS.map((group) => (
                        <div key={group.title} className="flex flex-col gap-2.5">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#60646c] dark:text-[#a0a4ab]">
                                {group.title}
                            </h3>
                            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
                                {group.items.map((item) => (
                                    <div 
                                        key={item.label}
                                        className="flex items-center justify-between py-2 text-xs sm:text-sm"
                                    >
                                        <span className="text-[#171717] dark:text-[#ededed] font-normal">
                                            {item.label}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {item.keys.map((k, idx) => (
                                                <span key={idx} className="flex items-center gap-1">
                                                    <kbd className="min-w-6 px-1.5 py-0.5 text-center text-[11px] font-mono font-medium text-[#171717] dark:text-white bg-[#f0f0f3] dark:bg-[#202025] rounded-md shadow-2xs">
                                                        {k}
                                                    </kbd>
                                                    {idx < item.keys.length - 1 && (
                                                        <span className="text-[10px] text-[#a0a4ab] dark:text-[#60646c]">+</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

ShortcutsModal.displayName = "ShortcutsModal";

export default ShortcutsModal;
