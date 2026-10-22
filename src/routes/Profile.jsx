import { useMemo } from "react";
import useAuth from "../context/useAuth";
import useNotesContext from "../context/useNotesContext";
import { Link, useNavigate } from "react-router-dom";
import ProfileStatCard from "../components/common/ProfileStatCard";
import { User, ArrowLeft, Mail, Calendar, BookOpen, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentUser, loading, logout } = useAuth();
  const { notes } = useNotesContext();
  const navigate = useNavigate();

  const isGoogle = currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com",
  );

  const activeNotesCount = useMemo(() => {
    return Array.isArray(notes) ? notes.filter((n) => !n.deletedAt).length : 0;
  }, [notes]);

  const handleLogout = async () => {
    try {
      await logout();
      window.dispatchEvent(new Event("local-logout"));
      toast.success("Signed out successfully");
      navigate("/notes");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return null;
  }

    return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e11] px-6 sm:px-12 py-10 sm:py-16 text-[#171717] dark:text-[#ededed] transition-colors duration-200 w-full flex flex-col justify-start items-center font-sans">
      <div className="w-full max-w-4xl flex flex-col gap-8 sm:gap-10">
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-white transition-colors self-start select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>

        {currentUser ? (
          <div className="flex flex-col w-full gap-8">
            <div className="rounded-3xl bg-[#f8f8fa] dark:bg-[#161619] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-xs">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white dark:bg-[#111113] flex items-center justify-center shrink-0 shadow-2xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-8 h-8 text-[#60646c] dark:text-[#a0a4ab]" />
                )}
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] dark:text-white">
                  {currentUser.displayName || "Personal Profile"}
                </h1>
                <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] mt-1 font-normal">
                  Manage your synchronized notes workspace and account settings
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ProfileStatCard
                icon={Mail}
                label="Email Address"
                value={currentUser.email || "No email"}
                subtext={`Authenticated via ${isGoogle ? "Google Account" : "Email Account"}`}
              />

              <ProfileStatCard
                icon={Calendar}
                label="Member Since"
                value={
                  currentUser.metadata?.creationTime
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown"
                }
                subtext="Account registration date"
              />

              <ProfileStatCard
                icon={BookOpen}
                label="Workspace Notes"
                value={`${activeNotesCount} ${activeNotesCount === 1 ? "Note" : "Notes"}`}
                subtext="Cached locally & synchronized"
              />
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-[#f8f8fa] dark:bg-[#161619] text-[#60646c] dark:text-[#a0a4ab] shadow-xs flex flex-col items-center gap-4">
            <p className="text-sm">Please sign in to view your profile settings.</p>
            <Link
              to="/login"
              className="h-10 px-5 inline-flex items-center justify-center bg-black hover:bg-[#1a1a1a] text-white dark:bg-white dark:hover:bg-[#f0f0f3] dark:text-[#171717] rounded-lg font-medium text-xs sm:text-sm transition-all shadow-xs active:scale-98"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
