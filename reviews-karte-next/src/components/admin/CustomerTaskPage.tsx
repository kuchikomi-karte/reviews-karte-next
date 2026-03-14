import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, type StatusValue } from "@/components/admin/StatusBadge";

type CustomerTaskPageProps = {
  title: string;
  storeName: string;
  status: StatusValue;
  description: string;
};

export function CustomerTaskPage({
  title,
  storeName,
  status,
  description,
}: CustomerTaskPageProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={`${storeName} の ${title} を確認するためのダミー管理画面です。`}
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-900">概要</h3>
          <dl className="mt-5 space-y-4 text-sm text-stone-700">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                対象店舗
              </dt>
              <dd className="mt-2 text-base font-medium text-stone-900">
                {storeName}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-stone-400">
                現在のステータス
              </dt>
              <dd className="mt-2">
                <StatusBadge status={status} />
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-900">画面説明</h3>
          <p className="mt-4 text-sm leading-7 text-stone-600">{description}</p>
          <div className="mt-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-stone-500">
            この画面は {title} 管理画面です。将来ここに履歴、チャットログ、作成内容、確認メモなどが入る想定です。
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-900">作業エリア</h3>
        <div className="mt-5 min-h-72 rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6 text-sm leading-7 text-stone-500">
          ここは将来の詳細管理エリアです。履歴一覧、入力フォーム、チャットログ、添付情報などを配置できる余白として確保しています。
        </div>
      </section>
    </>
  );
}
