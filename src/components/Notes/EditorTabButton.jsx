const EditorTabButton = ({ active, onClick, icon: Icon, label, title, className = "" }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                active
                    ? "bg-[#18181b] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs font-semibold"
                    : "text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5]"
            } ${className}`}
            title={title}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    );
};

export default EditorTabButton;
