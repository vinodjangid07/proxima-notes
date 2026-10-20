const AuthDivider = ({ text = "or continue with" }) => {
  return (
    <div className="relative flex items-center justify-center select-none">
      <div className="h-px w-full bg-[#e4e4e7] dark:bg-[#2e2e34]"></div>
      <span className="bg-white dark:bg-[#121214] px-3 text-xs text-[#71717a] dark:text-[#a1a1aa] absolute font-medium">
        {text}
      </span>
    </div>
  );
};

export default AuthDivider;
