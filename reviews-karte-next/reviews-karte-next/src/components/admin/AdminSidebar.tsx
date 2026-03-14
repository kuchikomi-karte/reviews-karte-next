"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import { adminNavigation } from "@/components/admin/admin-nav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-stone-200 bg-white/90 px-4 py-5 shadow-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone-400">
          Admin Console
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-stone-900">
          口コミ経営カルテ 管理
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          管理者向けの運用状況と顧客情報を確認するためのローカル確認用画面です。
        </p>
      </div>

      <nav className="flex flex-col gap-2 lg:flex-1">
        {adminNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="mt-6 lg:mt-8">
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
        >
          ログアウト
        </button>
      </form>
    </aside>
  );
}
