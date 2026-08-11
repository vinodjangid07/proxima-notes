import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const SyncStatusBadge = () => {
    const isOnline = useOnlineStatus();

    return isOnline ? (
        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full border border-green-200/50 dark:border-green-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Synced
        </span>
    ) : (
        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-650 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-200/50 dark:border-amber-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Offline
        </span>
    );
};

export default SyncStatusBadge;
