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
    <div className="min-h-screen bg-white dark:bg-[#121214] px-6 sm:px-12 py-10 sm:py-16 text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200 w-full flex flex-col justify-start items-center font-sans">
      <div className="w-full max-w-4xl flex flex-col gap-8 sm:gap-10">
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#52525b] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] transition-colors self-start select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>

        {currentUser ? (
          <div className="flex flex-col w-full gap-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#e4e4e7] dark:border-[#2e2e34]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#f4f4f5] dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] flex items-center justify-center shrink-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-8 h-8 text-[#71717a] dark:text-[#a1a1aa]" />
                )}
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5]">
                  {currentUser.displayName || "Personal Profile"}
                </h1>
                <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] mt-1 font-normal">
                  Manage your synchronized notes workspace and account settings
                </p>
              </div>
            </div>

            {/* Account Details Cards */}
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

            {/* Logout Action */}
            <div className="pt-4 flex justify-start">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] text-[#71717a] dark:text-[#a1a1aa]">
            Please sign in to view your profile settings.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
