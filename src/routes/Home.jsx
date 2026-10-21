import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import useAuth from "../context/useAuth";
import Navbar from "../components/Notes/Navbar";
import Footer from "../components/Notes/Footer";
import ThoughtConstellation from "../components/Home/ThoughtConstellation";
import { 
  ArrowRight, 
  CheckSquare, 
  Square, 
  Maximize2, 
  WifiOff, 
  Zap, 
  ShieldCheck, 
  FileText,
  Lock
} from "lucide-react";

const Home = () => {
  const { currentUser } = useAuth();
  const [activeWorkflow, setActiveWorkflow] = useState("structure");

  const [tasks, setTasks] = useState([
    { id: 1, text: "Draft launch outline for project", done: true },
    { id: 2, text: "Review notes on mobile offline", done: true },
    { id: 3, text: "Organize weekly reading list", done: false },
    { id: 4, text: "Export notes to markdown", done: true }
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider).catch((err) => {
      console.error("Login failed:", err.message);
    });
  };

  const workflowItems = [
    {
      id: "capture",
      title: "Draft",
      desc: "Start writing the moment an idea strikes. Zero loading screens, no spinners, and zero delay between thinking and writing."
    },
    {
      id: "structure",
      title: "Structure",
      desc: "Organize your thoughts with frictionless checklists, clear headers, and clean styling. Everything stays readable and structured by default."
    },
    {
      id: "offline",
      title: "Anywhere",
      desc: "Write freely on airplanes, in trains, or in Wi-Fi dead zones. Your notes save locally to your device and sync quietly when reconnected."
    },
    {
      id: "retain",
      title: "Keep Forever",
      desc: "Your words are stored in open standard markdown. No proprietary walled gardens, no lock-in. You own your notes forever."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e11] text-[#171717] dark:text-[#ededed] transition-colors duration-200 flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar />

      <section className="relative w-full overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-24">
        <ThoughtConstellation />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-[-2px] text-[#171717] dark:text-white leading-[1.04] max-w-4xl">
            Write at the speed of thought. Never lose an idea.
          </h1>

          <p className="text-base sm:text-lg text-[#60646c] dark:text-[#a0a4ab] mt-6 max-w-2xl font-normal leading-relaxed">
            A quiet workspace engineered for instant capture, offline resilience, and pure focus. No server lag, no clutter, and no paywalls.
          </p>

          <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
            {currentUser ? (
              <Link
                to="/notes"
                className="h-10 px-6 inline-flex items-center gap-2 bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#eaeaea] rounded-lg font-medium text-sm transition-all active:scale-98 shadow-xs"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  className="h-10 px-5 inline-flex items-center gap-2.5 bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#eaeaea] rounded-lg font-medium text-sm transition-all cursor-pointer active:scale-98 shadow-xs"
                >
                  <img
                    className="w-4 h-4 shrink-0"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                  />
                  <span>Continue with Google</span>
                </button>
                <Link
                  to="/notes"
                  className="h-10 px-5 inline-flex items-center text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-white transition-colors"
                >
                  <span>Try as Guest</span>
                </Link>
              </>
            )}
          </div>

          <div className="mt-14 flex items-center justify-center gap-8 sm:gap-14 flex-wrap text-xs font-medium select-none">
            <div className="flex items-center gap-2 text-[#60646c] dark:text-[#a0a4ab]">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Instant 0ms Load</span>
            </div>
            <div className="flex items-center gap-2 text-[#60646c] dark:text-[#a0a4ab]">
              <WifiOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Works 100% Offline</span>
            </div>
            <div className="flex items-center gap-2 text-[#60646c] dark:text-[#a0a4ab]">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Open Markdown</span>
            </div>
            <div className="flex items-center gap-2 text-[#60646c] dark:text-[#a0a4ab]">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Private &amp; Ad-Free</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-6 pb-24 flex flex-col gap-16 w-full">
        <section className="w-full bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] dark:text-white">
                How thoughtful writing happens
              </h2>

              <div className="flex flex-col gap-2">
                {workflowItems.map((item) => {
                  const isActive = activeWorkflow === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveWorkflow(item.id)}
                      className={`text-left p-4 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isActive
                          ? "bg-white dark:bg-[#1f1f24] text-[#171717] dark:text-white shadow-xs font-medium"
                          : "text-[#60646c] dark:text-[#a0a4ab] hover:text-[#171717] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className={`text-base font-semibold ${isActive ? "text-[#171717] dark:text-white" : "text-[#60646c] dark:text-[#71717a]"}`}>
                        {item.title}
                      </span>
                      {isActive && (
                        <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-[#0e0e11] rounded-xl p-6 sm:p-8 min-h-[340px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                  <span className="text-xs font-medium text-[#60646c] dark:text-[#a0a4ab]">
                    {activeWorkflow === "capture" && "Instant local draft"}
                    {activeWorkflow === "structure" && "Markdown formatting"}
                    {activeWorkflow === "offline" && "Saved to device • 0ms"}
                    {activeWorkflow === "retain" && "Standard .md format"}
                  </span>
                </div>
                <span className="text-xs text-[#8b8d98] dark:text-[#71717a]">Oct 21, 2026</span>
              </div>

              <div className="flex-1 flex flex-col justify-center py-4">
                {activeWorkflow === "capture" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-[#171717] dark:text-white">
                      The Architecture of Quiet Thinking
                    </h3>
                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                      Ideas are fragile. If an app takes three seconds to boot, the thought vanishes. Proxima writes directly to your device memory instantly.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                      <span>Ready to write • No spinners</span>
                    </div>
                  </div>
                )}

                {activeWorkflow === "structure" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-[#171717] dark:text-white">
                      Weekly Focus &amp; Checklists
                    </h3>
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-2.5 text-xs text-[#171717] dark:text-white">
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Clarify product direction and priorities</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#171717] dark:text-white">
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Review notes on mobile offline</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#60646c] dark:text-[#a0a4ab]">
                        <Square className="w-4 h-4 text-[#8b8d98] dark:text-[#71717a] shrink-0" />
                        <span>Distraction-free deep work session</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeWorkflow === "offline" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-[#171717] dark:text-white">
                      Notes on Flight #204
                    </h3>
                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                      30,000 feet in the air with airplane mode on. Every letter typed is securely saved to your local database immediately.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#60646c] dark:text-[#71717a] mt-2">
                      <WifiOff className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>Airplane Mode active • Syncs silently upon reconnect</span>
                    </div>
                  </div>
                )}

                {activeWorkflow === "retain" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-[#171717] dark:text-white">
                      Reading Highlights.md
                    </h3>
                    <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                      "Simplicity is about subtracting the obvious and adding the meaningful."
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#60646c] dark:text-[#71717a] mt-2 bg-[#f0f0f3] dark:bg-[#18181b] p-2.5 rounded-lg">
                      <span>proxima export --format markdown</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#8b8d98] dark:text-[#71717a] pt-3">
                <span>Reading time: 1 min</span>
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          <div className="lg:col-span-5 bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-8 sm:p-10 flex flex-col justify-between">
            <div className="flex flex-col items-center text-center gap-6 my-auto py-4">
              <div className="w-20 h-20 rounded-2xl bg-[#f0f0f3] dark:bg-[#1c1c21] p-1 flex items-center justify-center">
                <img src="/proxima_logo.webp" alt="Proxima" className="w-10 h-10 object-contain invert dark:invert-0" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#171717] dark:text-white">
                  Built for Speed
                </h3>
                <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed mt-2 max-w-sm">
                  Captures your thoughts with zero latency and complete data sovereignty. Designed for thinkers, writers, and builders.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <a
                href="https://github.com/vinodjangid07/proxima-notes"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-5 inline-flex items-center gap-2 rounded-lg bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#eaeaea] text-xs font-semibold transition-all active:scale-95 shadow-xs"
              >
                <span>View on GitHub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-2 max-w-md">
                  <h3 className="text-xl font-semibold tracking-tight text-[#171717] dark:text-white">
                    Distraction-free Zen mode
                  </h3>
                  <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
                    Designed to keep you in flow. Hide all browser chrome, sidebars, and buttons with a single key for uninterrupted focus.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#f0f0f3] dark:bg-[#1c1c21] flex items-center justify-center text-[#171717] dark:text-white shrink-0">
                  <Maximize2 className="w-5 h-5 text-current" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <span className="text-xs text-[#8b8d98] dark:text-[#71717a]">Single-key focus</span>
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717] dark:text-white hover:underline"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#171717] dark:text-white">Interactive Tasks</span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {completedCount}/{tasks.length} Done
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    {tasks.slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1c1c21] hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors cursor-pointer select-none text-xs"
                      >
                        {task.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8b8d98] dark:text-[#71717a] shrink-0" />
                        )}
                        <span className={`truncate ${task.done ? "line-through text-[#8b8d98] dark:text-[#71717a]" : "text-[#171717] dark:text-[#ededed]"}`}>
                          {task.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#8b8d98] dark:text-[#71717a] pt-4">
                  Checklists auto-save and calculate progress live
                </p>
              </div>

              <div className="bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#171717] dark:text-white">Zero Lock-In</span>
                    <span className="text-xs font-medium text-[#60646c] dark:text-[#a0a4ab]">.md files</span>
                  </div>

                  <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] leading-relaxed mt-2">
                    All notes stay in open standard markdown. Copy, export, or open your files in Obsidian, VS Code, or any markdown editor anytime.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-4">
                  <span>Data ownership</span>
                  <span>100% Yours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
          <div className="bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f0f0f3] dark:bg-[#1c1c21] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717] dark:text-white">0ms Instant Capture</h3>
            <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
              Notes load from your local drive immediately with zero spinners, network latency, or waiting.
            </p>
          </div>

          <div className="bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f0f0f3] dark:bg-[#1c1c21] flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717] dark:text-white">True Offline Freedom</h3>
            <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
              No internet connection required. Work anywhere in the world and sync silently when back online.
            </p>
          </div>

          <div className="bg-[#fafafb] dark:bg-[#151518] rounded-2xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f0f0f3] dark:bg-[#1c1c21] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717] dark:text-white">Total Privacy</h3>
            <p className="text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
              No trackers, no surveillance capitalism, and no telemetry selling your private notes.
            </p>
          </div>
        </section>

        <section className="w-full bg-[#fafafb] dark:bg-[#151518] rounded-2xl py-16 px-8 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#171717] dark:text-white">
            A quiet home for your thoughts.
          </h2>
          <p className="text-base text-[#60646c] dark:text-[#a0a4ab] max-w-lg leading-relaxed">
            Write without interruptions, offline lag, or proprietary walled gardens. Free and open source.
          </p>
          <Link
            to="/notes"
            className="h-10 px-6 inline-flex items-center gap-2 bg-black text-white hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:hover:bg-[#eaeaea] rounded-lg font-medium text-sm transition-all shadow-sm active:scale-98"
          >
            <span>Start Writing Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;