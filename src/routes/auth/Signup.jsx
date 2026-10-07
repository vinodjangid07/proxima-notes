import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import useAuth from "../../context/useAuth";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed.';
    default:
      return 'Failed to create account. Please check your details.';
  }
};

const Signup = () => {
    const navigate = useNavigate();
    const { currentUser, loading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && currentUser) {
            navigate('/notes', { replace: true });
        }
    }, [currentUser, loading, navigate]);

    const handleGoogleLogin = () => {
        setIsSubmitting(true);
        signInWithPopup(auth, provider)
            .then(() => {
                toast.success("Account created!");
                navigate('/notes');
            })
            .catch((error) => {
                toast.error(getAuthErrorMessage(error.code));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return updateProfile(userCredential.user, {
                    displayName: name
                });
            })
            .then(() => {
                toast.success("Account created successfully!");
                navigate('/notes');
            })
            .catch((error) => {
                toast.error(getAuthErrorMessage(error.code));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col md:flex-row w-full h-screen overflow-hidden relative">
            <Link 
                to="/" 
                className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all select-none"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
            </Link>

            {/* Left side image */}
            <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden bg-zinc-950">
                <img 
                  src="/proxima_centauri.webp" 
                  alt="Proxima Centauri Inspiring Space Visual" 
                  className="w-full h-full object-cover select-none pointer-events-none opacity-85" 
                />
            </div>

            {/* Right side */}
            <main className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center px-6 py-12">
                <div className="max-w-sm w-full flex flex-col gap-8">
                    <div className="flex flex-col gap-2 select-none">
                        <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">Create Account</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Join Proxima and sync your workspace</p>
                    </div>

                    <form onSubmit={handleSignup} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-zinc-100 dark:bg-zinc-900/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@domain.com"
                                className="w-full bg-zinc-100 dark:bg-zinc-900/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-zinc-100 dark:bg-zinc-900/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 py-3 rounded-xl font-medium text-xs transition-all cursor-pointer mt-2 active:scale-98 flex items-center justify-center gap-2 select-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    <div className="relative flex items-center justify-center select-none">
                        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
                        <span className="bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-400 dark:text-zinc-500 absolute font-medium">or</span>
                    </div>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-medium text-xs transition-all cursor-pointer select-none"
                    >
                        <img
                            className="w-4.5 h-4.5 shrink-0"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            loading="lazy"
                            alt="Google"
                        />
                        <span>Continue with Google</span>
                    </button>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
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