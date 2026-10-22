import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
    <footer className="w-full bg-[#fafafb] dark:bg-[#121215] py-10 sm:py-16 select-none font-sans text-xs text-[#60646c] dark:text-[#a0a4ab]">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/proxima_logo.webp"
            alt="Proxima Logo"
            className="w-5 h-5 object-contain invert dark:invert-0 rounded"
          />
          <span className="font-medium text-[#171717] dark:text-white">Proxima</span>
          <span className="opacity-40">•</span>
          <span>Local-first markdown workspace</span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
          <Link
            to="/notes"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Workspace
          </Link>
          <Link
            to="/privacy"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            Terms
          </Link>
          <span className="text-[#a0a4ab] dark:text-[#60646c]">
            © {new Date().getFullYear()} Vinod Jangid
          </span>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
