import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 w-full bg-white dark:bg-[#0e0e11] border-t border-[#dcdee0] dark:border-[#27272a] select-none font-sans text-sm text-[#60646c] dark:text-[#a0a4ab]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/proxima_logo.webp"
              alt="Proxima"
              className="w-6 h-6 object-contain invert dark:invert-0 shrink-0"
            />
            <span className="font-semibold text-base tracking-tight text-[#171717] dark:text-[#ededed]">
              Proxima
            </span>
          </Link>
          <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
            Local-first markdown notes workspace.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider">
            Product
          </span>
          <Link to="/notes" className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
            Workspace
          </Link>
          <Link to="/login" className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
            Sign Up
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider">
            Open Source
          </span>
          <a
            href="https://github.com/vinodjangid07/proxima-notes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/vinodjangid07/proxima-notes/blob/master/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            MIT License
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider">
            Legal
          </span>
          <Link to="/privacy" className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-xs text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="border-t border-[#f0f0f3] dark:border-[#202024] px-6 sm:px-12 py-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>
            © {new Date().getFullYear()} Proxima. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
              Terms
            </Link>
            <a
              href="https://github.com/vinodjangid07/proxima-notes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
