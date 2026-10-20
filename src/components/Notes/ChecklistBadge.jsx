import { CheckSquare } from "lucide-react";

const ChecklistBadge = ({ completed, total, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#d9f3e1] dark:bg-[#183324] text-[#16a34a] dark:text-[#4ade80] shrink-0 ${className}`}
    >
      <CheckSquare className="w-3.5 h-3.5" />
      <span>{completed}/{total}</span>
    </span>
  );
};

export default ChecklistBadge;
