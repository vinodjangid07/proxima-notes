import { memo } from "react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { CloudCheck, Loader2, CloudAlert, CloudOff } from "lucide-react";

const SyncStatusBadge = memo(({ status, pendingCount = 0, onRetry, className = "" }) => {
    const isOnline = useOnlineStatus();
    const effectiveStatus = status || (isOnline ? "synced" : "offline");

    if (effectiveStatus === "syncing" || effectiveStatus === "saving") {
        return (
            <span 
                className={`inline-flex items-center justify-center select-none ${className}`}
                title="Saving changes..."
            >
                <Loader2 className="w-4 h-4 animate-spin text-blue-500/85" />
            </span>
        );
    }

    if (effectiveStatus === "offline" || !isOnline) {
        return (
            <span 
                className={`inline-flex items-center justify-center select-none ${className}`}
                title={pendingCount > 0 ? `Working offline (${pendingCount} pending local changes)` : "Working offline"}
            >
                <CloudOff className="w-4 h-4 text-amber-500/80" />
            </span>
        );
    }

    if (effectiveStatus === "error" || effectiveStatus === "failed") {
        if (onRetry) {
            return (
                <button
                    type="button"
                    onClick={onRetry}
                    className={`inline-flex items-center justify-center p-0.5 hover:bg-rose-500/10 rounded transition-colors cursor-pointer select-none ${className}`}
                    title="Sync failed - click to retry"
                >
                    <CloudAlert className="w-4 h-4 text-rose-500" />
                </button>
            );
        }

        return (
            <span 
                className={`inline-flex items-center justify-center select-none ${className}`}
                title="Sync issue detected"
            >
                <CloudAlert className="w-4 h-4 text-rose-500" />
            </span>
        );
    }

    return (
        <span 
            className={`inline-flex items-center justify-center select-none ${className}`}
            title="All changes saved & synced"
        >
            <CloudCheck className="w-4 h-4 text-[#60646c]/80 dark:text-[#a0a4ab]/80" />
        </span>
    );
});

SyncStatusBadge.displayName = "SyncStatusBadge";

export default SyncStatusBadge;
