import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import useAuth from "../../context/useAuth";
import { toast } from "react-toastify";

const HeroStage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithPopup(auth, provider);
      toast.success("Welcome to Proxima!");
      navigate("/notes");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Failed to sign in with Google.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-20 sm:pt-36 pb-10 sm:pb-28">
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[520px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/35 via-blue-100/10 to-transparent dark:from-[#15243b]/50 dark:via-[#0e1626]/20 dark:to-transparent -z-10 blur-2xl" 
      />

      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-[-1.92px] leading-[1.05] text-[#171717] dark:text-white max-w-4xl text-balance select-none">
          Write at the speed of thought. Never lose an idea.
        </h1>

        <p className="text-base sm:text-lg text-[#60646c] dark:text-[#a0a4ab] mt-6 max-w-2xl font-normal leading-relaxed text-balance">
          A quiet, local-first workspace. Works 100% offline, stores in open Markdown, and syncs across your devices without account barriers.
        </p>

        <div className="mt-8">
          {currentUser ? (
            <Link
              to="/notes"
              className="h-10 px-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs"
            >
              <span>Open workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="h-10 px-5 inline-flex items-center gap-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#f0f0f0] transition-all active:scale-98 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>{isSigningIn ? "Signing in..." : "Continue with Google"}</span>
              </button>

              <Link
                to="/notes"
                className="h-10 px-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-[#f0f0f3] dark:bg-[#1c1c21] text-[#171717] dark:text-white hover:bg-[#e4e5e9] dark:hover:bg-[#25252c] transition-all active:scale-98 shadow-xs"
              >
                <span>Try as guest</span>
                <ArrowRight className="w-4 h-4 text-[#60646c] dark:text-[#a0a4ab]" />
              </Link>
            </div>
          )}
        </div>

        <div className="relative w-full max-w-[1060px] mt-8 sm:mt-14 select-none">
          <div className="relative w-full rounded-2xl bg-[#fafafb] dark:bg-[#151518] shadow-[0_30px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden">
            <img
              src="/notes-preview-black.webp"
              alt="Proxima Notes Workspace Dark UI"
              className="w-full h-auto object-cover rounded-2xl block dark:hidden"
            />
            <img
              src="/notes-preview-white.webp"
              alt="Proxima Notes Workspace Light UI"
              className="w-full h-auto object-cover rounded-2xl hidden dark:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroStage;
