import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const githubPages = process.env.GITHUB_PAGES === "1";

// Old Wix addresses -> new pages (see src/config/legacy-redirects.json).
// Permanent (308) redirects need a server-capable host (Vercel, Netlify, any
// Node host); a static GitHub Pages export cannot send them.
const legacy = JSON.parse(fs.readFileSync(path.join(root, "src/config/legacy-redirects.json"), "utf8")).redirects;
const sourceVariants = (source) => {
  const encoded = encodeURI(source);
  return [...new Set([source, encoded, encoded.replace(/%[0-9A-F]{2}/g, (hex) => hex.toLowerCase())])];
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: githubPages ? "export" : undefined,
  trailingSlash: githubPages,
  basePath: githubPages ? "/papp-web-liquid-glass" : undefined,
  assetPrefix: githubPages ? "/papp-web-liquid-glass/" : undefined,
  env: {
    NEXT_PUBLIC_SITE_BASE_PATH: githubPages ? "/papp-web-liquid-glass" : ""
  },
  ...(githubPages
    ? {}
    : {
        async redirects() {
          return legacy.flatMap(({ from, to }) => sourceVariants(from).map((source) => ({ source, destination: to, permanent: true })));
        }
      }),
  reactStrictMode: true,
  images: {
    unoptimized: githubPages,
    formats: ["image/avif", "image/webp"]
  },
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "color-functions"]
  },
  turbopack: {
    root
  }
};

export default nextConfig;
