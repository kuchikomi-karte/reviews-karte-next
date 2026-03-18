import {
  USER_HOME_PATH,
  USER_LOGIN_PATH,
  USER_PREMIUM_PATH,
  USER_REGISTER_PATH,
} from "@/rebuild/routes";

const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const publicSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";

type LoggableAuthError = {
  code?: string;
  message?: string;
  name?: string;
  status?: number;
};

export {
  USER_HOME_PATH,
  USER_LOGIN_PATH,
  USER_PREMIUM_PATH,
  USER_REGISTER_PATH,
};

export function hasUserAuthConfig(): boolean {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    return false;
  }

  return (
    !publicSupabaseUrl.includes("your-project.supabase.co") &&
    publicSupabaseAnonKey !== "your-anon-key"
  );
}

export function isUserProtectedPath(pathname: string): boolean {
  return (
    pathname === USER_HOME_PATH ||
    pathname.startsWith(`${USER_HOME_PATH}/`) ||
    pathname === USER_PREMIUM_PATH
  );
}

export function getUserAuthConfigSummary() {
  return {
    hasSupabaseUrl: Boolean(publicSupabaseUrl),
    hasSupabaseAnonKey: Boolean(publicSupabaseAnonKey),
    hasSiteUrl: Boolean(publicSiteUrl),
    siteUrl: publicSiteUrl || null,
    supabaseHost: safeExtractHost(publicSupabaseUrl),
  };
}

export function toLoggableAuthError(error: unknown): LoggableAuthError {
  if (!error || typeof error !== "object") {
    return {};
  }

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    name?: unknown;
    status?: unknown;
  };

  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message:
      typeof candidate.message === "string" ? candidate.message : undefined,
    name: typeof candidate.name === "string" ? candidate.name : undefined,
    status: typeof candidate.status === "number" ? candidate.status : undefined,
  };
}

export function getAuthFailureMessage(
  mode: "email-login" | "email-register" | "google-login" | "google-register",
  error?: unknown,
): string {
  const normalizedError = toLoggableAuthError(error);
  const errorText = [
    normalizedError.code?.toLowerCase(),
    normalizedError.message?.toLowerCase(),
  ]
    .filter(Boolean)
    .join(" ");

  if (errorText.includes("email not confirmed")) {
    return "メールアドレスの確認が完了していません。受信したメールをご確認ください。";
  }

  if (errorText.includes("invalid login credentials")) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }

  if (errorText.includes("user already registered")) {
    return "このメールアドレスは既に登録されています。ログインをお試しください。";
  }

  if (errorText.includes("password should be")) {
    return "パスワードの要件を満たしていません。6文字以上で入力してください。";
  }

  if (errorText.includes("signup is disabled")) {
    return "現在メール登録は停止されています。管理者が Supabase Auth 設定を確認してください。";
  }

  if (errorText.includes("email rate limit exceeded")) {
    return "短時間に試行が集中しています。少し待ってから再度お試しください。";
  }

  if (mode === "email-login") {
    return "ログインに失敗しました。入力内容をご確認のうえ再度お試しください。";
  }

  if (mode === "email-register") {
    return "登録に失敗しました。時間を置いて再度お試しください。";
  }

  if (mode === "google-login") {
    return "Google ログインを開始できませんでした。時間を置いて再度お試しください。";
  }

  return "Google 登録を開始できませんでした。時間を置いて再度お試しください。";
}

function safeExtractHost(value: string): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}
