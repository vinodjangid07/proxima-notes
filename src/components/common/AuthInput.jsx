const AuthInput = ({ label, name, type = "text", placeholder, required = true, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#171717] dark:text-[#ffffff]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 bg-white dark:bg-[#1a1a1a] border border-[#dcdee0] dark:border-[#2e2e34] focus:border-2 focus:border-[#000000] dark:focus:border-[#ffffff] rounded-md px-3.5 text-sm text-[#171717] dark:text-[#ffffff] placeholder-[#999999] dark:placeholder-[#60646c] focus:outline-none transition-all"
        {...props}
      />
    </div>
  );
};

export default AuthInput;
