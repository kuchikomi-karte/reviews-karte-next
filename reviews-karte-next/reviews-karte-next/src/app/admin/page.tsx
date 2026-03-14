import { PageHeader } from "@/components/admin/PageHeader";
import { dashboardMetrics } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description="会員数、相談状況、レポート進行をまとめて確認するための管理者トップです。"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{metric.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              {metric.description}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
