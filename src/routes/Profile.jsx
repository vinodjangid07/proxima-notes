import useAuth from "../context/useAuth";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Calendar, ArrowLeft } from "lucide-react";

const Profile = () => {
    const { currentUser } = useAuth();
    
    const isGoogle = currentUser?.providerData?.some(
        (provider) => provider.providerId === "google.com"
    );

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-8 py-24 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 w-full flex flex-col items-center">
            <div className="w-full max-w-xl flex flex-col gap-8">
                <Link to="/notes" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Workspace
                </Link>

                {currentUser ? (
                    <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 flex flex-col gap-8 shadow-sm">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
                            <div className="w-24 h-24 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                                )}
                            </div>
                            
                            <div className="text-center sm:text-left flex flex-col gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                                    {currentUser.displayName || "Anonymous User"}
                                </h1>
                                <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400">
                                    <Shield className="w-3.5 h-3.5" />
                                    {isGoogle ? "Google Account" : "Email Account"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Display Name</span>
                                    <span className="text-base font-semibold text-zinc-850 dark:text-zinc-100">{currentUser.displayName || "Not set"}</span>
                                </div>
                                <User className="w-5 h-5 text-zinc-400 dark:text-zinc-650 shrink-0" />
                            </div>

                            <div className="flex items-center justify-between py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Email Address</span>
                                    <span className="text-base font-semibold text-zinc-850 dark:text-zinc-100">{currentUser.email || "No email available"}</span>
                                </div>
                                <Mail className="w-5 h-5 text-zinc-400 dark:text-zinc-650 shrink-0" />
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Account Creation Date</span>
                                    <span className="text-base font-semibold text-zinc-850 dark:text-zinc-100">
                                        {currentUser.metadata?.creationTime 
                                            ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                              }) 
                                            : "Unknown"}
                                    </span>
                                </div>
                                <Calendar className="w-5 h-5 text-zinc-400 dark:text-zinc-650 shrink-0" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 text-center text-zinc-500 dark:text-zinc-400">
                        Please sign in to view your profile settings.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
