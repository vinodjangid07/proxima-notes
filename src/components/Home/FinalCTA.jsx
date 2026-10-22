import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative w-full py-14 sm:py-32 overflow-hidden select-none flex flex-col items-center">
      <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col items-center relative z-10">
        <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-1.5px] leading-[1.08] text-[#171717] dark:text-white max-w-2xl text-balance">
          Start writing in seconds.
        </h2>
        
        <p className="text-sm sm:text-base text-[#60646c] dark:text-[#a0a4ab] mt-4 max-w-lg leading-relaxed text-balance">
          No sign-up wall, no subscriptions, no delay. Open your local workspace and let your thoughts flow.
        </p>

        <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
          <Link
            to="/notes"
            className="h-10 px-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs"
          >
            <span>Open workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
