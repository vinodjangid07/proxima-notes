import HomeNav from "../components/Home/HomeNav";
import HeroStage from "../components/Home/HeroStage";
import ProofMetrics from "../components/Home/ProofMetrics";
import ScrollStory from "../components/Home/ScrollStory";
import PastelCollage from "../components/Home/PastelCollage";
import KeyboardBento from "../components/Home/KeyboardBento";
import ZeroLockIn from "../components/Home/ZeroLockIn";
import FinalCTA from "../components/Home/FinalCTA";
import HomeFooter from "../components/Home/HomeFooter";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e11] text-[#171717] dark:text-[#ededed] transition-colors duration-200 flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
      <HomeNav />
      <main className="flex-1 flex flex-col w-full">
        <HeroStage />
        <ProofMetrics />
        <ScrollStory />
        <PastelCollage />
        <KeyboardBento />
        <ZeroLockIn />
        <FinalCTA />
      </main>
      <HomeFooter />
    </div>
  );
};

export default Home;