import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, sortByDateDesc } from "@/lib/admin-date";
import { weeklyReports } from "@/lib/mock-data";

export default function AdminWeeklyReportsPage() {
  const sortedReports = sortByDateDesc(
    weeklyReports,
    (report) => report.createdAt,
  );

  return (
    <>
      <PageHeader
        title="週次レポート"
        description="週次レポートのログを新しい作成順で確認する一覧画面です。"
      />

      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="px-6 py-4 font-medium">店舗名</th>
                <th className="px-6 py-4 font-medium">レポートタイトル</th>
                <th className="px-6 py-4 font-medium">作成日</th>
                <th className="px-6 py-4 font-medium">ステータス</th>
                <th className="px-6 py-4 font-medium">開く</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedReports.map((report) => (
                <tr key={report.id} className="text-stone-700">
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {report.customerName}
                  </td>
                  <td className="px-6 py-4">{report.title}</td>
                  <td className="px-6 py-4">
                    {formatDateTime(report.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/customers/${report.customerId}/weekly-report`}
                      className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4"
                    >
                      開く
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
