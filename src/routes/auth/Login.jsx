import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
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
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email address or password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed.';
    default:
      return 'Failed to sign in. Please check your credentials.';
  }
};

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/notes');
    }
  }, [currentUser, navigate]);

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success("Welcome back!");
        navigate('/notes');
      })
      .catch((error) => {
        toast.error(getAuthErrorMessage(error.code));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Welcome back!");
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
    <div className="min-h-screen bg-white dark:bg-[#0e0e11] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200 flex flex-col md:flex-row w-full h-screen overflow-hidden relative font-sans">
      <BackHomeButton />

      <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden bg-[#18181b]">
        <img 
          src="/proxima_centauri.webp" 
          alt="Proxima Centauri Space Visual" 
          className="w-full h-full object-cover select-none pointer-events-none opacity-85" 
        />
      </div>

      <main className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full flex flex-col gap-7">
          <div className="flex flex-col gap-1.5 select-none">
            <h1 className="text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ffffff]">Welcome back</h1>
            <p className="text-sm text-[#60646c] dark:text-[#b0b4ba]">Sign in to access and synchronize your notes</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="w-full h-11 bg-[#000000] hover:bg-[#1a1a1a] text-white dark:bg-[#ffffff] dark:text-[#000000] dark:hover:bg-[#f0f0f3] rounded-lg font-medium text-sm transition-colors cursor-pointer mt-1 active:scale-98 flex items-center justify-center gap-2 select-none shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <AuthDivider />

          <GoogleAuthButton
            disabled={isSubmitting}
            onClick={handleGoogleLogin}
          />

          <p className="text-sm text-[#60646c] dark:text-[#b0b4ba] text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#0d74ce] hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;