import type {
  AiReplyStatus,
  ConsultationStatus,
  CustomerStatus,
  ReportStatus,
  StoreInfoStatus,
} from "@/lib/mock-data";

export type StatusValue =
  | AiReplyStatus
  | ConsultationStatus
  | CustomerStatus
  | ReportStatus
  | StoreInfoStatus
  | "作成済み"
  | "確認待ち";

const statusStyles: Record<StatusValue, string> = {
  稼働中: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  準備中: "bg-amber-50 text-amber-700 ring-amber-200",
  休止中: "bg-stone-100 text-stone-600 ring-stone-200",
  未作成: "bg-stone-100 text-stone-700 ring-stone-200",
  作成中: "bg-sky-50 text-sky-700 ring-sky-200",
  提案済: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  公開済: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  未対応: "bg-rose-50 text-rose-700 ring-rose-200",
  対応中: "bg-sky-50 text-sky-700 ring-sky-200",
  完了: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  未入力: "bg-amber-50 text-amber-700 ring-amber-200",
  更新済: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  作成済み: "bg-stone-100 text-stone-700 ring-stone-200",
  確認待ち: "bg-violet-50 text-violet-700 ring-violet-200",
};

type StatusBadgeProps = {
  status: StatusValue;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
