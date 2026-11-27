import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ease, prefersReducedMotion } from "./env";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DURATIONS = { lines: 1.2, words: 1.05, chars: 0.85 };
const STAGGERS = { lines: 0.085, words: 0.035, chars: 0.016 };

function splitTween(el, isIntro) {
  const type = el.dataset.split || "lines";
  const delay = parseFloat(el.dataset.delay || "0");
  const s = { tween: null, done: false, requested: false };

  SplitText.create(el, {
    type: type === "lines" ? "lines" : `lines,${type}`,
    mask: "lines",
    autoSplit: true,
    linesClass: "split-line",
    onSplit(self) {
      gsap.set(el, { visibility: "visible" });
      if (s.done) return;
      const targets =
        type === "lines" ? self.lines : type === "words" ? self.words : self.chars;
      s.tween = gsap.from(targets, {
        yPercent: 108,
        duration: DURATIONS[type] || 1.2,
        stagger: STAGGERS[type] || 0.08,
        ease: ease.out,
        delay,
        paused: isIntro && !s.requested,
        onComplete: () => {
          s.done = true;
        },
        scrollTrigger: isIntro
          ? undefined
          : { trigger: el, start: "top 88%", once: true },
      });
      return s.tween;
    },
  });

  return () => {
    s.requested = true;
    s.tween?.play();
  };
}

function blockTween(el, paused) {
  const kind = el.dataset.reveal || "up";
  const delay = parseFloat(el.dataset.delay || "0");
  const from =
    kind === "fade"
      ? { autoAlpha: 0 }
      : kind === "clip"
      ? { clipPath: "inset(14% 0% 0% 0%)", y: 24, autoAlpha: 0 }
      : kind === "scale"
      ? { scale: 1.06, clipPath: "inset(8% 8% 8% 8%)", autoAlpha: 0 }
      : { y: 36, autoAlpha: 0 };
  const to =
    kind === "clip" || kind === "scale"
      ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1, y: 0, autoAlpha: 1 }
      : { y: 0, autoAlpha: 1 };

  gsap.set(el, { visibility: "visible" });
  return gsap.fromTo(el, from, {
    ...to,
    duration: kind === "fade" ? 0.9 : 1.25,
    ease: ease.out,
    delay,
    paused,
    scrollTrigger: paused
      ? undefined
      : { trigger: el, start: "top 90%", once: true },
  });
}

export function initReveals(root = document) {
  const intro = gsap.timeline({ paused: true });
  if (prefersReducedMotion()) {
    root.querySelectorAll("[data-split], [data-reveal]").forEach((el) => {
      el.style.visibility = "visible";
      el.style.opacity = "1";
    });
    return intro;
  }

  root.querySelectorAll("[data-split]").forEach((el) => {
    const isIntro = el.hasAttribute("data-intro");
    const play = splitTween(el, isIntro);
    if (isIntro) intro.add(play, 0);
  });

  root.querySelectorAll("[data-reveal]").forEach((el) => {
    const isIntro = el.hasAttribute("data-intro");
    const tween = blockTween(el, isIntro);
    if (isIntro) intro.add(() => tween.play(), 0);
  });

  root.querySelectorAll("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || "0.08");
    gsap.fromTo(
      el,
      { yPercent: -amount * 100 },
      {
        yPercent: amount * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  return intro;
}
