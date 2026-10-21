const ProfileStatCard = ({ icon: Icon, label, value, subtext }) => {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] p-6 rounded-3xl shadow-xs">
      <div className="flex items-center gap-2 text-[#60646c] dark:text-[#a0a4ab] text-xs font-semibold">
        <Icon className="w-4 h-4 text-[#171717] dark:text-white" />
        <span>{label}</span>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-white truncate mt-1">
        {value}
      </h3>
      <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] mt-auto pt-3">
        {subtext}
      </p>
    </div>
  );
};

export default ProfileStatCard;
