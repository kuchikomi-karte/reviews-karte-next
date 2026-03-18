import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  isAdminAuthenticated,
} from "@/lib/auth/admin";
import {
  getAdminConfigError,
  hasAdminCredentialsConfig,
} from "@/lib/config/admin";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function RebuildAdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const [{ error }, cookieStore] = await Promise.all([searchParams, cookies()]);
  const isLoggedIn = isAdminAuthenticated(
    cookieStore.get(ADMIN_AUTH_COOKIE)?.value,
  );

  if (isLoggedIn) {
    redirect(ADMIN_HOME_PATH);
  }

  const isConfigured = hasAdminCredentialsConfig();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_50px_rgba(28,25,23,0.08)] sm:p-10">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone-400">
            Admin Login
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
            口コミ経営カルテ 管理者ログイン
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            管理者導線専用の認証画面です。ユーザーサイト側の認証とは完全に分離しています。
          </p>
        </div>

        {error === "invalid_credentials" ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            メールアドレスまたはパスワードが正しくありません。
          </div>
        ) : null}

        {(!isConfigured || error === "auth_not_configured") && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {getAdminConfigError()}
          </div>
        )}

        <form action={`${ADMIN_LOGIN_PATH}/submit`} method="post" className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            ログイン
          </button>
        </form>
      </div>
    </main>
  );
}
