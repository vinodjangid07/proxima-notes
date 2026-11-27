import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { NOTE_COLOR_LIST, getNoteColor } from "../../lib/noteColors";
import { HOME_SITE } from "../../data/homeContent";
import { getToneRgb, TONE_RGB_MAP } from "../../engine/toneMap";
import { setGlTone } from "../../engine";

const TonalFloodSection = () => {
  const [activeToneId, setActiveToneId] = useState("sand");
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      setGlTone(getToneRgb(activeToneId, isDark), 0.92);
    } else {
      setGlTone(null, 0);
    }
  }, [inView, activeToneId, isDark]);

  const activeNoteColor = getNoteColor(activeToneId);
  const activeCopy =
    HOME_SITE.floodSection.notes[activeToneId] ||
    HOME_SITE.floodSection.notes.default;
  const activeToneEntry = TONE_RGB_MAP[activeToneId] || TONE_RGB_MAP.default;

  const fallbackSurfaceStyle = {
    backgroundColor: isDark ? activeToneEntry.darkHex : activeToneEntry.lightHex,
  };

  return (
    <section
      ref={sectionRef}
      style={fallbackSurfaceStyle}
      className="relative w-full py-20 sm:py-28 lg:py-36 transition-colors duration-700 ease-out gl-transparent-bg"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2
              data-split="lines"
              className="t-display-xl text-[#141416] dark:text-[#f4f4f2]"
            >
              {HOME_SITE.floodSection.heading}
            </h2>

            <p className="text-sm sm:text-base text-[#565961] dark:text-[#a1a4ab] leading-relaxed max-w-[38ch]">
              {HOME_SITE.floodSection.body}
            </p>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 mt-4"
              role="radiogroup"
              aria-label="Choose note surface tone"
            >
              {NOTE_COLOR_LIST.map((tone) => {
                const isSelected = activeToneId === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onMouseEnter={() => setActiveToneId(tone.id)}
                    onFocus={() => setActiveToneId(tone.id)}
                    onClick={() => setActiveToneId(tone.id)}
                    className={`min-h-[40px] px-3 py-2 rounded-lg text-left text-xs sm:text-sm transition-all duration-250 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#141416] text-[#faf9f6] dark:bg-[#f4f4f2] dark:text-[#09090b] font-medium"
                        : "text-[#141416]/75 dark:text-[#f4f4f2]/75 hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="truncate">{tone.name}</span>
                    {isSelected && <span aria-hidden="true">→</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-8">
            <div
              className={`rounded-2xl p-8 sm:p-12 lg:p-14 transition-colors duration-500 ${activeNoteColor.modalBg} bg-opacity-95 min-h-[300px] sm:min-h-[380px] flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#565961] dark:text-[#a1a4ab]">
                <span>{activeCopy.tag}</span>
                <span>Pinned surface preview</span>
              </div>

              <div className="my-10 sm:my-14 flex flex-col gap-4">
                <h3 className="t-display-l text-[#141416] dark:text-[#f4f4f2]">
                  {activeCopy.title}
                </h3>
                <p className="text-base sm:text-xl text-[#565961] dark:text-[#d0d2d7] leading-relaxed max-w-[44ch]">
                  {activeCopy.body}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#565961] dark:text-[#a1a4ab]">
                <span>Calibrated surface: {activeNoteColor.name}</span>
                <span>Zero borders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TonalFloodSection;
