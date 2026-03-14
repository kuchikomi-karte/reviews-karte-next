function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

export const ADMIN_EMAIL = readEnv("ADMIN_EMAIL");
export const ADMIN_PASSWORD = readEnv("ADMIN_PASSWORD");
export const ADMIN_AUTH_COOKIE =
  readEnv("ADMIN_AUTH_COOKIE") ?? "reviews_karte_admin_session";

const ADMIN_AUTH_VALUE = "authenticated";

export function hasAdminAuthConfig(): boolean {
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);
}

export function isValidAdminCredentials(
  email: string,
  password: string,
): boolean {
  if (!hasAdminAuthConfig()) {
    return false;
  }

  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function getAdminSessionValue(): string {
  return ADMIN_AUTH_VALUE;
}

export function isAdminAuthenticated(
  cookieValue: string | undefined,
): boolean {
  return cookieValue === ADMIN_AUTH_VALUE;
}
