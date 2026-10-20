import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between px-6 sm:px-16 py-6 text-sm text-[#71717a] dark:text-[#a1a1aa] bg-white dark:bg-[#121214] border-t border-[#e4e4e7] dark:border-[#2e2e34] gap-4 select-none font-sans">
      <div className="flex items-center gap-3">
        <span>© {new Date().getFullYear()} Proxima.</span>
        <span>•</span>
        <span>
          Built by{" "}
          <a
            href="https://github.com/vinodjangid07"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium text-[#18181b] dark:text-[#f4f4f5] hover:text-[#5645d4] dark:hover:text-[#8b5cf6] transition-colors"
          >
            Vinod Jangid
          </a>
        </span>
      </div>

      <div className="flex items-center gap-6 font-medium">
        <Link
          to="/privacy"
          className="hover:text-[#18181b] dark:hover:text-[#f4f4f5] transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="hover:text-[#18181b] dark:hover:text-[#f4f4f5] transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
