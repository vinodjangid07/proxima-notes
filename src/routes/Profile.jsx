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
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-6 sm:px-16 py-12 sm:py-24 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 w-full flex flex-col justify-start items-center font-sans">
            <div className="w-full max-w-5xl flex flex-col gap-8 sm:gap-12">
                <Link to="/notes" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start select-none">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Workspace
                </Link>

                {currentUser ? (
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col gap-6 select-none">
                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em]">
                                Account / Settings
                            </span>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-2">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 shadow-sm">
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                                        {currentUser.displayName || "Personal Profile"}
                                    </h1>
                                    <p className="text-base text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                                        Managing details for your synchronized workspace.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 pb-10">
                            <div className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-900 p-5 rounded-2xl">
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    01 / Contact
                                </span>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {currentUser.email || "No email"}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    Authenticated via {isGoogle ? "Google Account" : "Email Account"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-900 p-5 rounded-2xl">
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    02 / Member Since
                                </span>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {currentUser.metadata?.creationTime
                                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : "Unknown"}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    Profile creation date on server
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-900 p-5 rounded-2xl">
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    03 / Workspace
                                </span>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {notesCount} Notes
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    Saved locally in browser cache
                                </p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer w-full sm:w-auto text-center shadow-xs"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                        Please sign in to view your profile settings.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
