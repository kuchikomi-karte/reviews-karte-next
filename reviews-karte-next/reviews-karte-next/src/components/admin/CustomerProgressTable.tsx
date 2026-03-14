"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { StatusBadge, type StatusValue } from "@/components/admin/StatusBadge";
import { customers } from "@/lib/mock-data";

type StatusCellProps = {
  href: string;
  status: StatusValue;
};

function StatusCell({ href, status }: StatusCellProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-transparent p-2 transition hover:border-stone-200 hover:bg-stone-50"
    >
      <div className="flex items-center justify-center">
        <StatusBadge status={status} />
      </div>
    </Link>
  );
}

export function CustomerProgressTable() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) =>
    customer.storeName.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-6 py-5">
        <label className="block text-sm font-medium text-stone-700">
          店舗名で検索
        </label>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="店舗名を入力"
          className="mt-3 w-full max-w-md rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1120px] divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-6 py-4 font-medium">店舗名</th>
              <th className="px-4 py-4 text-center font-medium">
                AI口コミ返信案
              </th>
              <th className="px-4 py-4 text-center font-medium">
                週次レポート
              </th>
              <th className="px-4 py-4 text-center font-medium">
                月次レポート
              </th>
              <th className="px-4 py-4 text-center font-medium">経営相談</th>
              <th className="px-4 py-4 text-center font-medium">店舗情報</th>
              <th className="px-6 py-4 text-center font-medium">設定</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="text-stone-700">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="block rounded-2xl border border-transparent p-2 transition hover:border-stone-200 hover:bg-stone-50"
                  >
                    <div className="font-medium text-stone-900">
                      {customer.storeName}
                    </div>
                    <div className="mt-1 text-xs text-stone-500">
                      プラン: {customer.plan}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusCell
                    href={`/admin/customers/${customer.id}/ai-reply`}
                    status={customer.aiReplyStatus}
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusCell
                    href={`/admin/customers/${customer.id}/weekly-report`}
                    status={customer.weeklyReportStatus}
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusCell
                    href={`/admin/customers/${customer.id}/monthly-report`}
                    status={customer.monthlyReportStatus}
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusCell
                    href={`/admin/customers/${customer.id}/consultation`}
                    status={customer.consultationStatus}
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusCell
                    href={`/admin/customers/${customer.id}/store-info`}
                    status={customer.storeInfoStatus}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <details className="relative inline-block text-left">
                    <summary className="cursor-pointer rounded-2xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                      設定
                    </summary>
                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-stone-200 bg-white p-2 text-left shadow-lg">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        顧客トップを開く
                      </Link>
                      <Link
                        href={`/admin/customers/${customer.id}/store-info`}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        店舗情報を開く
                      </Link>
                      <Link
                        href={`/admin/customers/${customer.id}#customer-info`}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        契約情報を見る
                      </Link>
                      <Link
                        href={`/admin/customers/${customer.id}#internal-note`}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        メモ確認
                      </Link>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
