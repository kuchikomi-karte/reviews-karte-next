import {
  adminConfig,
  hasAdminCredentialsConfig,
} from "@/lib/config/admin";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/rebuild/routes";

const ADMIN_AUTH_VALUE = "authenticated";

export const ADMIN_AUTH_COOKIE = adminConfig.authCookieName;
export { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH };

export function hasAdminAuthConfig(): boolean {
  return hasAdminCredentialsConfig();
}

export function isValidAdminCredentials(
  email: string,
  password: string,
): boolean {
  if (!hasAdminAuthConfig()) {
    return false;
  }

  return email === adminConfig.email && password === adminConfig.password;
}

export function getAdminSessionValue(): string {
  return ADMIN_AUTH_VALUE;
}

export function isAdminAuthenticated(
  cookieValue: string | undefined,
): boolean {
  return cookieValue === ADMIN_AUTH_VALUE;
}

