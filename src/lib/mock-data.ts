export type CustomerStatus = "稼働中" | "準備中" | "休止中";
export type ConsultationStatus = "未対応" | "対応中" | "完了";
export type AiReplyStatus = "未作成" | "作成中" | "提案済";
export type ReportStatus = "未作成" | "作成中" | "公開済";
export type StoreInfoStatus = "未入力" | "更新済";

export type Customer = {
  id: string;
  storeName: string;
  ownerName: string;
  plan: string;
  contractStatus: CustomerStatus;
  joinedAt: string;
  memo: string;
  aiReplyStatus: AiReplyStatus;
  weeklyReportStatus: ReportStatus;
  monthlyReportStatus: ReportStatus;
  consultationStatus: ConsultationStatus;
  storeInfoStatus: StoreInfoStatus;
  latestConsultation: {
    title: string;
    receivedAt: string;
    status: ConsultationStatus;
    summary: string;
  };
  reports: {
    id: string;
    title: string;
    month: string;
    status: "作成済み" | "確認待ち";
  }[];
  replyDrafts: {
    id: string;
    reviewSource: string;
    createdAt: string;
    tone: string;
  }[];
};

export type DashboardMetric = {
  label: string;
  value: string;
  description: string;
};

export type ReportItem = {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  createdAt: string;
  status: ReportStatus;
};

export type ConsultationItem = {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  receivedAt: string;
  status: ConsultationStatus;
  assignee: string;
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "会員数",
    value: "18",
    description: "現在管理している会員アカウント数",
  },
  {
    label: "未対応相談",
    value: "4",
    description: "本日中に一次返信したい相談件数",
  },
  {
    label: "今月レポート作成数",
    value: "26",
    description: "今月作成済み、または下書き中のレポート数",
  },
];

export const customers: Customer[] = [
  {
    id: "1",
    storeName: "Luna Beauty Clinic",
    ownerName: "山本 佳奈",
    plan: "プレミアム",
    contractStatus: "稼働中",
    joinedAt: "2025-11-01",
    memo:
      "Google口コミの返信品質改善が主目的。月次面談ではスタッフ教育向けのコメントテンプレート整理を優先。",
    aiReplyStatus: "提案済",
    weeklyReportStatus: "公開済",
    monthlyReportStatus: "作成中",
    consultationStatus: "対応中",
    storeInfoStatus: "更新済",
    latestConsultation: {
      title: "低評価レビューへの初動方針を確認したい",
      receivedAt: "2026-03-12T14:30:00",
      status: "対応中",
      summary:
        "待ち時間に関する星2レビューが増加。謝罪の伝え方と再発防止コメントの見せ方を調整中。",
    },
    reports: [
      {
        id: "r-101",
        title: "2026年3月 運用レポート",
        month: "2026-03",
        status: "確認待ち",
      },
      {
        id: "r-089",
        title: "2026年2月 運用レポート",
        month: "2026-02",
        status: "作成済み",
      },
    ],
    replyDrafts: [
      {
        id: "d-301",
        reviewSource: "Google",
        createdAt: "2026-03-12",
        tone: "丁寧・安心感重視",
      },
      {
        id: "d-288",
        reviewSource: "ホットペッパー",
        createdAt: "2026-03-05",
        tone: "上品・柔らかめ",
      },
    ],
  },
  {
    id: "2",
    storeName: "Atelier MUSE",
    ownerName: "佐藤 美咲",
    plan: "スタンダード",
    contractStatus: "稼働中",
    joinedAt: "2025-08-18",
    memo:
      "Instagram導線からの来店比率が高い。口コミ投稿促進の一言を会計時の導線に組み込みたい。",
    aiReplyStatus: "作成中",
    weeklyReportStatus: "作成中",
    monthlyReportStatus: "未作成",
    consultationStatus: "未対応",
    storeInfoStatus: "更新済",
    latestConsultation: {
      title: "レビュー投稿導線の文言相談",
      receivedAt: "2026-03-10T11:00:00",
      status: "未対応",
      summary:
        "新規顧客からも口コミを回収できるよう、店内POPや会計時の声掛け文言を見直したい。",
    },
    reports: [
      {
        id: "r-097",
        title: "2026年3月 レポート下書き",
        month: "2026-03",
        status: "確認待ち",
      },
      {
        id: "r-083",
        title: "2026年2月 運用レポート",
        month: "2026-02",
        status: "作成済み",
      },
    ],
    replyDrafts: [
      {
        id: "d-279",
        reviewSource: "Google",
        createdAt: "2026-03-09",
        tone: "親しみ・上質",
      },
      {
        id: "d-241",
        reviewSource: "Google",
        createdAt: "2026-02-27",
        tone: "簡潔・信頼感",
      },
    ],
  },
  {
    id: "3",
    storeName: "Noble Smile Dental",
    ownerName: "小林 恒一",
    plan: "ライト",
    contractStatus: "準備中",
    joinedAt: "2026-02-20",
    memo:
      "初回オンボーディング中。競合比較用の口コミ棚卸しと、院長コメント方針の初稿を準備予定。",
    aiReplyStatus: "未作成",
    weeklyReportStatus: "未作成",
    monthlyReportStatus: "未作成",
    consultationStatus: "完了",
    storeInfoStatus: "未入力",
    latestConsultation: {
      title: "初期ヒアリング内容の確認",
      receivedAt: "2026-03-08T16:20:00",
      status: "完了",
      summary:
        "競合3院のレビュー傾向と、自院の強みとして打ち出すキーワード整理が完了。",
    },
    reports: [
      {
        id: "r-090",
        title: "導入前 簡易診断メモ",
        month: "2026-03",
        status: "作成済み",
      },
    ],
    replyDrafts: [
      {
        id: "d-212",
        reviewSource: "Google",
        createdAt: "2026-03-01",
        tone: "誠実・医療機関向け",
      },
    ],
  },
];

