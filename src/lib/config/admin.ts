function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

const DEFAULT_ADMIN_AUTH_COOKIE = "reviews_karte_admin_session";

export const adminConfig = {
  email: readEnv("ADMIN_EMAIL"),
  password: readEnv("ADMIN_PASSWORD"),
  authCookieName: readEnv("ADMIN_AUTH_COOKIE") ?? DEFAULT_ADMIN_AUTH_COOKIE,
  loginPath: "/admin/login",
  homePath: "/admin",
} as const;

export function hasAdminCredentialsConfig(): boolean {
  return Boolean(adminConfig.email && adminConfig.password);
}

export function getAdminConfigError(): string {
  return [
    "管理者認証が未設定です。",
    "`.env.local` に `ADMIN_EMAIL` と `ADMIN_PASSWORD` を追加してください。",
    "設定例は `.env.local.example` の Admin Auth セクションにあります。",
  ].join(" ");
}
