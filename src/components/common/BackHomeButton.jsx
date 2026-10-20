import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackHomeButton = ({ className = "absolute top-6 left-6 z-10" }) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-1.5 bg-[#f4f4f5] dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] px-3.5 py-2 rounded-md text-xs font-medium text-[#18181b] dark:text-[#f4f4f5] hover:bg-[#edece9] dark:hover:bg-[#27272a] transition-all select-none ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to Home</span>
    </Link>
  );
};

export default BackHomeButton;
