import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin-date";
import { getCustomerById } from "@/lib/mock-data";

type CustomerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={customer.storeName}
        description="顧客情報、内部メモ、最新相談、レポート一覧、返信案一覧を確認するトップページです。"
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article
          id="customer-info"
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-stone-900">顧客情報</h3>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                店舗名
              </dt>
              <dd className="mt-2 text-sm text-stone-700">{customer.storeName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                担当者
              </dt>
              <dd className="mt-2 text-sm text-stone-700">{customer.ownerName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                プラン
              </dt>
              <dd className="mt-2 text-sm text-stone-700">{customer.plan}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                契約状態
              </dt>
              <dd className="mt-2">
                <StatusBadge status={customer.contractStatus} />
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                契約開始日
              </dt>
              <dd className="mt-2 text-sm text-stone-700">{customer.joinedAt}</dd>
            </div>
          </dl>
        </article>

        <article
          id="internal-note"
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-stone-900">内部メモ</h3>
          <textarea
            defaultValue={customer.memo}
            className="mt-5 min-h-48 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700 outline-none"
          />
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">最新相談</h3>
              <p className="mt-2 text-sm text-stone-500">
                直近の相談内容とステータスを表示しています。
              </p>
            </div>
            <StatusBadge status={customer.latestConsultation.status} />
          </div>
          <div className="mt-5 rounded-2xl bg-stone-50 p-5">
            <p className="text-base font-medium text-stone-900">
              {customer.latestConsultation.title}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              受信日時: {formatDateTime(customer.latestConsultation.receivedAt)}
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-700">
              {customer.latestConsultation.summary}
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-900">レポート一覧</h3>
          <div className="mt-5 space-y-4">
            {customer.reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-stone-200 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-stone-900">{report.title}</p>
                  <StatusBadge status={report.status} />
                </div>
                <p className="mt-2 text-sm text-stone-500">対象月: {report.month}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-900">返信案一覧</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {customer.replyDrafts.map((draft) => (
            <article
              key={draft.id}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
            >
              <p className="text-sm font-medium text-stone-900">
                {draft.reviewSource} 返信案
              </p>
              <p className="mt-2 text-sm text-stone-500">
                作成日: {draft.createdAt}
              </p>
              <p className="mt-4 text-sm leading-6 text-stone-700">
                トーン: {draft.tone}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
