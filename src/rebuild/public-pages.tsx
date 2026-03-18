import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";
import { readLandingPageDocument } from "@/lib/landing-page";
import { SiteHeader } from "@/rebuild/site-header";

type DocumentLayoutProps = {
  title: string;
  dateLabel: string;
  dateValue: string;
  children: ReactNode;
  footerHref: string;
  footerLabel: string;
};

function DocumentLayout({
  title,
  dateLabel,
  dateValue,
  children,
  footerHref,
  footerLabel,
}: DocumentLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f0e8" }}>
      <SiteHeader />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <h1
          style={{
            fontFamily: "Noto Serif JP, serif",
            fontSize: "32px",
            fontWeight: 400,
            color: "#0a0a0a",
            margin: "0 0 8px 0",
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#888888",
            marginBottom: "48px",
            letterSpacing: "0.05em",
          }}
        >
          {dateLabel}: {dateValue}
        </p>

        <article
          style={{
            fontFamily: "Noto Sans JP, sans-serif",
            fontSize: "14px",
            lineHeight: 2,
            color: "#333333",
          }}
        >
          {children}
        </article>

        <footer
          style={{
            marginTop: "64px",
            borderTop: "1px solid #d4c9b0",
            paddingTop: "24px",
            fontSize: "12px",
            color: "#888888",
          }}
        >
          <p style={{ margin: "0 0 12px 0", letterSpacing: "0.1em" }}>ai×me lab</p>
          <Link
            href={footerHref}
            style={{
              color: "#c9a84c",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            {footerLabel}
          </Link>
        </footer>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontFamily: "Noto Serif JP, serif",
          fontSize: "16px",
          fontWeight: 400,
          color: "#0a0a0a",
          marginBottom: "12px",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function HomePage() {
  const { bodyHtml, fontLinks, script, styles } = readLandingPageDocument();

  return (
    <>
      {fontLinks.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="lp-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {script ? (
        <Script id="landing-page-script" strategy="afterInteractive">
          {script}
        </Script>
      ) : null}
    </>
  );
}

export function TermsPage() {
  return (
    <DocumentLayout
      title="利用規約"
      dateLabel="施行日"
      dateValue="2026年3月16日"
      footerHref="/privacy"
      footerLabel="プライバシーポリシーはこちら"
    >
      <Section title="第1条（定義）">
        <p style={{ margin: 0 }}>
          本規約における「本サービス」とは、ai×me lab が提供する
          口コミ経営カルテを指します。
        </p>
      </Section>

      <Section title="第2条（利用条件）">
        <p style={{ margin: 0 }}>
          本サービスの利用には、本規約およびプライバシーポリシーへの同意が必要です。
        </p>
      </Section>

      <Section title="第3条（サービス内容）">
        <p style={{ margin: 0 }}>本サービスは以下を提供します。</p>
        <ul style={{ marginTop: "12px", marginBottom: 0, paddingLeft: "24px" }}>
          <li>Google 口コミ等に対する AI 返信案の提案</li>
          <li>週次・月次の口コミ分析レポート</li>
          <li>テキストチャット形式による経営相談</li>
        </ul>
      </Section>

      <Section title="第4条（免責事項・保証の否定）">
        <p style={{ margin: 0 }}>
          本サービスは口コミ返信案の提案および経営支援を行うものであり、
          集客数、売上、利益等の成果を保証しません。提供内容は参考情報であり、
          最終判断は利用者自身の責任で行っていただきます。
        </p>
      </Section>

      <Section title="第5条（料金・決済）">
        <p style={{ margin: 0 }}>
          月額料金はサービス内表示に従い、Stripe による自動課金で決済します。
        </p>
      </Section>

      <Section title="第6条（解約・返金）">
        <p style={{ margin: 0 }}>
          解約は所定の手続きにより受け付けます。既に支払われた料金は原則返金しません。
        </p>
      </Section>

      <Section title="第7条（情報管理・著作権）">
        <p style={{ margin: 0 }}>
          利用者から提供された情報はサービス提供目的に限って使用し、
          本サービスが作成した返信文の著作権は利用者に帰属します。
        </p>
      </Section>

      <Section title="第8条（禁止事項）">
        <p style={{ margin: 0 }}>
          不正アクセス、虚偽情報の登録、サービスの第三者への転売・共有を禁止します。
        </p>
      </Section>

      <Section title="第9条（サービスの変更・終了）">
        <p style={{ margin: 0 }}>
          運営者は、事前通知のうえでサービス内容の変更または終了を行う場合があります。
        </p>
      </Section>

      <Section title="第10条（準拠法・管轄）">
        <p style={{ margin: 0 }}>
          本規約は日本法に準拠し、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </Section>
    </DocumentLayout>
  );
}

export function PrivacyPage() {
  return (
    <DocumentLayout
      title="プライバシーポリシー"
      dateLabel="制定日"
      dateValue="2026年3月16日"
      footerHref="/terms"
      footerLabel="利用規約はこちら"
    >
      <p style={{ marginBottom: "32px", marginTop: 0 }}>運営: ai×me lab</p>

      <Section title="1. 収集する情報">
        <p style={{ margin: 0 }}>
          氏名、メールアドレス、店舗名、Google Place 関連情報、口コミ URL
        </p>
      </Section>

      <Section title="2. 利用目的">
        <p style={{ margin: 0 }}>
          サービス提供、口コミ分析レポートの作成、経営相談への回答、サービス改善
        </p>
      </Section>

      <Section title="3. 第三者提供">
        <p style={{ margin: 0 }}>
          法令に基づく場合を除き、利用者情報を第三者に提供しません。
        </p>
      </Section>

      <Section title="4. 情報管理">
        <p style={{ margin: 0 }}>
          収集した情報は Supabase を含むクラウド基盤上で適切に管理します。
        </p>
      </Section>

      <Section title="5. お問い合わせ">
        <p style={{ margin: 0 }}>kuchikomi.karte@gmail.com</p>
      </Section>
    </DocumentLayout>
  );
}
