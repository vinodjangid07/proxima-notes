import { useState } from "react";
import { CheckSquare, Square, FileText, CloudCheck, CloudOff, Copy, Check } from "lucide-react";
import ChecklistBadge from "../Notes/ChecklistBadge";

const CHAPTERS = [
  {
    id: "draft",
    step: "01",
    title: "Draft",
    tagline: "Capture instantly",
    promise: "Zero loading screens, no spinners, and zero delay between thinking and writing."
  },
  {
    id: "structure",
    step: "02",
    title: "Structure",
    tagline: "Effortless hierarchy",
    promise: "Markdown syntax naturally shapes thoughts into clean headings and interactive tasks."
  },
  {
    id: "anywhere",
    step: "03",
    title: "Anywhere",
    tagline: "True local-first",
    promise: "Write freely in Wi-Fi dead zones, on flights, or outdoors. Everything syncs quietly when reconnected."
  },
  {
    id: "retain",
    step: "04",
    title: "Keep forever",
    tagline: "No walled gardens",
    promise: "Your words live in standard .md files. Open, export, and own your notes for decades."
  }
];

const ScrollStory = () => {
  const [activeChapter, setActiveChapter] = useState("structure");
  const [copiedMd, setCopiedMd] = useState(false);

  const [checklistTasks, setChecklistTasks] = useState([
    { id: 1, text: "Define compiler pipeline", done: true },
    { id: 2, text: "Verify borderless surfaces across light & dark", done: true },
    { id: 3, text: "Ship offline database sync queue", done: false }
  ]);

  const toggleTask = (id) => {
    setChecklistTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = checklistTasks.filter((t) => t.done).length;

  const rawMarkdownSnippet = `---
title: Product Strategy
created: 2026-10-22
tags: [architecture, speed]
---

# Core Principles
- [x] 100% offline-first Dexie.js
- [x] Standard Markdown files
- [ ] Multi-device sync stream`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(rawMarkdownSnippet);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <section className="w-full py-12 sm:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-medium text-[#a0a4ab] dark:text-[#60646c] uppercase tracking-wider">
                Thoughtful Writing Flow
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-1px] text-[#171717] dark:text-white leading-tight">
                How thoughtful writing happens
              </h2>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {CHAPTERS.map((chapter) => {
                const isActive = activeChapter === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => setActiveChapter(chapter.id)}
                    className={`text-left p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col gap-1.5 select-none ${
                      isActive
                        ? "bg-[#f8f8fa] dark:bg-[#151518] shadow-xs"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium opacity-50">
                          {chapter.step}
                        </span>
                        <span className="text-base font-semibold text-[#171717] dark:text-white">
                          {chapter.title}
                        </span>
                      </div>
                      <span className="text-xs text-[#a0a4ab] dark:text-[#60646c]">
                        {chapter.tagline}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                      {chapter.promise}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="w-full bg-[#f8f8fa] dark:bg-[#151518] rounded-3xl p-5 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.45)] min-h-[360px] sm:min-h-[440px] flex flex-col justify-between transition-all duration-300">
              {activeChapter === "draft" && (
                <div className="flex flex-col gap-5 flex-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs text-[#a0a4ab] dark:text-[#60646c] font-mono">
                    <span>STATUS: READY</span>
                    <span>UNTITLED NOTE</span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 justify-center py-6">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-[#171717] dark:text-white">
                      The ideas that emerge in quiet
                    </h3>
                    <p className="text-sm sm:text-base text-[#60646c] dark:text-[#a0a4ab] leading-relaxed font-normal">
                      Capture every thought before the brain switches contexts. No loading screens, no spinners, no permission prompts. Your thoughts hit the disk the instant you type.
                      <span className="inline-block w-2 h-4 ml-1 bg-black dark:bg-white animate-pulse align-middle" />
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#a0a4ab] dark:text-[#60646c] pt-4 border-t border-black/5 dark:border-white/5">
                    <span>18 words</span>
                    <span>•</span>
                    <span>1m read</span>
                    <span>•</span>
                    <span>Instant local write</span>
                  </div>
                </div>
              )}

              {activeChapter === "structure" && (
                <div className="flex flex-col gap-5 flex-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-xs font-mono text-[#a0a4ab] dark:text-[#60646c]">
                      CHECKLIST PROGRESS
                    </span>
                    <ChecklistBadge completed={completedCount} total={checklistTasks.length} />
                  </div>

                  <div className="flex flex-col gap-3 py-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#171717] dark:text-white">
                      Q4 Infrastructure &amp; Tooling
                    </h3>
                    <p className="text-xs text-[#60646c] dark:text-[#a0a4ab]">
                      Click any task to test live interactive completion:
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                      {checklistTasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                            task.done
                              ? "bg-black/[0.02] dark:bg-white/[0.02] text-[#60646c] dark:text-[#a0a4ab] line-through"
                              : "bg-white dark:bg-[#1a1a1f] text-[#171717] dark:text-white shadow-2xs"
                          }`}
                        >
                          {task.done ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-[#a0a4ab] shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-medium">{task.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#a0a4ab] dark:text-[#60646c] pt-2">
                    Checklist updates auto-save to the markdown document in real time.
                  </p>
                </div>
              )}

              {activeChapter === "anywhere" && (
                <div className="flex flex-col gap-5 flex-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CloudOff className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        Airplane Mode Active
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#a0a4ab] dark:text-[#60646c]">
                      OFFLINE CONTINUITY
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 py-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1c1c21] shadow-2xs flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#171717] dark:text-white">
                          Offline draft created on flight
                        </span>
                        <span className="text-[10px] text-amber-500 font-mono">Queued in Dexie</span>
                      </div>
                      <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                        Wrote 4 paragraphs without internet. Notes stored securely in IndexedDB on this machine. Will synchronize immediately upon touchdown.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs">
                      <span className="text-[#60646c] dark:text-[#a0a4ab]">Pending local queue</span>
                      <span className="font-mono font-medium text-[#171717] dark:text-white">1 note ready to sync</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#a0a4ab] dark:text-[#60646c] pt-2">
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Zero network requests required to read, write, or search.</span>
                  </div>
                </div>
              )}

              {activeChapter === "retain" && (
                <div className="flex flex-col gap-4 flex-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#a0a4ab]" />
                      <span className="text-xs font-mono text-[#171717] dark:text-white">
                        strategy.md
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySnippet}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMd ? "Copied" : "Copy raw .md"}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-white dark:bg-[#121215] text-[11px] sm:text-xs font-mono text-[#171717] dark:text-[#ededed] overflow-x-auto leading-relaxed shadow-2xs select-text">
                    {rawMarkdownSnippet}
                  </pre>

                  <p className="text-xs text-[#a0a4ab] dark:text-[#60646c]">
                    Zero proprietary databases. Clean, portable Markdown files that will open in 2050 just as easily as today.
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

export default ScrollStory;
