import useAuth from "../context/useAuth";
import { Link } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";

const Profile = () => {
    const { currentUser, loading, logout } = useAuth();

    const isGoogle = currentUser?.providerData?.some(
        (provider) => provider.providerId === "google.com"
    );

    const notesCount = (() => {
        const savedNotes = localStorage.getItem('Notes List');
        return savedNotes ? JSON.parse(savedNotes).length : 0;
    })();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('Notes List');
        window.dispatchEvent(new Event("local-logout"));
    };

    if (loading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 sm:px-16 py-8 sm:py-24 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 w-full flex flex-col justify-start items-center">
            <div className="w-full max-w-5xl flex flex-col gap-6 sm:gap-10">
                <Link to="/notes" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Workspace
                </Link>

                {currentUser ? (
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col gap-6">
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-505 uppercase tracking-[0.3em]">
                                Account / Settings
                            </span>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-2">
                                {/* User Avatar */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400 dark:text-zinc-650" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
                                        {currentUser.displayName || "Personal Profile"}
                                    </h1>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        Managing details for your synchronized workspace.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-t border-zinc-250/50 dark:border-zinc-900 w-full mt-8 sm:mt-16 mb-4 sm:mb-8" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 py-6 md:py-12">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    01 / Contact
                                </span>
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    {currentUser.email || "No email"}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    Authenticated via {isGoogle ? "Google Account" : "Email Account"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    02 / Member Since
                                </span>
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    {currentUser.metadata?.creationTime
                                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : "Unknown"}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    Profile creation date on server
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    03 / Workspace
                                </span>
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    {notesCount} Notes
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    Saved locally in browser cache
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-zinc-250/50 dark:border-zinc-900">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer w-full sm:w-auto text-center"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20 dark:bg-zinc-900/5 text-zinc-400 dark:text-zinc-500">
                        Please sign in to view your profile settings.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
