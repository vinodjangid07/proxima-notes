import { memo } from "react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { RefreshCw } from "lucide-react";

const SyncStatusBadge = memo(({ status, pendingCount = 0, onRetry }) => {
    const isOnline = useOnlineStatus();
    const effectiveStatus = status || (isOnline ? "synced" : "offline");

    if (effectiveStatus === "syncing") {
        return (
            <span className="h-7 inline-flex items-center gap-1.5 text-xs text-[#0075de] dark:text-[#60a5fa] font-semibold bg-[#dcecfa] dark:bg-[#10233b] border border-[#c7e0f7] dark:border-[#1d3c63] px-3 rounded-full whitespace-nowrap shrink-0 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] animate-ping"></span>
                Syncing...
            </span>
        );
    }

    if (effectiveStatus === "offline" || !isOnline) {
        return (
            <span className="h-7 inline-flex items-center gap-1.5 text-xs text-[#793400] dark:text-[#f5d75e] font-semibold bg-[#ffe8d4] dark:bg-[#351e12] border border-[#ffd5b0] dark:border-[#523410] px-3 rounded-full whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dd5b00]"></span>
                {pendingCount > 0 ? `Offline (${pendingCount} ${pendingCount === 1 ? 'note' : 'notes'} pending)` : "Offline"}
            </span>
        );
    }

    if (effectiveStatus === "error") {
        return (
            <div className="h-7 inline-flex items-center gap-1.5 text-xs text-[#e03131] dark:text-[#ff6b6b] font-semibold bg-[#fde0ec] dark:bg-[#351e28] border border-[#f9bed7] dark:border-[#5a2039] pl-3 pr-1.5 rounded-full whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e03131]"></span>
                <span>Sync issue</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="p-1 hover:bg-[#fbd0e4] dark:hover:bg-[#4a2434] rounded-full transition-colors cursor-pointer"
                        title="Retry sync"
                    >
                        <RefreshCw className="w-3 h-3 text-[#e03131] hover:rotate-180 transition-transform duration-300" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <span className="h-7 inline-flex items-center gap-1.5 text-xs text-[#1aae39] dark:text-[#4ade80] font-semibold bg-[#d9f3e1] dark:bg-[#0e2a1d] border border-[#bcebca] dark:border-[#18482f] px-3 rounded-full whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1aae39]"></span>
            Synced
        </span>
    );
});

SyncStatusBadge.displayName = "SyncStatusBadge";

export default SyncStatusBadge;
