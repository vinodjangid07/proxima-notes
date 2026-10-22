import { useState, useRef, useEffect } from "react";
import { Search, Maximize2, Minimize2, CheckSquare, Plus, CornerDownLeft } from "lucide-react";
import CommandPalette from "../Notes/CommandPalette";

const DEMO_BENTO_NOTES = [
  { id: "b1", title: "Quarterly architecture review", tags: ["tech", "core"], content: "Dexie IndexedDB and real-time onSnapshot sync" },
  { id: "b2", title: "Minimal typography standard", tags: ["design"], content: "Inter display weights with negative tracking" },
  { id: "b3", title: "Offline data portability", tags: ["privacy"], content: "Export to raw markdown anytime" },
  { id: "b4", title: "Zero barrier entry notes", tags: ["ux"], content: "Guest mode runs instantly without login" }
];

const KeyboardBento = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isZenDemo, setIsZenDemo] = useState(false);
  const [isCommandPaletteDemoOpen, setIsCommandPaletteDemoOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState("- [x] Read architecture context\n- [ ] Write first offline note");
  
  const searchInputRef = useRef(null);
  const scratchpadRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isTyping = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
      const isMac = typeof navigator !== "undefined" && navigator.platform?.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isTyping && e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteDemoOpen(true);
      }

      if (e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        setIsZenDemo((prev) => !prev);
      }

      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setScratchpadText((prev) => `${prev}\n- [ ] New checklist task`);
        scratchpadRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredDemoNotes = DEMO_BENTO_NOTES.filter((n) =>
    searchQuery === ""
      ? true
      : n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full py-12 sm:py-28 select-none">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col gap-3 mb-8 sm:mb-14">
          <span className="text-xs font-mono font-medium text-[#a0a4ab] dark:text-[#60646c] uppercase tracking-wider">
            Muscle Memory
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-1.5px] text-[#171717] dark:text-white leading-tight">
            Built for hands that don't leave the keyboard.
          </h2>
          <p className="text-sm sm:text-base text-[#60646c] dark:text-[#a0a4ab] max-w-xl">
            Every core action has a dedicated, instantaneous shortcut. Test them live below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-7 bg-[#f8f8fa] dark:bg-[#151518] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#171717] dark:text-white">
                  Instant Search
                </span>
                <span className="text-xs text-[#60646c] dark:text-[#a0a4ab]">
                  Type <kbd className="font-mono px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#171717] dark:text-white text-[11px]">/</kbd> to focus anywhere
                </span>
              </div>
              <kbd className="font-mono text-sm px-2.5 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                /
              </kbd>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#a0a4ab] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter thoughts instantly..."
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-white dark:bg-[#1a1a1f] text-xs sm:text-sm text-[#171717] dark:text-white placeholder-[#a0a4ab] dark:placeholder-[#60646c] focus:outline-none shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                {filteredDemoNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1a1a1f]/70 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[#171717] dark:text-white truncate">
                      {note.title}
                    </span>
                    <span className="text-[10px] text-[#a0a4ab] dark:text-[#60646c] font-mono">
                      {note.tags[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#f8f8fa] dark:bg-[#151518] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#171717] dark:text-white">
                  Command Palette
                </span>
                <span className="text-xs text-[#60646c] dark:text-[#a0a4ab]">
                  Universal spotlight navigator
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                  ⌘
                </kbd>
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                  K
                </kbd>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCommandPaletteDemoOpen(true)}
              className="w-full h-12 px-4 rounded-xl bg-white dark:bg-[#1a1a1f] flex items-center justify-between text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
            >
              <span>Click or press ⌘K to open...</span>
              <CornerDownLeft className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="lg:col-span-5 bg-[#f8f8fa] dark:bg-[#151518] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#171717] dark:text-white">
                  Zen Fullscreen
                </span>
                <span className="text-xs text-[#60646c] dark:text-[#a0a4ab]">
                  Collapse chrome for pure focus
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                  Alt
                </kbd>
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                  Z
                </kbd>
              </div>
            </div>

            <div
              onClick={() => setIsZenDemo((prev) => !prev)}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-between ${
                isZenDemo
                  ? "bg-black text-white dark:bg-white dark:text-black py-8"
                  : "bg-white dark:bg-[#1a1a1f] text-[#171717] dark:text-white shadow-2xs"
              }`}
            >
              <span className="text-xs sm:text-sm font-medium">
                {isZenDemo ? "Zen mode active (Click to restore)" : "Click to enter Zen mode"}
              </span>
              {isZenDemo ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#f8f8fa] dark:bg-[#151518] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#171717] dark:text-white">
                  Insert Task
                </span>
                <span className="text-xs text-[#60646c] dark:text-[#a0a4ab]">
                  Instantly append a checklist task
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                  Alt
                </kbd>
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-[#202025] text-[#171717] dark:text-white shadow-2xs">
                  T
                </kbd>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <textarea
                ref={scratchpadRef}
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-white dark:bg-[#1a1a1f] text-xs font-mono text-[#171717] dark:text-white focus:outline-none resize-none shadow-2xs leading-relaxed"
              />
              <span className="text-[10px] text-[#a0a4ab] dark:text-[#60646c]">
                Press Alt+T or type directly to append new checklist bullets
              </span>
            </div>
          </div>
        </div>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteDemoOpen}
        onClose={() => setIsCommandPaletteDemoOpen(false)}
        notes={DEMO_BENTO_NOTES}
        allTags={["tech", "design", "privacy", "ux"]}
        onSelectNote={() => setIsCommandPaletteDemoOpen(false)}
        onCreateNote={() => setIsCommandPaletteDemoOpen(false)}
        viewMode="grid"
        onToggleViewMode={() => {}}
        onSelectFilter={() => {}}
        onSelectTag={() => {}}
        onExportJson={() => {}}
        onExportMarkdown={() => {}}
        onImportNotes={() => {}}
      />
    </section>
  );
};

export default KeyboardBento;
