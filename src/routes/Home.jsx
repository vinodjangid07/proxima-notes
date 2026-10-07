import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import useAuth from "../context/useAuth";
import Navbar from "../components/Notes/Navbar";
import Footer from "../components/Notes/Footer";
import { ArrowRight, Zap } from "lucide-react";

const Home = () => {
  const { currentUser } = useAuth();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        console.log("Logged In");
      })
      .catch((error) => {
        console.error("Login error:", error.message);
      });
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col font-sans overflow-hidden">

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-zinc-950"></div>
        
        {/* Dot pattern with depth mask */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,white,transparent_90%)] opacity-60"></div>
      </div>
      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-16 max-w-5xl mx-auto w-full py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 max-w-6xl w-full mt-10">
          <div className="flex flex-col gap-6 w-full lg:w-7/12">
            <div className="flex items-center gap-4 mb-2 opacity-80">
              <div className="h-px w-8 sm:w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] font-mono">
                Proxima / Local First
              </span>
              <div className="h-px w-8 sm:w-12 bg-zinc-300 dark:bg-zinc-700"></div>
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] font-light tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[0.95]">
              A quiet <br/>
              <span className="font-serif italic text-zinc-400 dark:text-zinc-500 pr-2">space</span> for <br/>
              thoughts.
            </h1>
          </div>
          
          <div className="w-full lg:w-5/12 flex flex-col gap-8 lg:pb-3">
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium max-w-md">
              A fast, local-first note-taking workspace designed for speed and focus. Free of database latency, heavy accounts, or cloud tracking.
            </p>
            <div className="flex flex-col gap-4">
              {currentUser ? (
                <Link
                  to="/notes"
                  className="inline-flex items-center justify-between gap-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer select-none max-w-xs"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                  <button
                    onClick={handleLogin}
                    className="flex-1 inline-flex items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none"
                  >
                    <img
                      className="w-4.5 h-4.5 shrink-0"
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      loading="lazy"
                      alt="google logo"
                    />
                    <span>Google</span>
                  </button>

                  <Link
                    to="/login"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer text-center select-none"
                  >
                    <span>Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-16 sm:mt-32"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-12 relative z-10">
          
          {/* Card 1: Wide */}
          <div className="lg:col-span-8 group relative flex flex-col justify-end p-8 sm:p-10 bg-zinc-50 dark:bg-zinc-900/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <div className="absolute top-8 right-8 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-500">
              <Zap className="w-10 h-10" strokeWidth={1} />
            </div>
            
            <div className="relative z-10 mt-12">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-4 block uppercase tracking-widest">01 / Architecture</span>
              <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
                Zero network delay.
              </h3>
              <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
                Write notes instantly. Your work is cached locally in real time and automatically syncs to your account when connected.
              </p>
            </div>
          </div>

          {/* Card 2: Tall */}
          <div className="lg:col-span-4 group relative flex flex-col p-8 sm:p-10 bg-zinc-950 dark:bg-zinc-100 rounded-[2.5rem] overflow-hidden text-zinc-100 dark:text-zinc-900 transition-transform duration-500 hover:-translate-y-1">
             <div className="relative z-10 flex-1 flex flex-col h-full">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-4 block uppercase tracking-widest">02 / Editor</span>
              
              <div className="flex-1 min-h-[60px] flex items-center justify-center py-6">
                 <div className="w-full h-px bg-zinc-700 dark:bg-zinc-300 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-100 dark:bg-zinc-900 rotate-45"></div>
                 </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3 mt-auto">
                Designed for Writing.
              </h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-600 leading-relaxed">
                Equipped with Title inputs and multiline Textareas to help you type out detailed logs and paragraphs without clutter.
              </p>
            </div>
          </div>

          {/* Card 3: Full width */}
          <div className="lg:col-span-12 group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 sm:p-12 bg-transparent rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] pointer-events-none group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex-1 max-w-2xl">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-4 block uppercase tracking-widest">03 / Aesthetics</span>
              <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
                Monochrome Minimalism.
              </h3>
              <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                No distracting gradients, glows, or unnecessary popups inside your workspace. Just solid typography that makes writing feel focused and personal.
              </p>
            </div>
            
            <div className="relative z-10 hidden md:flex shrink-0 w-32 h-32 ml-8 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 items-center justify-center group-hover:rotate-90 transition-transform duration-1000 ease-in-out">
               <span className="font-serif text-5xl text-zinc-300 dark:text-zinc-700 italic pr-1">*</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;