import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, sortByDateDesc } from "@/lib/admin-date";
import { consultations } from "@/lib/mock-data";

export default function AdminConsultationsPage() {
  const sortedConsultations = sortByDateDesc(
    consultations,
    (consultation) => consultation.receivedAt,
  );

  return (
    <>
      <PageHeader
        title="相談一覧"
        description="相談ログを新しい受付順で追える一覧画面です。"
      />

      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="px-6 py-4 font-medium">店舗名</th>
                <th className="px-6 py-4 font-medium">相談タイトル</th>
                <th className="px-6 py-4 font-medium">受付日時</th>
                <th className="px-6 py-4 font-medium">ステータス</th>
                <th className="px-6 py-4 font-medium">開く</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedConsultations.map((consultation) => (
                <tr key={consultation.id} className="text-stone-700">
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {consultation.customerName}
                  </td>
                  <td className="px-6 py-4">{consultation.title}</td>
                  <td className="px-6 py-4">
                    {formatDateTime(consultation.receivedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={consultation.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/customers/${consultation.customerId}/consultation`}
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
