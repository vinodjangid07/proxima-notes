import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import useAuth from "../../context/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import BackHomeButton from "../../components/common/BackHomeButton";
import AuthInput from "../../components/common/AuthInput";
import AuthDivider from "../../components/common/AuthDivider";
import GoogleAuthButton from "../../components/common/GoogleAuthButton";

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
        document.title = "Sign Up — Proxima";
        if (!loading && currentUser) {
            navigate('/notes');
        }
    }, [currentUser, loading, navigate]);

    const handleGoogleLogin = () => {
        setIsSubmitting(true);
        signInWithPopup(auth, provider)
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

    const handleSignup = (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        if (!name || !email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, {
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
        <div className="min-h-screen bg-white dark:bg-[#0e0e11] text-[#171717] dark:text-[#ededed] transition-colors duration-200 flex flex-col md:flex-row w-full h-screen overflow-hidden relative font-sans">
            <BackHomeButton />

            <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden bg-[#171717]">
                <img 
                  src="/proxima_centauri.webp" 
                  alt="Proxima Centauri Space Visual" 
                  className="w-full h-full object-cover select-none pointer-events-none opacity-85" 
                />
            </div>

            <main className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center px-6 py-12">
                <div className="max-w-sm w-full flex flex-col gap-7">
                    <div className="flex flex-col gap-1.5 select-none">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">Create your account</h1>
                        <p className="text-sm text-[#60646c] dark:text-[#a0a4ab]">Start taking notes with instant local storage and cloud sync</p>
                    </div>

                    <form onSubmit={handleSignup} className="flex flex-col gap-4">
                        <AuthInput
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                        />

                        <AuthInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="name@domain.com"
                        />

                        <AuthInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 bg-[#000000] hover:bg-[#1a1a1a] text-white dark:bg-white dark:hover:bg-[#f0f0f3] dark:text-[#171717] rounded-lg font-medium text-sm transition-colors cursor-pointer mt-1 active:scale-98 flex items-center justify-center gap-2 select-none shadow-xs disabled:opacity-60"
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

                    <AuthDivider />

                    <GoogleAuthButton
                        disabled={isSubmitting}
                        onClick={handleGoogleLogin}
                    />

                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] text-center">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-[#0d74ce] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Signup;