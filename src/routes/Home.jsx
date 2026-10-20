import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import useAuth from "../context/useAuth";
import Navbar from "../components/Notes/Navbar";
import Footer from "../components/Notes/Footer";
import { 
  ArrowRight, 
  Zap, 
  WifiOff, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  FileCode2,
  Search,
  Check
} from "lucide-react";

const Home = () => {
  const { currentUser } = useAuth();

  // Interactive checklist in demo card
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, text: "Save note locally in IndexedDB (0ms)", completed: true },
    { id: 2, text: "Buffer rapid keystrokes with 600ms debounce", completed: true },
    { id: 3, text: "Silently sync to Firestore on reconnect", completed: false },
  ]);

  const toggleDemoTask = (id) => {
    setDemoTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = demoTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / demoTasks.length) * 100);

  const handleLogin = () => {
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Login error:", error.message);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-16 sm:pt-24 pb-24 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-[#18181b] dark:text-[#f4f4f5] leading-[1.08]">
            Write at the speed of thought. Never wait on a server.
          </h1>

          <p className="text-base sm:text-lg text-[#52525b] dark:text-[#a1a1aa] mt-6 leading-relaxed max-w-2xl font-normal">
            Proxima is a local-first workspace engineered for instant capture and pure focus. Every keystroke is saved on your device in zero milliseconds and synchronized silently to the cloud when you're connected.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full">
            {currentUser ? (
              <Link
                to="/notes"
                className="inline-flex items-center justify-center gap-2 bg-[#5645d4] hover:bg-[#4534b3] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#5645d4] hover:bg-[#4534b3] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer shadow-xs"
                >
                  <img
                    className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    loading="lazy"
                    alt="Google"
                  />
                  <span>Start Free with Google</span>
                </button>

                <Link
                  to="/notes"
                  className="inline-flex items-center justify-center gap-2 border border-[#e4e4e7] dark:border-[#2e2e34] hover:bg-[#f4f4f5] dark:hover:bg-[#1c1c1f] bg-transparent text-[#18181b] dark:text-[#f4f4f5] px-6 py-3 rounded-md font-medium text-sm transition-colors"
                >
                  <span>Explore as Guest</span>
                </Link>
              </>
            )}
          </div>

          {/* Core Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium select-none">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#5645d4]" />
              0ms IndexedDB Latency
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-[#5645d4]" />
              Offline by Default
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5645d4]" />
              End-to-End Private
            </span>
          </div>
        </div>

        {/* Hero Workspace Preview */}
        <div className="w-full max-w-4xl mt-12 sm:mt-16 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-[#e4e4e7] dark:border-[#2e2e34] shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-hidden text-left select-none">
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#e4e4e7] dark:border-[#2e2e34] bg-[#fafaf9] dark:bg-[#18181b]">
            <div className="flex items-center gap-2.5">
              <img src="/proxima_logo.webp" alt="Proxima" className="w-4 h-4 invert dark:invert-0" />
              <span className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5]">
                Architecture-Overview.md
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#d9f3e1] dark:bg-[#183324] text-[#16a34a] dark:text-[#4ade80]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                Synced
              </span>
            </div>
          </div>

          {/* Mock Split Interface */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px]">
            {/* Mock Left Mini-Sidebar */}
            <div className="hidden md:flex md:col-span-4 border-r border-[#e4e4e7] dark:border-[#2e2e34] p-4 flex-col gap-3 bg-[#fafaf9] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-md text-xs text-[#71717a] dark:text-[#a1a1aa]">
                <Search className="w-3.5 h-3.5" />
                <span>Search notes...</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="p-2.5 rounded-md bg-white dark:bg-[#27272a] border border-[#e4e4e7] dark:border-[#3f3f46] shadow-xs">
                  <span className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] block truncate">
                    Architecture-Overview.md
                  </span>
                  <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] block truncate mt-0.5">
                    Local IndexedDB commits...
                  </span>
                </div>
                <div className="p-2.5 rounded-md hover:bg-white/60 dark:hover:bg-[#242429] transition-colors cursor-pointer">
                  <span className="text-xs font-medium text-[#52525b] dark:text-[#d4d4d8] block truncate">
                    Offline Queue Spec
                  </span>
                  <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] block truncate mt-0.5">
                    Coalescing rapid edits...
                  </span>
                </div>
                <div className="p-2.5 rounded-md hover:bg-white/60 dark:hover:bg-[#242429] transition-colors cursor-pointer">
                  <span className="text-xs font-medium text-[#52525b] dark:text-[#d4d4d8] block truncate">
                    Markdown Guidelines
                  </span>
                  <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] block truncate mt-0.5">
                    Checklists and task tracking...
                  </span>
                </div>
              </div>
            </div>

            {/* Mock Editor Canvas */}
            <div className="p-6 sm:p-8 md:col-span-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                  <span>Oct 2026</span>
                  <span>•</span>
                  <span>2 min read</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#d9f3e1] dark:bg-[#183324] text-[#16a34a] dark:text-[#4ade80]">
                  <CheckSquare className="w-3.5 h-3.5" />
                  2/3 tasks
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5]">
                Local-first systems treat your machine as the source of truth.
              </h2>

              <p className="text-sm text-[#52525b] dark:text-[#d4d4d8] leading-relaxed">
                Traditional cloud note apps force you to wait on network lag. Proxima commits state to IndexedDB in 0ms, queuing mutations locally and pushing to Firestore without interrupting your flow.
              </p>

              <div className="bg-[#f4f4f5] dark:bg-[#121214] rounded-lg p-3 sm:p-4 text-xs font-mono text-[#18181b] dark:text-[#e4e4e7] flex items-center justify-between">
                <span>await db.notes.put(&#123; id, title, content &#125;);</span>
                <span className="text-[#16a34a] dark:text-[#4ade80] font-semibold">0.3ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Pillars Bento Showcase */}
        <div className="w-full max-w-5xl mt-24 sm:mt-32 flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-xl text-left">
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5]">
              Engineered for speed, durability, and complete focus.
            </h2>
            <p className="text-base text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
              Every architectural decision in Proxima eliminates friction between your thoughts and the screen.
            </p>
          </div>

          {/* Asymmetric 2-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Card 1: 0ms Local Storage Core */}
            <div className="bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[#5645d4]">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-[#18181b] dark:text-[#f4f4f5] tracking-tight">
                  Zero-Latency Local Engine
                </h3>
                <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                  Every keystroke, search query, and note switch executes in your browser's IndexedDB. Open 10,000-word notes in 3 milliseconds without network spin wheels.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#f4f4f5] dark:border-[#27272a] flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] dark:text-[#a1a1aa]">Local Write Latency</span>
                  <span className="font-mono font-semibold text-[#16a34a] dark:text-[#4ade80]">0.3ms (Instant)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] dark:text-[#a1a1aa]">Full-Text Search</span>
                  <span className="font-semibold text-[#18181b] dark:text-[#f4f4f5]">On-Device Indexed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] dark:text-[#a1a1aa]">Server Blocking</span>
                  <span className="font-semibold text-[#16a34a] dark:text-[#4ade80]">Zero</span>
                </div>
              </div>
            </div>

            {/* Card 2: Offline Resilience */}
            <div className="bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[#5645d4]">
                  <WifiOff className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-[#18181b] dark:text-[#f4f4f5] tracking-tight">
                  Bulletproof Offline Queue
                </h3>
                <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                  Fly across continents or commute through subway dead-zones without anxiety. Changes coalesce in an intelligent offline queue and push silently to Firestore when reconnected.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#f4f4f5] dark:border-[#27272a] flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] dark:text-[#a1a1aa]">Offline Behavior</span>
                  <span className="font-semibold text-[#18181b] dark:text-[#f4f4f5]">Full Read &amp; Write</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] dark:text-[#a1a1aa]">Rapid Keystroke Buffer</span>
                  <span className="font-mono font-semibold text-[#18181b] dark:text-[#f4f4f5]">600ms Debounce</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] dark:text-[#a1a1aa]">Conflict Handling</span>
                  <span className="font-semibold text-[#16a34a] dark:text-[#4ade80]">Non-Blocking Coalesce</span>
                </div>
              </div>
            </div>

            {/* Card 3: Interactive Markdown & Tasks */}
            <div className="bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[#5645d4]">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#18181b] dark:text-[#f4f4f5] tracking-tight">
                    Interactive Task Markdown
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#d9f3e1] dark:bg-[#183324] text-[#16a34a] dark:text-[#4ade80]">
                    {completedCount}/{demoTasks.length} ({progressPercent}%)
                  </span>
                </div>
                <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                  Full GitHub Flavored Markdown with clickable checklists. Toggle Split-screen, preview rendered typography, or enter Zen fullscreen mode.
                </p>
              </div>

              {/* Clickable interactive task demonstration */}
              <div className="mt-5 pt-4 border-t border-[#f4f4f5] dark:border-[#27272a] flex flex-col gap-2">
                <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">Interactive preview — click to toggle:</span>
                {demoTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleDemoTask(task.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-[#fafaf9] dark:bg-[#18181b] hover:bg-[#f4f4f5] dark:hover:bg-[#242429] text-left transition-colors cursor-pointer select-none text-xs"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#16a34a] dark:text-[#4ade80] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa] shrink-0" />
                    )}
                    <span className={task.completed ? "line-through text-[#71717a] dark:text-[#a1a1aa]" : "text-[#18181b] dark:text-[#f4f4f5]"}>
                      {task.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card 4: True Privacy & Open Standards */}
            <div className="bg-white dark:bg-[#1c1c1f] border border-[#e4e4e7] dark:border-[#2e2e34] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[#5645d4]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-[#18181b] dark:text-[#f4f4f5] tracking-tight">
                  Complete Data Sovereignty
                </h3>
                <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                  Your thoughts belong to you. Proxima contains zero analytics trackers, zero advertising pixels, and saves notes in open, standard markdown format.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#f4f4f5] dark:border-[#2e2e34] flex flex-col gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-[#18181b] dark:text-[#f4f4f5]">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                  <span>100% on-device private IndexedDB storage</span>
                </div>
                <div className="flex items-center gap-2 text-[#18181b] dark:text-[#f4f4f5]">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                  <span>Zero user telemetry, cookies, or ad trackers</span>
                </div>
                <div className="flex items-center gap-2 text-[#18181b] dark:text-[#f4f4f5]">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                  <span>Open standard markdown (.md) with zero lock-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="w-full max-w-5xl mt-24 sm:mt-32 p-8 sm:p-12 rounded-2xl bg-[#fafaf9] dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#2e2e34] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl text-left">
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#18181b] dark:text-[#f4f4f5] tracking-tight">
              Start writing at the speed of thought.
            </h3>
            <p className="text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
              No server latency, no offline anxiety, no clutter. Open Proxima and write immediately with local-first speed.
            </p>
          </div>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 bg-[#5645d4] hover:bg-[#4534b3] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <span>Start Writing Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;