const ToolbarButton = ({ onClick, title, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 rounded-lg text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-white dark:hover:bg-[#222227] transition-colors cursor-pointer"
      title={title}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
