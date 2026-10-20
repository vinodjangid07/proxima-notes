const AuthInput = ({ label, name, type = "text", placeholder, required = true, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#18181b] dark:text-[#e4e4e7]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] focus:border-2 focus:border-[#5645d4] rounded-md px-3.5 text-sm text-[#18181b] dark:text-[#f4f4f5] placeholder-[#71717a] dark:placeholder-[#a1a1aa] focus:outline-none transition-all"
        {...props}
      />
    </div>
  );
};

export default AuthInput;
