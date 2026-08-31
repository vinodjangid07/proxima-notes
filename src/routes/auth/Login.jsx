import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate('/notes');
      })
      .catch((error) => {
        console.error("Google Auth error:", error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/notes');
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col md:flex-row w-full h-screen overflow-hidden relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all select-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Left Half*/}
      <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden bg-zinc-950">
        <img 
          src="/proxima_centauri.webp" 
          alt="Proxima Centauri" 
          className="w-full h-full object-cover select-none pointer-events-none opacity-80" 
        />
      </div>

      {/* Right Half*/}
      <main className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center px-6 py-12 sm:py-16">
        <div className="max-w-sm w-full flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-[0.25em]">
              Proxima
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Welcome Back</h1>
            <p className="text-sm text-zinc-555 dark:text-zinc-400">Sign in to sync your local workspace.</p>
          </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-2.5 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-550 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-2.5 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-550 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer mt-2"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800/60"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800/60"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-200 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              <img
                className="w-5 h-5 shrink-0"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <span>Continue with Google</span>
            </button>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-2">
              New to Proxima?{" "}
              <Link
                to="/signup"
                className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </main>
      </div>
  );
};

export default Login;