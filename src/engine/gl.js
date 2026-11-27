import { Renderer, Camera, Transform, Program, Mesh, Triangle, Vec2 } from "ogl";
import { gsap } from "gsap";
import { fullscreenVertex, floodBackgroundFragment } from "./shaders";
import { scrollState } from "./scroll";
import { prefersReducedMotion } from "./env";

let renderer = null;
let camera = null;
let scene = null;
let program = null;
let vw = 0;
let vh = 0;
let velocity = 0;
let pointerMoveBound = null;
let resizeBound = null;
let renderBound = false;

const mouse = { x: 0.55, y: 0.68, tx: 0.55, ty: 0.68 };
const toneState = {
  toneMix: 0,
  tone: [0.08, 0.08, 0.1],
  dark: 1,
};

export function glSupported() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (navigator.connection?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function initGL(initialDark = true) {
  if (renderer || !glSupported()) return null;

  toneState.dark = initialDark ? 1 : 0;

  renderer = new Renderer({
    dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    alpha: false,
    antialias: false,
  });

  const gl = renderer.gl;
  gl.canvas.classList.add("gl-canvas");
  gl.canvas.setAttribute("aria-hidden", "true");

  const host = document.getElementById("gl") || document.body;
  host.innerHTML = "";
  host.appendChild(gl.canvas);

  camera = new Camera(gl, { near: -10, far: 10 });
  camera.position.z = 1;
  scene = new Transform();

  vw = window.innerWidth;
  vh = window.innerHeight;
  renderer.setSize(vw, vh);

  program = new Program(gl, {
    vertex: fullscreenVertex,
    fragment: floodBackgroundFragment,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vec2(vw, vh) },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uDark: { value: toneState.dark },
      uToneMix: { value: 0 },
      uTone: { value: toneState.tone },
      uMouse: { value: new Vec2(mouse.x, mouse.y) },
    },
    depthTest: false,
    depthWrite: false,
  });

  new Mesh(gl, { geometry: new Triangle(gl), program }).setParent(scene);
  document.documentElement.classList.add("gl-on");

  resizeBound = () => {
    if (!renderer) return;
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh);
    program?.uniforms.uResolution.value.set(vw, vh);
  };

  pointerMoveBound = (e) => {
    mouse.tx = e.clientX / Math.max(vw, 1);
    mouse.ty = 1 - e.clientY / Math.max(vh, 1);
  };

  window.addEventListener("resize", resizeBound, { passive: true });
  window.addEventListener("pointermove", pointerMoveBound, { passive: true });

  if (!renderBound) {
    gsap.ticker.add(render);
    renderBound = true;
  }

  return program;
}

export function setGlTheme(isDark) {
  if (!program) return;
  gsap.to(program.uniforms.uDark, {
    value: isDark ? 1 : 0,
    duration: 0.7,
    ease: "power3.out",
    overwrite: "auto",
  });
}

export function setGlTone(rgbArray, mixAmount = 0) {
  if (!program) return;
  if (Array.isArray(rgbArray)) {
    gsap.to(program.uniforms.uTone.value, {
      0: rgbArray[0],
      1: rgbArray[1],
      2: rgbArray[2],
      duration: 0.65,
      ease: "power3.out",
    });
  }
  gsap.to(program.uniforms.uToneMix, {
    value: mixAmount,
    duration: 0.65,
    ease: "power3.out",
    overwrite: "auto",
  });
}

function render(t) {
  if (!renderer || !program || document.hidden) return;
  const s = scrollState();
  const targetVel = Math.max(-40, Math.min(40, s.velocity));
  velocity += (targetVel - velocity) * 0.1;

  mouse.x += (mouse.tx - mouse.x) * 0.06;
  mouse.y += (mouse.ty - mouse.y) * 0.06;

  const u = program.uniforms;
  u.uTime.value = t;
  u.uScroll.value = s.progress;
  u.uVelocity.value = velocity;
  u.uMouse.value.set(mouse.x, mouse.y);

  renderer.render({ scene, camera });
}

export function destroyGL() {
  if (renderBound) {
    gsap.ticker.remove(render);
    renderBound = false;
  }
  if (resizeBound) {
    window.removeEventListener("resize", resizeBound);
    resizeBound = null;
  }
  if (pointerMoveBound) {
    window.removeEventListener("pointermove", pointerMoveBound);
    pointerMoveBound = null;
  }
  if (renderer?.gl?.canvas?.parentNode) {
    renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas);
  }
  renderer = null;
  program = null;
  scene = null;
  camera = null;
  document.documentElement.classList.remove("gl-on");
}
