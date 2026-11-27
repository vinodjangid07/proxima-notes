import { gsap } from "gsap";
import { ease, isTouch, prefersReducedMotion } from "./env";

export function initButtonFills(root = document) {
  if (isTouch() || prefersReducedMotion()) return () => {};
  const cleanups = [];

  root.querySelectorAll("[data-fill]").forEach((btn) => {
    const fill = btn.querySelector(".flood-btn__fill");
    if (!fill) return;
    let closed = true;

    const getOrigin = (e) => {
      const r = btn.getBoundingClientRect();
      return `${e.clientX - r.left}px ${e.clientY - r.top}px`;
    };

    const open = (at) => {
      if (closed) gsap.set(fill, { clipPath: `circle(0% at ${at})` });
      closed = false;
      btn.classList.add("is-filled");
      gsap.to(fill, {
        clipPath: `circle(155% at ${at})`,
        duration: 0.55,
        ease: ease.soft,
        overwrite: true,
      });
    };

    const close = (at) => {
      btn.classList.remove("is-filled");
      gsap.to(fill, {
        clipPath: `circle(0% at ${at})`,
        duration: 0.45,
        ease: ease.soft,
        overwrite: true,
        onComplete: () => {
          closed = true;
        },
      });
    };

    const onEnter = (e) => open(getOrigin(e));
    const onLeave = (e) => close(getOrigin(e));
    const onFocus = () => btn.matches(":focus-visible") && open("50% 50%");
    const onBlur = () => close("50% 50%");

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("focus", onFocus);
    btn.addEventListener("blur", onBlur);

    cleanups.push(() => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      btn.removeEventListener("focus", onFocus);
      btn.removeEventListener("blur", onBlur);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

export function initMagnetic(root = document) {
  if (isTouch() || prefersReducedMotion()) return () => {};
  const cleanups = [];

  root.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.22");
    const x = gsap.quickTo(el, "x", { duration: 0.55, ease: ease.soft });
    const y = gsap.quickTo(el, "y", { duration: 0.55, ease: ease.soft });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      x(0);
      y(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
