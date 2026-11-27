import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const DIST_DIR = path.resolve("dist");
const SITE_ORIGIN = "https://proxima.vinodjangid.site";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

const ROUTES = [
  {
    route: "/",
    outFile: "index.html",
    title: "Proxima | Local-First Workspace",
    description:
      "A quiet, local-first workspace for your thoughts and ideas. Works 100% offline, stores in open Markdown, and syncs across devices with zero tracking.",
  },
  {
    route: "/notes",
    outFile: path.join("notes", "index.html"),
    title: "Workspace | Proxima Notes",
    description:
      "Write and organize Markdown notes directly in local IndexedDB with instant search, keyboard shortcuts, and optional cloud synchronization.",
  },
  {
    route: "/login",
    outFile: path.join("login", "index.html"),
    title: "Sign In | Proxima",
    description:
      "Sign in to Proxima Notes to synchronize your local-first Markdown notes across all your devices with Firebase Authentication.",
  },
  {
    route: "/signup",
    outFile: path.join("signup", "index.html"),
    title: "Sign Up | Proxima",
    description:
      "Create a free Proxima account to back up and synchronize your offline Markdown notes across browsers and devices.",
  },
  {
    route: "/privacy",
    outFile: path.join("privacy", "index.html"),
    title: "Privacy Policy | Proxima",
    description:
      "Read how Proxima handles local browser storage in IndexedDB and encrypted Firebase synchronization with zero behavioral tracking.",
  },
  {
    route: "/terms",
    outFile: path.join("terms", "index.html"),
    title: "Terms of Service | Proxima",
    description:
      "Review the Terms of Service for using Proxima, the local-first Markdown notes workspace.",
  },
  {
    route: "/__not-found__",
    outFile: "404.html",
    title: "Page Not Found | Proxima",
    description:
      "This route sits outside the Proxima workspace. Return home or open your local notes stored safely on disk.",
  },
];

function startStaticSpaServer(rootDir) {
  const indexHtml = fs.readFileSync(path.join(rootDir, "index.html"));
  const server = http.createServer((req, res) => {
    const cleanUrl = decodeURIComponent((req.url || "/").split("?")[0]);
    const relPath = cleanUrl.replace(/^\/+/, "");
    const candidate = path.join(rootDir, relPath);

    if (
      relPath &&
      candidate.startsWith(rootDir) &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      const ext = path.extname(candidate).toLowerCase();
      res.writeHead(200, { "content-type": MIME_TYPES[ext] || "application/octet-stream" });
      fs.createReadStream(candidate).pipe(res);
      return;
    }

    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(indexHtml);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function findCachedChrome() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "ms-playwright"),
    path.join(os.homedir(), ".cache", "ms-playwright"),
    path.join(os.homedir(), "Library", "Caches", "ms-playwright"),
  ].filter(Boolean);

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const dirs = fs
      .readdirSync(root)
      .filter((d) => /^chromium-\d+/.test(d))
      .sort()
      .reverse();
    for (const dir of dirs) {
      for (const rel of [
        "chrome-win64/chrome.exe",
        "chrome-win/chrome.exe",
        "chrome-linux64/chrome",
        "chrome-linux/chrome",
      ]) {
        const candidate = path.join(root, dir, rel);
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

async function launchBrowser() {
  const args = ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
  try {
    return await chromium.launch({ args });
  } catch {
    const cached = findCachedChrome();
    if (cached) return await chromium.launch({ executablePath: cached, args });
    for (const channel of ["chrome", "msedge"]) {
      try {
        return await chromium.launch({ channel, args });
      } catch {
        // try next channel
      }
    }
    throw new Error("No Chromium binary found for prerendering.");
  }
}

function replaceMeta(html, routeSpec) {
  const canonicalUrl =
    routeSpec.route === "/__not-found__"
      ? `${SITE_ORIGIN}/404.html`
      : routeSpec.route === "/"
      ? `${SITE_ORIGIN}/`
      : `${SITE_ORIGIN}${routeSpec.route}`;

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${routeSpec.title}</title>`)
    .replace(
      /(<meta\s+name="title"\s+content=")[^"]*(")/i,
      `$1${routeSpec.title}$2`
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/i,
      `$1${routeSpec.description}$2`
    )
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*(")/i,
      `$1${canonicalUrl}$2`
    )
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*(")/i,
      `$1${canonicalUrl}$2`
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/i,
      `$1${routeSpec.title}$2`
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/i,
      `$1${routeSpec.description}$2`
    )
    .replace(
      /(<meta\s+name="twitter:url"\s+content=")[^"]*(")/i,
      `$1${canonicalUrl}$2`
    )
    .replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i,
      `$1${routeSpec.title}$2`
    )
    .replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i,
      `$1${routeSpec.description}$2`
    );
}

async function run() {
  const baseTemplate = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
  const server = await startStaticSpaServer(DIST_DIR);
  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;
  const browser = await launchBrowser();

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      colorScheme: "dark",
    });

    for (const spec of ROUTES) {
      const page = await context.newPage();
      await page.goto(`${origin}${spec.route}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("h1", { timeout: 10000 });
      await page.waitForTimeout(350);

      const rootMarkup = await page.evaluate(() => {
        const root = document.getElementById("root");
        const gl = root?.querySelector("#gl");
        if (gl) gl.innerHTML = "";
        root?.querySelectorAll("[style]").forEach((el) => {
          el.style.removeProperty("visibility");
          el.style.removeProperty("opacity");
          if (!el.getAttribute("style")) el.removeAttribute("style");
        });
        return root ? root.innerHTML : "";
      });

      await page.close();

      let outHtml = replaceMeta(baseTemplate, spec);
      outHtml = outHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${rootMarkup}</div>`
      );

      const dest = path.join(DIST_DIR, spec.outFile);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, outHtml, "utf8");
      console.log(`prerendered ${spec.route} -> dist/${spec.outFile.replace(/\\/g, "/")}`);
    }

    await context.close();

    // Keep Workbox precache revision synced for the updated dist/index.html
    const swPath = path.join(DIST_DIR, "sw.js");
    if (fs.existsSync(swPath)) {
      const indexBytes = fs.readFileSync(path.join(DIST_DIR, "index.html"));
      const md5 = crypto.createHash("md5").update(indexBytes).digest("hex");
      const swCode = fs.readFileSync(swPath, "utf8");
      const updatedSw = swCode.replace(
        /(\{url:"index\.html",revision:")[^"]+("\})/,
        `$1${md5}$2`
      );
      fs.writeFileSync(swPath, updatedSw, "utf8");
      console.log(`updated sw.js index.html revision -> ${md5}`);
    }
  } finally {
    await browser.close();
    server.closeAllConnections();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
