const GoogleAuthButton = ({ onClick, disabled = false, text = "Continue with Google" }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full h-11 flex items-center justify-center gap-3 bg-white dark:bg-[#1a1a1a] hover:bg-[#f0f0f3] dark:hover:bg-[#27272a] border border-[#dcdee0] dark:border-[#2e2e34] text-[#171717] dark:text-[#ffffff] rounded-md font-medium text-sm transition-colors cursor-pointer select-none disabled:opacity-60"
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
