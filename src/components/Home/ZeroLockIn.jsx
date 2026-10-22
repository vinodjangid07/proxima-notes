import { Link } from "react-router-dom";
import { ArrowRight, FileText, Check } from "lucide-react";

const ZeroLockIn = () => {
  return (
    <section className="w-full bg-[#f4f4f6] text-[#171717] py-12 sm:py-28 select-none">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-8 sm:gap-14">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs font-mono font-medium text-[#60646c] uppercase tracking-wider">
            Data Sovereignty
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-1.5px] leading-tight text-[#171717]">
            Your thoughts belong to you. Forever.
          </h2>
          <p className="text-sm sm:text-base text-[#60646c] leading-relaxed">
            No proprietary database walls, no encryption locks, no export paywalls. Proxima stores your words in standard GitHub Flavored Markdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between text-xs text-[#60646c] font-mono border-b border-black/5 pb-3">
              <span className="flex items-center gap-1.5 font-semibold text-[#171717]">
                <FileText className="w-3.5 h-3.5" />
                journal-2026.md
              </span>
              <span>RAW TEXT</span>
            </div>

            <pre className="font-mono text-xs text-[#171717] leading-relaxed overflow-x-auto whitespace-pre-wrap select-text">
{`# 2026 Strategy

- [x] Eliminate all telemetry
- [x] Support 100% offline writes
- [ ] Maintain raw .md compatibility

> "Simplicity is prerequisite for reliability."
`}
            </pre>

            <span className="text-[11px] text-[#60646c] pt-2">
              Clean UTF-8 plain text readable by any system.
            </span>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center items-center gap-3 py-4 text-center">
            <span className="text-xs font-mono text-[#60646c] uppercase tracking-wider">
              Compatible with
            </span>
            <div className="flex flex-wrap lg:flex-col gap-2 justify-center">
              <span className="px-2.5 py-1 rounded-md bg-white text-xs font-medium text-[#171717] shadow-2xs">
                Obsidian
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-xs font-medium text-[#171717] shadow-2xs">
                VS Code
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-xs font-medium text-[#171717] shadow-2xs">
                Vim / Neovim
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-xs font-medium text-[#171717] shadow-2xs">
                Any Text Editor
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between text-xs text-[#60646c] border-b border-black/5 pb-3">
              <span className="font-semibold text-[#171717]">
                Rendered Note
              </span>
              <span className="text-emerald-600 font-medium">✓ Clean Markdown</span>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[#171717]">2026 Strategy</h3>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#60646c]">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="line-through">Eliminate all telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-[#60646c]">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="line-through">Support 100% offline writes</span>
                </div>
                <div className="flex items-center gap-2 text-[#171717] font-medium">
                  <span className="w-3.5 h-3.5 rounded border border-black/30 flex items-center justify-center text-[10px]" />
                  <span>Maintain raw .md compatibility</span>
                </div>
              </div>
              <blockquote className="p-2.5 rounded-lg bg-black/[0.03] text-xs italic text-[#60646c] mt-2">
                "Simplicity is prerequisite for reliability."
              </blockquote>
            </div>

            <span className="text-[11px] text-[#60646c] pt-2">
              Instant one-click JSON or Markdown batch export.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-start">
          <Link
            to="/notes"
            className="h-10 px-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-[#1a1a1a] transition-all active:scale-98 shadow-xs"
          >
            <span>Try without an account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ZeroLockIn;
