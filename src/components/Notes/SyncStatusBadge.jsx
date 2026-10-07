import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const SyncStatusBadge = () => {
    const isOnline = useOnlineStatus();

    return isOnline ? (
        <span className="h-7 inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/30 px-3 rounded-full whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Synced
        </span>
    ) : (
        <span className="h-7 inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 px-3 rounded-full whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Offline
        </span>
    );
};

export default SyncStatusBadge;
