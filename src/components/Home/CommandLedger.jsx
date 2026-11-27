import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { HOME_SITE } from "../../data/homeContent";

const CommandPalette = lazy(() => import("../Notes/CommandPalette"));

const CommandLedger = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);
  const [scratchpad, setScratchpad] = useState(
    "- [x] Open workspace without login\n- [ ] Write today's thinking offline"
  );

  const searchInputRef = useRef(null);
  const scratchpadRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      const targetTag = e.target?.tagName;
      const isTyping = targetTag === "INPUT" || targetTag === "TEXTAREA";
      const isMac =
        typeof navigator !== "undefined" &&
        navigator.platform?.toUpperCase().includes("MAC");
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isTyping && e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
      }

      if (e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        setIsZenOpen((prev) => !prev);
      }

      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setScratchpad((prev) => `${prev}\n- [ ] Follow-up item`);
        scratchpadRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredNotes = HOME_SITE.commands.sampleNotes.filter((n) =>
    !searchQuery.trim()
      ? true
      : n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appendTask = () => {
    setScratchpad((prev) => `${prev}\n- [ ] New local task`);
    scratchpadRef.current?.focus();
  };

  return (
    <section className="w-full py-20 sm:py-28 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <h2
              data-split="lines"
              className="t-display-xl text-[#141416] dark:text-[#f4f4f2]"
            >
              {HOME_SITE.commands.heading}
            </h2>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p className="text-sm sm:text-base text-[#565961] dark:text-[#a1a4ab] leading-relaxed max-w-[40ch]">
              {HOME_SITE.commands.body}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            data-reveal="up"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start p-6 sm:p-8 rounded-2xl bg-[#f0efe9] dark:bg-[#131317] transition-colors"
          >
            <div className="lg:col-span-5 flex items-baseline gap-4">
              <kbd className="font-mono text-sm px-2.5 py-1 rounded-md bg-[#faf9f6] dark:bg-[#1d1d23] text-[#141416] dark:text-[#f4f4f2] shrink-0">
                /
              </kbd>
              <div className="flex flex-col gap-1">
                <span className="text-base sm:text-lg font-medium text-[#141416] dark:text-[#f4f4f2]">
                  Focus search immediately
                </span>
                <span className="text-xs sm:text-sm text-[#565961] dark:text-[#a1a4ab]">
                  Press slash or type below to filter notes incrementally.
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-3">
              <label htmlFor="ledger-search-input" className="sr-only">
                Search sample notes
              </label>
              <input
                id="ledger-search-input"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to filter thoughts..."
                className="w-full h-11 px-4 rounded-xl bg-[#faf9f6] dark:bg-[#1b1b21] text-sm text-[#141416] dark:text-[#f4f4f2] placeholder-[#565961] dark:placeholder-[#a1a4ab] focus:outline-none"
              />
              <div className="flex flex-col gap-1.5">
                {filteredNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] text-xs sm:text-sm"
                  >
                    <span className="font-medium text-[#141416] dark:text-[#f4f4f2] truncate">
                      {note.title}
                    </span>
                    <span className="font-mono text-xs text-[#565961] dark:text-[#a1a4ab] shrink-0">
                      #{note.tags[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            data-reveal="up"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-2xl bg-[#f0efe9] dark:bg-[#131317] transition-colors"
          >
            <div className="lg:col-span-5 flex items-baseline gap-3">
              <kbd className="font-mono text-sm px-2.5 py-1 rounded-md bg-[#faf9f6] dark:bg-[#1d1d23] text-[#141416] dark:text-[#f4f4f2] shrink-0">
                ⌘ K
              </kbd>
              <div className="flex flex-col gap-1">
                <span className="text-base sm:text-lg font-medium text-[#141416] dark:text-[#f4f4f2]">
                  Command palette
                </span>
                <span className="text-xs sm:text-sm text-[#565961] dark:text-[#a1a4ab]">
                  Switch views, create notes, toggle theme, or export JSON.
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-start lg:justify-end">
              <button
                type="button"
                onClick={() => setIsPaletteOpen(true)}
                data-fill
                className="flood-btn flood-btn--solid group h-11 px-5 rounded-xl text-sm font-medium inline-flex items-center gap-3 cursor-pointer"
              >
                <span className="flood-btn__fill" aria-hidden="true" />
                <span>Launch real command palette</span>
                <span className="arrow-nudge" aria-hidden="true">↵</span>
              </button>
            </div>
          </div>

          <div
            data-reveal="up"
            className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl transition-all duration-500 ${
              isZenOpen
                ? "p-8 sm:p-14 bg-[#141416] text-[#faf9f6] dark:bg-[#f4f4f2] dark:text-[#09090b]"
                : "p-6 sm:p-8 bg-[#f0efe9] dark:bg-[#131317]"
            }`}
          >
            <div className="lg:col-span-5 flex items-baseline gap-3">
              <kbd
                className={`font-mono text-sm px-2.5 py-1 rounded-md shrink-0 ${
                  isZenOpen
                    ? "bg-white/15 text-white dark:bg-black/10 dark:text-black"
                    : "bg-[#faf9f6] dark:bg-[#1d1d23] text-[#141416] dark:text-[#f4f4f2]"
                }`}
              >
                Alt Z
              </kbd>
              <div className="flex flex-col gap-1">
                <span className="text-base sm:text-lg font-medium">
                  {isZenOpen ? "Zen focus active" : "Zen mode"}
                </span>
                <span
                  className={`text-xs sm:text-sm ${
                    isZenOpen
                      ? "text-[#a1a4ab] dark:text-[#565961]"
                      : "text-[#565961] dark:text-[#a1a4ab]"
                  }`}
                >
                  {isZenOpen
                    ? "Sidebars and visual chrome step away until you restore them."
                    : "Expand any writing surface to full quiet with a single chord."}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-start lg:justify-end">
              <button
                type="button"
                onClick={() => setIsZenOpen((prev) => !prev)}
                className={`min-h-[42px] px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                  isZenOpen
                    ? "bg-white text-black dark:bg-[#09090b] dark:text-white"
                    : "bg-[#faf9f6] dark:bg-[#1b1b21] text-[#141416] dark:text-[#f4f4f2] hover:opacity-80"
                }`}
              >
                {isZenOpen ? "Restore layout" : "Preview Zen expansion →"}
              </button>
            </div>
          </div>

          <div
            data-reveal="up"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start p-6 sm:p-8 rounded-2xl bg-[#f0efe9] dark:bg-[#131317] transition-colors"
          >
            <div className="lg:col-span-5 flex items-baseline gap-3">
              <kbd className="font-mono text-sm px-2.5 py-1 rounded-md bg-[#faf9f6] dark:bg-[#1d1d23] text-[#141416] dark:text-[#f4f4f2] shrink-0">
                Alt T
              </kbd>
              <div className="flex flex-col gap-2">
                <span className="text-base sm:text-lg font-medium text-[#141416] dark:text-[#f4f4f2]">
                  Insert checklist task
                </span>
                <button
                  type="button"
                  onClick={appendTask}
                  className="link-editorial self-start text-xs sm:text-sm font-medium text-[#141416] dark:text-[#f4f4f2] min-h-[32px] cursor-pointer"
                >
                  Append a task line now +
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <label htmlFor="ledger-scratchpad" className="sr-only">
                Live Markdown task scratchpad
              </label>
              <textarea
                id="ledger-scratchpad"
                ref={scratchpadRef}
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-xl bg-[#faf9f6] dark:bg-[#1b1b21] font-mono text-xs sm:text-sm text-[#141416] dark:text-[#f4f4f2] leading-relaxed resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {isPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isPaletteOpen}
            onClose={() => setIsPaletteOpen(false)}
            notes={HOME_SITE.commands.sampleNotes}
            allTags={["core", "type", "data", "ux"]}
            onSelectNote={() => setIsPaletteOpen(false)}
            onCreateNote={() => setIsPaletteOpen(false)}
            viewMode="grid"
            onToggleViewMode={() => {}}
            onSelectFilter={() => {}}
            onSelectTag={() => {}}
            onExportJson={() => {}}
            onExportMarkdown={() => {}}
            onImportNotes={() => {}}
          />
        </Suspense>
      )}
    </section>
  );
};

export default CommandLedger;
