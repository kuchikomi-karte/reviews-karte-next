import fs from "node:fs";
import path from "node:path";

type LandingPageDocument = {
  bodyHtml: string;
  fontLinks: string[];
  script: string;
  styles: string;
  title: string;
};

let cachedDocument: LandingPageDocument | null = null;

function extract(source: string, pattern: RegExp): string {
  return source.match(pattern)?.[1]?.trim() ?? "";
}

function replaceCanonicalUrls(source: string): string {
  return source
    .replaceAll("https://reviews-karte.vercel.app/dashboard/login", "/login")
    .replaceAll("https://reviews-karte.vercel.app/dashboard/register", "/register")
    .replaceAll("https://reviews-karte.vercel.app/login", "/login")
    .replaceAll("https://reviews-karte.vercel.app/register", "/register")
    .replaceAll("https://reviews-karte-next.vercel.app/dashboard/login", "/login")
    .replaceAll("https://reviews-karte-next.vercel.app/dashboard/register", "/register")
    .replaceAll("https://reviews-karte-next.vercel.app/login", "/login")
    .replaceAll("https://reviews-karte-next.vercel.app/register", "/register")
    .replaceAll('href="https://reviews-karte.vercel.app/dashboard/register"', 'href="/register"')
    .replaceAll('href="https://reviews-karte.vercel.app/dashboard/login"', 'href="/login"');
}

function normalizeStyles(source: string): string {
  return source
    .replaceAll("html {", ".lp-root {")
    .replaceAll("body {", ".lp-root {");
}

export function readLandingPageDocument(): LandingPageDocument {
  if (cachedDocument) {
    return cachedDocument;
  }

  const filePath = path.join(
    process.cwd(),
    "kuchikomi-karte.github.io",
    "index.html",
  );
  const html = fs.readFileSync(filePath, "utf8");
  const fontLinks = [...html.matchAll(/<link[^>]+href="([^"]+)"[^>]*>/g)].map(
    (match) => match[1],
  );

  cachedDocument = {
    title: extract(html, /<title>([\s\S]*?)<\/title>/),
    fontLinks,
    styles: normalizeStyles(extract(html, /<style>([\s\S]*?)<\/style>/)),
    bodyHtml: replaceCanonicalUrls(extract(html, /<body>([\s\S]*?)<\/body>/)),
    script: extract(html, /<script>([\s\S]*?)<\/script>/),
  };

  return cachedDocument;
}
