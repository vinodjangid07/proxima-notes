const GoogleAuthButton = ({ onClick, disabled = false, text = "Continue with Google" }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full h-11 flex items-center justify-center gap-3 bg-white dark:bg-[#1c1c1f] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] border border-[#e4e4e7] dark:border-[#2e2e34] text-[#18181b] dark:text-[#f4f4f5] rounded-md font-medium text-sm transition-colors cursor-pointer select-none disabled:opacity-60"
    >
      <img
        className="w-4 h-4 shrink-0"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="Google"
      />
      <span>{text}</span>
    </button>
  );
};

export default GoogleAuthButton;
