"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserShell } from "@/components/dashboard/UserShell";

function buildFallbackConsultation(message: string) {
  return `ご相談内容を確認しました。\n\n${message}\n\nまずは店舗情報と最新の口コミ状況を整理し、優先順位を 3 つに絞って対応するのがおすすめです。`;
}

export default function ConsultationPage() {
  const [message, setMessage] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) {
      setStatusMessage("相談内容を入力してください。");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          userId: user?.id ?? "demo-user",
        }),
      });

      if (!response.ok) {
        throw new Error("fallback");
      }

      const data = (await response.json()) as { response?: string };
      setResponseText(data.response ?? buildFallbackConsultation(message));
      setStatusMessage("相談内容を送信しました。");
    } catch {
      setResponseText(buildFallbackConsultation(message));
      setStatusMessage("ローカル応答モードで内容を表示しています。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserShell
      eyebrow="Consultation"
      title="経営相談"
      description="店舗運営や口コミ対応の相談内容を整理し、初期回答を確認するページです。返信導線と同じく、実際に入力できる形へ戻しています。"
    >
      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1.05fr 0.95fr" }}>
        <section style={panelStyle}>
          <label style={labelStyle}>相談内容</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="例: 最近口コミ件数が減っており、再来店率も下がっています。どこから見直すべきでしょうか。"
            style={{
              ...inputStyle,
              minHeight: "240px",
              resize: "vertical",
            }}
          />
          <div style={{ marginTop: "18px", display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={handleSubmit} disabled={isSubmitting} style={primaryButtonStyle(isSubmitting)}>
              {isSubmitting ? "送信中..." : "相談内容を送信する"}
            </button>
            {statusMessage ? (
              <span style={{ fontSize: "13px", color: "#666666" }}>{statusMessage}</span>
            ) : null}
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>回答メモ</h2>
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
            {responseText || "送信した相談内容に対する整理メモが表示されます。"}
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
