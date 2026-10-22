import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroStage = () => {
  return (
    <section className="relative w-full overflow-hidden pt-20 sm:pt-36 pb-10 sm:pb-28">
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[520px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/35 via-blue-100/10 to-transparent dark:from-[#15243b]/50 dark:via-[#0e1626]/20 dark:to-transparent -z-10 blur-2xl" 
      />

      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-[-1.92px] leading-[1.05] text-[#171717] dark:text-white max-w-4xl text-balance select-none">
          Write at the speed of thought. Never lose an idea.
        </h1>

        <p className="text-base sm:text-lg text-[#60646c] dark:text-[#a0a4ab] mt-6 max-w-2xl font-normal leading-relaxed text-balance">
          A quiet, local-first workspace. Works 100% offline, stores in open Markdown, and syncs across your devices without account barriers.
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

        <div className="relative w-full max-w-[1060px] mt-8 sm:mt-14 select-none">
          <div className="relative w-full rounded-2xl bg-[#fafafb] dark:bg-[#151518] shadow-[0_30px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden">
            <img
              src="/notes-preview-black.webp"
              alt="Proxima Notes Workspace Dark UI"
              className="w-full h-auto object-cover rounded-2xl block dark:hidden"
            />
            <img
              src="/notes-preview-white.webp"
              alt="Proxima Notes Workspace Light UI"
              className="w-full h-auto object-cover rounded-2xl hidden dark:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroStage;