export const weeklyReports: ReportItem[] = [
  {
    id: "weekly-003",
    customerId: "1",
    customerName: "Luna Beauty Clinic",
    title: "第2週 口コミ運用サマリー",
    createdAt: "2026-03-13T10:15:00",
    status: "公開済",
  },
  {
    id: "weekly-002",
    customerId: "2",
    customerName: "Atelier MUSE",
    title: "第2週 投稿導線レビュー",
    createdAt: "2026-03-12T18:40:00",
    status: "作成中",
  },
  {
    id: "weekly-001",
    customerId: "3",
    customerName: "Noble Smile Dental",
    title: "導入初週 オンボーディングメモ",
    createdAt: "2026-03-08T09:00:00",
    status: "未作成",
  },
];

export const monthlyReports: ReportItem[] = [
  {
    id: "monthly-003",
    customerId: "1",
    customerName: "Luna Beauty Clinic",
    title: "2026年3月 月次レポート",
    createdAt: "2026-03-13T16:30:00",
    status: "作成中",
  },
  {
    id: "monthly-002",
    customerId: "2",
    customerName: "Atelier MUSE",
    title: "2026年3月 月次レポート",
    createdAt: "2026-03-12T09:30:00",
    status: "未作成",
  },
  {
    id: "monthly-001",
    customerId: "3",
    customerName: "Noble Smile Dental",
    title: "導入前 月次サマリー",
    createdAt: "2026-03-08T13:10:00",
    status: "公開済",
  },
];

export const consultations: ConsultationItem[] = [
  {
    id: "consult-001",
    customerId: "1",
    customerName: "Luna Beauty Clinic",
    title: "低評価レビューへの返信文を確認したい",
    receivedAt: "2026-03-12T14:30:00",
    status: "対応中",
    assignee: "黒川 聖羅",
  },
  {
    id: "consult-002",
    customerId: "2",
    customerName: "Atelier MUSE",
    title: "レビュー投稿導線の文言相談",
    receivedAt: "2026-03-10T11:00:00",
    status: "未対応",
    assignee: "運用チーム",
  },
  {
    id: "consult-003",
    customerId: "3",
    customerName: "Noble Smile Dental",
    title: "初期ヒアリング内容の確認",
    receivedAt: "2026-03-08T16:20:00",
    status: "完了",
    assignee: "黒川 聖羅",
  },
];

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((customer) => customer.id === id);
}
