import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./env";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
const listeners = new Set();
const state = { y: 0, velocity: 0, progress: 0 };
let tickerBound = false;

function nativeTick() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const currentY = window.scrollY;
  state.velocity = currentY - state.y;
  state.y = currentY;
  state.progress = max > 0 ? currentY / max : 0;
  listeners.forEach((fn) => fn(state));
}

function raf(time) {
  lenis?.raf(time * 1000);
}

export function initScroll() {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) {
    window.addEventListener("scroll", nativeTick, { passive: true });
    return () => window.removeEventListener("scroll", nativeTick);
  }
  if (!lenis) {
    lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
      anchors: true,
    });
    lenis.on("scroll", (l) => {
      state.y = l.scroll;
      state.velocity = l.velocity;
      state.progress = l.limit > 0 ? l.scroll / l.limit : 0;
      ScrollTrigger.update();
      listeners.forEach((fn) => fn(state));
    });
  }
  if (!tickerBound) {
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    tickerBound = true;
  }
  return () => {
    if (tickerBound) {
      gsap.ticker.remove(raf);
      tickerBound = false;
    }
    lenis?.destroy();
    lenis = null;
  };
}

export const onScroll = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const scrollState = () => state;
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

export function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.3,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "auto" });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
  state.y = 0;
  state.velocity = 0;
  state.progress = 0;
}
