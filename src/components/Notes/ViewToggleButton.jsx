const ViewToggleButton = ({ active, onClick, icon: Icon, title }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-full aspect-square flex items-center justify-center rounded-full transition-all cursor-pointer ${
                active
                    ? 'bg-white dark:bg-[#24242a] text-black dark:text-white shadow-xs font-semibold'
                    : 'text-[#60646c] dark:text-[#a0a4ab] hover:text-black dark:hover:text-white'
            }`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};

export default ViewToggleButton;
