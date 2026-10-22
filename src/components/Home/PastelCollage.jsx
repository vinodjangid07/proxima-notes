import { useState } from "react";
import { NOTE_COLOR_LIST, getNoteColor } from "../../lib/noteColors";
import { Pin } from "lucide-react";

const SAMPLE_PASTEL_NOTES = [
  {
    id: "p1",
    color: "sand",
    title: "Morning Routine",
    content: "15 min silent reflection\nPour hot black coffee\nDraft 3 daily priorities",
    pinned: true,
    tag: "#focus"
  },
  {
    id: "p2",
    color: "peach",
    title: "Launch Checklist",
    content: "Double-check DNS entries\nVerify borderless light theme\nReview PWA manifest cache",
    pinned: false,
    tag: "#launch"
  },
  {
    id: "p3",
    color: "mint",
    title: "Design Principles",
    content: "Restrained, tactile, expensive. Zero artificial borders. Tonal steps carry the hierarchy.",
    pinned: false,
    tag: "#craft"
  },
  {
    id: "p4",
    color: "sky",
    title: "Reading Queue",
    content: "The Humane Interface\nDesigning Data-Intensive Apps\nZen and the Art of Motorcycle Maintenance",
    pinned: true,
    tag: "#books"
  },
  {
    id: "p5",
    color: "lavender",
    title: "Weekly Reflection",
    content: "Speed is a feature, but calm is the ultimate product. Keep writing simple.",
    pinned: false,
    tag: "#clarity"
  },
  {
    id: "p6",
    color: "rose",
    title: "Typography Notes",
    content: "Inter 600 with negative tracking feels confident. JetBrains Mono for clean code blocks.",
    pinned: false,
    tag: "#type"
  },
  {
    id: "p7",
    color: "teal",
    title: "Sprint Goals",
    content: "Fuse.js multi-field search\nDexie IndexedDB migration\nZero server dependencies",
    pinned: false,
    tag: "#engineering"
  },
  {
    id: "p8",
    color: "clay",
    title: "Architecture Rules",
    content: "1. No forced sign-in\n2. Optimistic local writes\n3. Raw Markdown storage",
    pinned: true,
    tag: "#core"
  },
  {
    id: "p9",
    color: "default",
    title: "Meeting Summary",
    content: "Confirmed local-first strategy. Offline writes ready for preview testing.",
    pinned: false,
    tag: "#notes"
  }
];

const PastelCollage = () => {
  const [activeColorId, setActiveColorId] = useState("default");
  const activeColorObj = getNoteColor(activeColorId);

  return (
    <section 
      className={`w-full py-12 sm:py-28 overflow-hidden transition-colors duration-700 ease-out ${
        activeColorId === "default"
          ? "bg-transparent"
          : activeColorObj.modalBg
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 mb-8 sm:mb-14 text-center select-none">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-1.5px] text-[#171717] dark:text-white max-w-2xl mx-auto leading-tight">
          Color as calm, not clutter.
        </h2>
        <p className="text-sm sm:text-base text-[#60646c] dark:text-[#a0a4ab] mt-4 max-w-xl mx-auto">
          Nine designer-calibrated tones that bring quiet visual order to your thoughts in both light and dark modes. Click any card to preview.
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {NOTE_COLOR_LIST.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveColorId(c.id)}
              className={`w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer ${c.swatchClass} ${
                activeColorId === c.id ? "ring-2 ring-black dark:ring-white scale-110" : ""
              }`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-2 px-6 group">
        <div className="flex gap-4 sm:gap-6 shrink-0 animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {SAMPLE_PASTEL_NOTES.concat(SAMPLE_PASTEL_NOTES).map((note, index) => {
            const colorToken = getNoteColor(note.color);
            return (
              <div
                key={`${note.id}-r1-${index}`}
                onClick={() => setActiveColorId(note.color)}
                className={`w-64 sm:w-72 p-5 rounded-2xl ${colorToken.cardBg} transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 shadow-xs hover:-translate-y-1 hover:shadow-md select-none`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#171717] dark:text-white truncate">
                      {note.title}
                    </span>
                    {note.pinned && (
                      <Pin className="w-3 h-3 text-[#171717] dark:text-white fill-current shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] leading-relaxed whitespace-pre-line line-clamp-3">
                    {note.content}
                  </p>
                </div>
                <div className="mt-4 pt-2">
                  <span className="text-[10px] font-medium text-[#60646c] dark:text-[#a0a4ab]">
                    {note.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pt-4 px-6 group">
        <div className="flex gap-4 sm:gap-6 shrink-0 animate-[marquee-reverse_50s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {SAMPLE_PASTEL_NOTES.slice().reverse().concat(SAMPLE_PASTEL_NOTES).map((note, index) => {
            const colorToken = getNoteColor(note.color);
            return (
              <div
                key={`${note.id}-r2-${index}`}
                onClick={() => setActiveColorId(note.color)}
                className={`w-64 sm:w-80 p-5 rounded-2xl ${colorToken.cardBg} transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 shadow-xs hover:-translate-y-1 hover:shadow-md select-none`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#171717] dark:text-white truncate">
                      {note.title}
                    </span>
                    {note.pinned && (
                      <Pin className="w-3 h-3 text-[#171717] dark:text-white fill-current shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] leading-relaxed whitespace-pre-line line-clamp-3">
                    {note.content}
                  </p>
                </div>
                <div className="mt-4 pt-2">
                  <span className="text-[10px] font-medium text-[#60646c] dark:text-[#a0a4ab]">
                    {note.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PastelCollage;
