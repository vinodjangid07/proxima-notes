import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initScroll, startScroll, stopScroll } from "./scroll";
import { initReveals } from "./reveal";
import { initButtonFills, initMagnetic } from "./interactions";
import { initGL, destroyGL } from "./gl";
import { prefersReducedMotion } from "./env";

export { onScroll, scrollState, scrollToTarget, resetScroll, stopScroll, startScroll } from "./scroll";
export { setGlTheme, setGlTone } from "./gl";
export { ease, isTouch, isMobile, prefersReducedMotion } from "./env";

export function syncFlags() {
  const h = document.documentElement.classList;
  h.add("js", "is-booted");
  h.toggle("motion", !prefersReducedMotion());
}

export function bootHomeEngine({ root = document, isDark = true } = {}) {
  syncFlags();
  const destroyScroll = initScroll();
  initGL(isDark);

  let introTimeline = null;
  let cleanupFills = () => {};
  let cleanupMagnetic = () => {};

  const ctx = gsap.context(() => {
    introTimeline = initReveals(root);
    cleanupFills = initButtonFills(root);
    cleanupMagnetic = initMagnetic(root);
  });

  startScroll();
  introTimeline?.play();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    cleanupFills();
    cleanupMagnetic();
    ctx.revert();
    destroyGL();
    destroyScroll?.();
    stopScroll();
  };
}
