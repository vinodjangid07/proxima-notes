import { useState } from "react";
import { HOME_SITE } from "../../data/homeContent";

const MarkdownSplit = () => {
  const [view, setView] = useState("split");

  return (
    <section className="w-full py-20 sm:py-28 lg:py-36 bg-[#f0efe9]/75 dark:bg-[#131317]/75 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h2
              data-split="lines"
              className="t-display-xl text-[#141416] dark:text-[#f4f4f2]"
            >
              {HOME_SITE.markdownSplit.heading}
            </h2>

            <p className="text-sm sm:text-base text-[#565961] dark:text-[#a1a4ab] leading-relaxed max-w-[38ch]">
              {HOME_SITE.markdownSplit.body}
            </p>

            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] self-start mt-2"
              role="group"
              aria-label="Preview format"
            >
              {[
                { id: "split", label: "Side by side" },
                { id: "raw", label: "Raw .md" },
                { id: "rendered", label: "Rendered" },
              ].map((option) => {
                const active = view === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setView(option.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-[#faf9f6] text-[#141416] dark:bg-[#f4f4f2] dark:text-[#09090b]"
                        : "text-[#565961] dark:text-[#a1a4ab] hover:text-[#141416] dark:hover:text-[#f4f4f2]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div data-reveal="up" data-delay="0.05" className="lg:col-span-8">
            <div
              className={`grid gap-6 ${
                view === "split" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {(view === "split" || view === "raw") && (
                <div
                  key="raw-card"
                  className="rounded-2xl p-6 sm:p-8 bg-[#faf9f6] dark:bg-[#0d0d10] flex flex-col justify-between gap-6"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                    <span>{HOME_SITE.markdownSplit.filename}</span>
                    <span>UTF-8 plain text</span>
                  </div>

                  <pre className="font-mono text-xs sm:text-[13px] text-[#141416] dark:text-[#ededed] leading-relaxed overflow-x-auto whitespace-pre-wrap select-text">
                    {HOME_SITE.markdownSplit.raw}
                  </pre>

                  <span className="text-xs text-[#565961] dark:text-[#a1a4ab]">
                    Readable in Obsidian, VS Code, or any plain text editor.
                  </span>
                </div>
              )}

              {(view === "split" || view === "rendered") && (
                <div
                  key="rendered-card"
                  className="rounded-2xl p-6 sm:p-8 bg-[#faf9f6] dark:bg-[#17171c] flex flex-col justify-between gap-6"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                    <span>Rendered prose</span>
                    <span>Live export ready</span>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <h3 className="text-xl font-semibold tracking-tight text-[#141416] dark:text-[#f4f4f2]">
                      2026 Priorities
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-[#565961] dark:text-[#a1a4ab]">
                      <li className="line-through">Eliminate analytics and telemetry</li>
                      <li className="line-through">Commit every edit offline first</li>
                      <li className="text-[#141416] dark:text-[#f4f4f2] font-medium">
                        Keep raw .md files portable forever
                      </li>
                    </ul>
                    <blockquote className="pl-3.5 text-sm italic text-[#565961] dark:text-[#a1a4ab] mt-1">
                      &ldquo;Simplicity is prerequisite for reliability.&rdquo;
                    </blockquote>
                  </div>

                  <span className="text-xs text-[#565961] dark:text-[#a1a4ab]">
                    One-click JSON backup or bulk Markdown export anytime.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarkdownSplit;
