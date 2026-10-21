import { Maximize2, Copy, Check, Trash2, Pin } from "lucide-react";

const NoteCardActions = ({ onOpenModal, onCopy, onDelete, onTogglePin, isPinned, copied }) => {
  return (
    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      {onTogglePin && (
        <button
          type="button"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isPinned 
              ? "text-black dark:text-white bg-[#e4e4e7] dark:bg-[#27272a]" 
              : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227]"
          }`}
          onClick={onTogglePin}
          title={isPinned ? "Unpin note" : "Pin note to top"}
        >
          <Pin className={`w-3.5 h-3.5 ${isPinned ? "fill-current" : ""}`} />
        </button>
      )}
      <button
        type="button"
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227] transition-colors cursor-pointer"
        onClick={onOpenModal}
        title="Open full note"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-[#f0f0f3] dark:hover:bg-[#222227] transition-colors cursor-pointer"
        onClick={onCopy}
        title="Copy note"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#60646c] dark:text-[#a0a4ab] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
        onClick={onDelete}
        title="Delete note"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default NoteCardActions;
