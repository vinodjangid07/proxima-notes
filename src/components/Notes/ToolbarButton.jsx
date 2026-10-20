const ToolbarButton = ({ onClick, title, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 rounded-md text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:bg-white dark:hover:bg-[#27272a] transition-colors cursor-pointer"
      title={title}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
