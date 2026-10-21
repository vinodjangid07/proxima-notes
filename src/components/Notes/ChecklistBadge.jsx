import { CheckSquare } from "lucide-react";

const ChecklistBadge = ({ completed, total, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 ${className}`}
    >
      <CheckSquare className="w-3.5 h-3.5" />
      <span>{completed}/{total}</span>
    </span>
  );
};

export default ChecklistBadge;
