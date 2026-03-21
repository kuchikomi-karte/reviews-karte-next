"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserShell } from "@/components/dashboard/UserShell";

function buildFallbackResponse(review: string) {
  return `このたびはご来店とご意見をありがとうございます。\n\n${review}\n\nご指摘いただいた点をスタッフ間で共有し、次回の体験改善につなげます。またのご来店をお待ちしております。`;
}

export default function ReviewsPage() {
  const [review, setReview] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleGenerate = async () => {
    if (!review.trim()) {
      setStatusMessage("口コミ本文を入力してください。");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review,
          userId: user?.id ?? "demo-user",
        }),
      });

      if (!response.ok) {
        throw new Error("fallback");
      }

      const data = (await response.json()) as { response?: string };
      setGeneratedReply(data.response ?? buildFallbackResponse(review));
      setStatusMessage("返信案を生成しました。");
    } catch {
      setGeneratedReply(buildFallbackResponse(review));
      setStatusMessage("ローカル生成モードで返信案を表示しています。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserShell
      eyebrow="Reviews"
      title="AI口コミ返信"
      description="口コミ本文を入力し、返信案の初稿を作るページです。ダッシュボードの主要導線だったため、404 ではなく実際に使える画面へ戻しています。"
    >
      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1.1fr 0.9fr" }}>
        <section style={panelStyle}>
          <label style={labelStyle}>口コミ本文</label>
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="例: 接客は丁寧でしたが、待ち時間が少し長く感じました。"
            style={{
              ...inputStyle,
              minHeight: "240px",
              resize: "vertical",
            }}
          />
          <div style={{ marginTop: "18px", display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={handleGenerate} disabled={isSubmitting} style={primaryButtonStyle(isSubmitting)}>
              {isSubmitting ? "生成中..." : "返信案を生成する"}
            </button>
            {statusMessage ? (
              <span style={{ fontSize: "13px", color: "#666666" }}>{statusMessage}</span>
            ) : null}
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>返信案プレビュー</h2>
          <div
            style={{
              marginTop: "16px",
              minHeight: "240px",
              borderRadius: "18px",
              backgroundColor: "#faf7f1",
              padding: "20px",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: 1.9,
              color: "#333333",
            }}
          >
            {generatedReply || "右側に生成結果が表示されます。"}
          </div>
        </section>
      </div>
    </UserShell>
  );
}

const panelStyle = {
  padding: "28px",
  border: "1px solid #ddd8ce",
  borderRadius: "24px",
  backgroundColor: "white",
} as const;

const labelStyle = {
  display: "block",
  fontSize: "11px",
  letterSpacing: "0.15em",
  color: "#0a0a0a",
  marginBottom: "8px",
  fontWeight: 700,
} as const;

const sectionTitleStyle = {
  margin: 0,
  fontFamily: "Noto Serif JP, serif",
  fontSize: "22px",
  color: "#0a0a0a",
} as const;

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  border: "1px solid #cccccc",
  borderRadius: "14px",
  backgroundColor: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const,
  color: "#0a0a0a",
} as const;

const primaryButtonStyle = (disabled: boolean) =>
  ({
    padding: "14px 24px",
    backgroundColor: disabled ? "#cccccc" : "#0a0a0a",
    color: "#f5f0e8",
    border: "none",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  }) as const;
