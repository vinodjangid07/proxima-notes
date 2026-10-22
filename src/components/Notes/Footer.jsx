import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#fafafb] dark:bg-[#121215] py-8 sm:py-10 select-none font-sans text-xs text-[#60646c] dark:text-[#a0a4ab]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src="/proxima_logo.webp"
            alt="Proxima Logo"
            className="w-4 h-4 object-contain invert dark:invert-0 opacity-70"
          />
          <span>© {new Date().getFullYear()} Proxima. Local-first markdown workspace.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/privacy"
            className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
