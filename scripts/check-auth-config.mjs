import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

loadEnvFile(path.join(cwd, ".env.local"));
loadEnvFile(path.join(cwd, ".env"));

const requiredKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

const missingKeys = requiredKeys.filter((key) => !process.env[key]?.trim());

if (missingKeys.length > 0) {
  console.error("Missing required auth environment variables:");
  for (const key of missingKeys) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.trim().replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim();

const problems = [];

if (!isValidUrl(siteUrl)) {
  problems.push("NEXT_PUBLIC_SITE_URL must be an absolute URL.");
}

if (!isValidUrl(supabaseUrl)) {
  problems.push("NEXT_PUBLIC_SUPABASE_URL must be an absolute URL.");
}

if (supabaseUrl.includes("your-project-ref") || supabaseUrl.includes("your-project")) {
  problems.push("NEXT_PUBLIC_SUPABASE_URL is still a placeholder.");
}

if (
  supabaseAnonKey === "your-anon-key" ||
  supabaseAnonKey.includes("your_public_anon_key")
) {
  problems.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is still a placeholder.");
}

if (problems.length > 0) {
  console.error("Auth configuration problems:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

const callbackUrl = new URL("/auth/callback", siteUrl).toString();
const googleRedirectUrl = new URL("/auth/v1/callback", supabaseUrl).toString();

console.log("Auth env check passed.");
console.log(`- Site URL: ${siteUrl}`);
console.log(`- Supabase URL: ${supabaseUrl}`);
console.log(`- App callback URL: ${callbackUrl}`);
console.log(`- Google OAuth redirect URI: ${googleRedirectUrl}`);
console.log("- Verify the same values exist in both Vercel Production and Preview.");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
