import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import useAuth from "../../context/useAuth";
import { HOME_SITE } from "../../data/homeContent";

const HeroStage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithPopup(auth, provider);
      const { toast } = await import("react-toastify");
      toast.success("Welcome to Proxima!");
      navigate("/notes");
    } catch (err) {
      if (err?.code !== "auth/popup-closed-by-user") {
        const { toast } = await import("react-toastify");
        toast.error("Failed to sign in with Google.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <section className="relative w-full pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 lg:pb-32 overflow-x-clip">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          <div className="lg:col-span-8">
            <h1
              data-split="lines"
              data-intro
              className="t-display-hero text-[#141416] dark:text-[#f4f4f2] max-w-[16ch] select-none"
            >
              {HOME_SITE.hero.headlineStart} {HOME_SITE.hero.headlineItalic}
            </h1>
          </div>

          <div
            data-reveal="up"
            data-intro
            data-delay="0.12"
            className="lg:col-span-4 flex flex-col items-start gap-6 lg:pb-1"
          >
            <p className="text-base sm:text-[17px] leading-[1.55] text-[#565961] dark:text-[#a1a4ab] max-w-[38ch]">
              {HOME_SITE.hero.subhead}
            </p>

            {currentUser ? (
              <Link
                to="/notes"
                data-fill
                data-magnetic="0.18"
                className="flood-btn flood-btn--solid group h-11 px-6 inline-flex items-center gap-2.5 rounded-lg text-sm font-medium"
              >
                <span className="flood-btn__fill" aria-hidden="true" />
                <span>{HOME_SITE.hero.signedInCta}</span>
                <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            ) : (
              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  data-fill
                  data-magnetic="0.16"
                  className="flood-btn flood-btn--solid h-11 px-5 inline-flex items-center gap-2.5 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-60"
                >
                  <span className="flood-btn__fill" aria-hidden="true" />
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>
                    {isSigningIn
                      ? HOME_SITE.hero.signingInCta
                      : HOME_SITE.hero.primaryCta}
                  </span>
                </button>

                <Link
                  to="/notes"
                  className="link-editorial group inline-flex items-center gap-1.5 text-sm font-medium text-[#141416] dark:text-[#f4f4f2] min-h-[40px]"
                >
                  <span>{HOME_SITE.hero.secondaryCta}</span>
                  <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div
          data-reveal="clip"
          data-intro
          data-delay="0.22"
          className="mt-12 sm:mt-16 lg:mt-20 lg:w-[92%] lg:ml-auto overflow-clip rounded-2xl bg-[#f0efe9] dark:bg-[#131317]"
        >
          <div data-parallax="0.035">
            <img
              src="/notes-preview-black.webp"
              alt="Proxima Notes workspace in dark mode showing local notes grid and sidebar tags"
              width="1919"
              height="1079"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto block dark:hidden"
            />
            <img
              src="/notes-preview-white.webp"
              alt="Proxima Notes workspace in light mode showing pastel note cards and search bar"
              width="1919"
              height="1079"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto hidden dark:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroStage;
