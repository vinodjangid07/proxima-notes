const EditorTabButton = ({ active, onClick, icon: Icon, label, title, className = "" }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                active
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold"
                    : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white"
            } ${className}`}
            title={title}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    );
};

export default EditorTabButton;
