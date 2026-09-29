import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../lib/firebase";
import { ArrowLeft } from "lucide-react";

const Signup = () => {
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

    const handleSignup = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return updateProfile(userCredential.user, {
                    displayName: name
                });
            })
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
                className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all select-none"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
            </Link>

            <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden bg-zinc-950">
                <img 
                  src="/proxima_centauri.webp" 
                  alt="Proxima Centauri" 
                  className="w-full h-full object-cover select-none pointer-events-none opacity-80" 
                />
            </div>

            <main className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center px-6 py-12 sm:py-16">
                <div className="max-w-sm w-full flex flex-col gap-8 bg-zinc-50 dark:bg-zinc-900/40 p-8 sm:p-10 rounded-[2rem] shadow-sm">
                    <div className="flex flex-col gap-2 text-center select-none">
                        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em]">
                            Proxima Notes
                        </span>
                            <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">Create Account</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Join Proxima and sync your notes locally.</p>
                        </div>

                        <form onSubmit={handleSignup} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@domain.com"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer mt-2 shadow-xs select-none"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="relative flex py-1 items-center justify-center select-none">
                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">or</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer select-none"
                        >
                            <img
                                className="w-4.5 h-4.5 shrink-0"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                loading="lazy"
                                alt="google logo"
                            />
                            <span>Continue with Google</span>
                        </button>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
    );
};

export default Signup;