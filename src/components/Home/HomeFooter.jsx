import { Link } from "react-router-dom";
import { HOME_SITE } from "../../data/homeContent";

const HomeFooter = () => {
  return (
    <footer className="w-full py-10 sm:py-14 select-none">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs sm:text-sm text-[#565961] dark:text-[#a1a4ab]">
        <div className="flex flex-wrap items-center gap-3">
          <img
            src="/proxima_logo.webp"
            alt="Proxima Logo"
            width="20"
            height="20"
            className="w-5 h-5 object-contain invert dark:invert-0 rounded"
          />
          <span className="font-medium text-[#141416] dark:text-[#f4f4f2]">
            {HOME_SITE.name}
          </span>
          <span>{HOME_SITE.tagline}</span>
          <span className="hidden sm:inline opacity-60">
            {HOME_SITE.footer.colophon}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {HOME_SITE.footer.links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex items-center min-h-[36px] hover:text-[#141416] dark:hover:text-[#f4f4f2] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <span className="text-[#565961] dark:text-[#8e929b]">
            © {new Date().getFullYear()} Vinod Jangid
          </span>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
