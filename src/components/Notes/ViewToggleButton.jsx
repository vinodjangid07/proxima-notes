const ViewToggleButton = ({ active, onClick, icon: Icon, title }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-full aspect-square flex items-center justify-center rounded-sm transition-all cursor-pointer ${
                active
                    ? 'bg-white dark:bg-[#27272a] text-[#18181b] dark:text-[#f4f4f5] shadow-xs font-semibold'
                    : 'text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5]'
            }`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};

export default ViewToggleButton;
