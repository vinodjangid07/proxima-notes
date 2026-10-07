import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between px-6 sm:px-16 py-6 text-xs text-zinc-400 dark:text-zinc-500 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md gap-4 select-none border-t border-zinc-100/50 dark:border-zinc-900/50">
      <div className="flex items-center gap-3">
        <span>© {new Date().getFullYear()} Proxima Notes.</span>
        <span>•</span>
        <span>
          Built by{" "}
          <a
            href="https://github.com/vinodjangid07"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            Vinod Jangid
          </a>
        </span>
      </div>

      <div className="flex items-center gap-6 font-medium">
        <Link
          to="/privacy"
          className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
