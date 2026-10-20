import { Maximize2, Copy, Check, Trash2 } from "lucide-react";

const NoteCardActions = ({ onOpenModal, onCopy, onDelete, copied }) => {
  return (
    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <button
        type="button"
        className="p-1.5 rounded-md text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors cursor-pointer"
        onClick={onOpenModal}
        title="Open full note"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-1.5 rounded-md text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors cursor-pointer"
        onClick={onCopy}
        title="Copy note"
      >
        {copied ? <Check className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        type="button"
        className="p-1.5 rounded-md text-[#71717a] dark:text-[#a1a1aa] hover:text-[#ef4444] dark:hover:text-[#f87171] hover:bg-[#fee2e2] dark:hover:bg-[#ef4444]/15 transition-colors cursor-pointer"
        onClick={onDelete}
        title="Delete note"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NoteCardActions;
