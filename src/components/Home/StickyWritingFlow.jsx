import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOME_SITE } from "../../data/homeContent";
import { prefersReducedMotion } from "../../engine";

gsap.registerPlugin(ScrollTrigger);

const StickyWritingFlow = () => {
  const chapters = HOME_SITE.chapters;
  const [activeId, setActiveId] = useState(chapters[1].id);
  const [draftInput, setDraftInput] = useState(chapters[0].noteBody);
  const [tasks, setTasks] = useState(chapters[1].tasks);
  const [reconciled, setReconciled] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const chapterRefs = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const triggers = chapterRefs.current.map((el, index) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 58%",
        end: "bottom 42%",
        onEnter: () => setActiveId(chapters[index].id),
        onEnterBack: () => setActiveId(chapters[index].id),
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, [chapters]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const draftWordCount = draftInput.trim() ? draftInput.trim().split(/\s+/).length : 0;

  const handleCopyMarkdown = () => {
    navigator.clipboard?.writeText(chapters[3].rawMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 1800);
  };

  return (
    <section className="w-full py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col">
            <h2
              data-split="lines"
              className="t-display-xl text-[#141416] dark:text-[#f4f4f2] mb-8 lg:mb-14"
            >
              How quiet writing unfolds.
            </h2>

            <div className="flex lg:hidden flex-wrap gap-2 mb-6" role="tablist" aria-label="Writing stages">
              {chapters.map((chapter) => {
                const isSelected = activeId === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveId(chapter.id)}
                    className={`min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#141416] text-[#faf9f6] dark:bg-[#f4f4f2] dark:text-[#09090b]"
                        : "bg-black/[0.04] dark:bg-white/[0.05] text-[#565961] dark:text-[#a1a4ab]"
                    }`}
                  >
                    {chapter.title}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex flex-col gap-20 pb-24">
              {chapters.map((chapter, idx) => {
                const isActive = activeId === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    ref={(el) => {
                      chapterRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => setActiveId(chapter.id)}
                    className={`text-left transition-opacity duration-400 cursor-pointer py-4 focus-visible:outline-offset-8 rounded-lg ${
                      isActive
                        ? "opacity-100"
                        : "opacity-35 hover:opacity-75"
                    }`}
                  >
                    <h3 className="text-2xl font-semibold tracking-tight text-[#141416] dark:text-[#f4f4f2] mb-2.5">
                      {chapter.title}
                    </h3>
                    <p className="text-base text-[#565961] dark:text-[#a1a4ab] leading-relaxed max-w-[38ch]">
                      {chapter.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="w-full rounded-2xl bg-[#f0efe9] dark:bg-[#131317] p-6 sm:p-10 min-h-[340px] sm:min-h-[430px] flex flex-col justify-between transition-colors duration-300">
              {activeId === "draft" && (
                <div className="flex flex-col gap-6 flex-1 justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                    <span>Local draft</span>
                    <span>Edit directly below</span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 justify-center py-4">
                    <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141416] dark:text-[#f4f4f2]">
                      {chapters[0].noteTitle}
                    </div>
                    <label htmlFor="live-draft-input" className="sr-only">
                      Try drafting text locally
                    </label>
                    <textarea
                      id="live-draft-input"
                      value={draftInput}
                      onChange={(e) => setDraftInput(e.target.value)}
                      rows={4}
                      className="w-full bg-transparent text-base sm:text-lg text-[#565961] dark:text-[#a1a4ab] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>

                  <div className="text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                    {draftWordCount} words · committed in browser memory
                  </div>
                </div>
              )}

              {activeId === "structure" && (
                <div className="flex flex-col gap-6 flex-1 justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                    <span>Interactive Markdown checklist</span>
                    <span className="tabular-nums font-medium text-[#141416] dark:text-[#f4f4f2]">
                      {completedCount} / {tasks.length} done
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 py-2">
                    <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141416] dark:text-[#f4f4f2]">
                      {chapters[1].noteTitle}
                    </div>

                    <div className="flex flex-col gap-2">
                      {tasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          aria-pressed={task.done}
                          className={`min-h-[46px] flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                            task.done
                              ? "bg-black/[0.03] dark:bg-white/[0.03] text-[#565961] dark:text-[#a1a4ab] line-through"
                              : "bg-[#faf9f6] dark:bg-[#1a1a20] text-[#141416] dark:text-[#f4f4f2]"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-4 h-4 rounded-xs inline-flex items-center justify-center text-[11px] font-mono shrink-0 transition-colors ${
                              task.done
                                ? "bg-[#141416] text-[#faf9f6] dark:bg-[#f4f4f2] dark:text-[#09090b]"
                                : "bg-black/[0.08] dark:bg-white/[0.12] text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                          <span className="text-sm sm:text-base font-medium">
                            {task.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#565961] dark:text-[#a1a4ab]">
                    Select any item to toggle real-time checklist state inside the Markdown document.
                  </p>
                </div>
              )}

              {activeId === "offline" && (
                <div className="flex flex-col gap-6 flex-1 justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                    <span>Sync queue</span>
                    <span>
                      {reconciled ? "Reconciled to Firestore" : chapters[2].queueStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 py-4">
                    <div className="p-5 sm:p-6 rounded-xl bg-[#faf9f6] dark:bg-[#1a1a20] flex flex-col gap-2.5">
                      <div className="text-lg sm:text-xl font-semibold text-[#141416] dark:text-[#f4f4f2]">
                        {chapters[2].draftTitle}
                      </div>
                      <p className="text-sm text-[#565961] dark:text-[#a1a4ab] leading-relaxed">
                        {chapters[2].draftBody}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReconciled((prev) => !prev)}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.09] text-xs font-mono text-[#141416] dark:text-[#f4f4f2] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>
                        {reconciled
                          ? "Simulate offline edit queue"
                          : "Simulate network reconnect flush"}
                      </span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#565961] dark:text-[#a1a4ab]">
                    IndexedDB stores every revision offline first, flushing automatically when connectivity returns.
                  </p>
                </div>
              )}

              {activeId === "retain" && (
                <div className="flex flex-col gap-5 flex-1 justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#141416] dark:text-[#f4f4f2]">
                      {chapters[3].filename}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-medium bg-[#faf9f6] dark:bg-[#1a1a20] text-[#141416] dark:text-[#f4f4f2] hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {copiedMd ? "Copied .md" : "Copy raw .md"}
                    </button>
                  </div>

                  <pre className="p-5 sm:p-6 rounded-xl bg-[#faf9f6] dark:bg-[#0d0d10] font-mono text-xs sm:text-[13px] text-[#141416] dark:text-[#ededed] overflow-x-auto leading-relaxed select-text">
                    {chapters[3].rawMarkdown}
                  </pre>

                  <p className="text-xs text-[#565961] dark:text-[#a1a4ab]">
                    Standard UTF-8 Markdown with frontmatter tags, portable to any editor without conversion.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StickyWritingFlow;
