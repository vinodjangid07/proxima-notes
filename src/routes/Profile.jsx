import useAuth from "../context/useAuth";
import { Link } from "react-router-dom";
import ProfileStatCard from "../components/common/ProfileStatCard";
import { User, ArrowLeft, Mail, Calendar, BookOpen, LogOut } from "lucide-react";

const Profile = () => {
  const { currentUser, loading, logout } = useAuth();

  const isGoogle = currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com",
  );

  const notesCount = (() => {
    const savedNotes = localStorage.getItem("Notes List");
    return savedNotes ? JSON.parse(savedNotes).length : 0;
  })();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("Notes List");
    window.dispatchEvent(new Event("local-logout"));
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
            <div className="rounded-3xl bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-xs">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#f0f0f3] dark:bg-[#111113] border border-[#dcdee0] dark:border-[#27272a] flex items-center justify-center shrink-0">
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
                value={`${notesCount} ${notesCount === 1 ? "Note" : "Notes"}`}
                subtext="Cached locally & synchronized"
              />
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-white dark:bg-[#161619] border border-[#dcdee0] dark:border-[#27272a] text-[#60646c] dark:text-[#a0a4ab] shadow-xs">
            Please sign in to view your profile settings.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
