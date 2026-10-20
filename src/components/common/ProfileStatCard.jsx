const ProfileStatCard = ({ icon: Icon, label, value, subtext }) => {
  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] p-5 rounded-xl shadow-xs">
      <div className="flex items-center gap-2 text-[#71717a] dark:text-[#a1a1aa] text-xs font-semibold">
        <Icon className="w-4 h-4 text-[#5645d4]" />
        <span>{label}</span>
      </div>
      <h3 className="text-base font-semibold text-[#18181b] dark:text-[#f4f4f5] truncate mt-1">
        {value}
      </h3>
      <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] mt-auto pt-2">
        {subtext}
      </p>
    </div>
  );
};

export default ProfileStatCard;
