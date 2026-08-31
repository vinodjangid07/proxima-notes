import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import useAuth from "../context/useAuth";
import Navbar from "../components/Notes/Navbar";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center px-8 sm:px-16 max-w-5xl mx-auto w-full py-16 sm:py-24">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-505 uppercase tracking-[0.3em]">
            Minimal Notepad / Local First
          </span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl leading-[1.15]">
            A quiet space for <br />
            your thoughts.
          </h1>
          <p className="text-base sm:text-lg text-zinc-550 dark:text-zinc-400 max-w-xl leading-relaxed mt-2">
            A fast, local-first note-taking workspace designed for speed and focus. Free of database latency, heavy accounts, or cloud tracking.
          </p>
          <div className="mt-4">
            {currentUser ? (
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer"
              >
                Open Workspace
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center justify-center gap-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20 text-zinc-700 dark:text-zinc-200 px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer w-full sm:w-auto"
                >
                  <img
                    className="w-5 h-5 shrink-0"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    loading="lazy"
                    alt="google logo"
                  />
                  <span>Continue with Google</span>
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer w-full sm:w-auto text-center"
                >
                  <span>Continue with Email</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-t border-zinc-250/50 dark:border-zinc-900 w-full mt-20" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              01 / Offline First
            </span>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Seamless Local Sync
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Write notes instantly with zero network delay. Your work is cached locally in real time and automatically syncs to your account when connected.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              02 / Editorial Layout
            </span>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Designed for Writing
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Equipped with Title input and multiline Textareas to help you type out detailed logs and paragraphs without clutter.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              03 / Keyboard Simplicity
            </span>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Clean Monochrome
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              No distracting gradients, glows, or animations. Just solid typography that makes writing look premium.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full h-16 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between px-8 sm:px-16 shrink-0 text-[10px] sm:text-xs text-zinc-450 dark:text-zinc-500">
        <span>© {new Date().getFullYear()} PROXIMA. ALL RIGHTS RESERVED.</span>
        <span>DESIGNED FOR WRITERS.</span>
      </footer>
    </div>
  );
};

export default Home;