import { useEffect } from "react";
import { Link } from "react-router-dom";
import HomeNav from "../components/Home/HomeNav";
import HomeFooter from "../components/Home/HomeFooter";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | Proxima";
  }, []);

  return (
    <div className="home-editorial min-h-screen bg-[#faf9f6] dark:bg-[#09090b] text-[#141416] dark:text-[#f4f4f2] flex flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <HomeNav />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 flex items-center w-full py-20"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="max-w-2xl flex flex-col items-start gap-6">
            <span className="font-mono text-xs text-[#565961] dark:text-[#a1a4ab]">
              404 coordinate
            </span>
            <h1 className="t-display-hero text-[#141416] dark:text-[#f4f4f2]">
              Beyond the nearest star.
            </h1>
            <p className="text-base sm:text-lg text-[#565961] dark:text-[#a1a4ab] leading-relaxed">
              This route sits outside the workspace. Any notes you created remain safely stored inside your local device database.
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                to="/notes"
                className="h-11 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-[#141416] text-[#faf9f6] dark:bg-[#f4f4f2] dark:text-[#09090b]"
              >
                <span>Open workspace</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/"
                className="link-editorial text-sm font-medium min-h-[36px] inline-flex items-center"
              >
                Return home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

export default NotFound;
