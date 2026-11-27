import { useEffect, useLayoutEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { bootHomeEngine, setGlTheme } from "../engine";
import HomeNav from "../components/Home/HomeNav";
import HeroStage from "../components/Home/HeroStage";
import ProximityIndex from "../components/Home/ProximityIndex";
import StickyWritingFlow from "../components/Home/StickyWritingFlow";
import TonalFloodSection from "../components/Home/TonalFloodSection";
import CommandLedger from "../components/Home/CommandLedger";
import MarkdownSplit from "../components/Home/MarkdownSplit";
import FinalCTA from "../components/Home/FinalCTA";
import HomeFooter from "../components/Home/HomeFooter";

const Home = () => {
  const { resolvedTheme } = useTheme();
  const rootRef = useRef(null);
  const initialDarkRef = useRef(resolvedTheme !== "light");

  useEffect(() => {
    document.title = "Proxima | Local-First Workspace";
  }, []);

  useLayoutEffect(() => {
    const cleanup = bootHomeEngine({
      root: rootRef.current || document,
      isDark: initialDarkRef.current,
    });
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("preload");
    });
    return cleanup;
  }, []);

  useEffect(() => {
    setGlTheme(resolvedTheme !== "light");
  }, [resolvedTheme]);

  return (
    <div
      ref={rootRef}
      className="home-editorial relative min-h-screen bg-[#faf9f6] dark:bg-[#09090b] text-[#141416] dark:text-[#f4f4f2] transition-colors duration-300 flex flex-col selection:bg-[#141416] selection:text-[#faf9f6] dark:selection:bg-[#f4f4f2] dark:selection:text-[#09090b]"
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div id="gl" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <HomeNav />
        <main id="main" tabIndex={-1} className="flex-1 flex flex-col w-full">
          <HeroStage />
          <ProximityIndex />
          <StickyWritingFlow />
          <TonalFloodSection />
          <CommandLedger />
          <MarkdownSplit />
          <FinalCTA />
        </main>
        <HomeFooter />
      </div>
    </div>
  );
};

export default Home;
