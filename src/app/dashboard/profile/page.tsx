"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UserShell } from "@/components/dashboard/UserShell";

const PlacesSearch = dynamic(
  () => import("@/components/PlacesSearch").then((m) => m.PlacesSearch),
  { ssr: false }
);

type BusinessType = "" | "hair" | "nail" | "esthetic" | "other";
type ProfileDraft = {
  salonName: string;
  businessType: BusinessType;
  placeId: string;
  reviewUrl: string;
  otherUrls: string[];
};

const STORAGE_KEY = "reviews-karte-profile-draft";

const bizLabel: Record<Exclude<BusinessType, "">, string> = {
  hair: "ヘアサロン",
  nail: "ネイルサロン",
  esthetic: "エステサロン",
  other: "その他",
};

function getStoredDraft(): ProfileDraft {
  if (typeof window === "undefined") {
    return { salonName: "", businessType: "", placeId: "", reviewUrl: "", otherUrls: [""] };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return { salonName: "", businessType: "", placeId: "", reviewUrl: "", otherUrls: [""] };
  }

  const draft = JSON.parse(stored) as Partial<ProfileDraft>;

  return {
    salonName: draft.salonName ?? "",
    businessType: (draft.businessType as BusinessType) ?? "",
    placeId: draft.placeId ?? "",
    reviewUrl: draft.reviewUrl ?? "",
    otherUrls: draft.otherUrls?.length ? draft.otherUrls : [""],
  };
}

export default function ProfilePage() {
  const initialDraft = getStoredDraft();
  const [salonName, setSalonName] = useState(initialDraft.salonName);
  const [businessType, setBusinessType] = useState<BusinessType>(
    initialDraft.businessType,
  );
  const [placeId, setPlaceId] = useState(initialDraft.placeId);
  const [reviewUrl, setReviewUrl] = useState(initialDraft.reviewUrl);
  const [otherUrls, setOtherUrls] = useState(initialDraft.otherUrls);
  const [statusMessage, setStatusMessage] = useState("");

  const addUrlField = () => {
    if (otherUrls.length < 3) {
      setOtherUrls([...otherUrls, ""]);
    }
  };

  const removeUrlField = (index: number) => {
    setOtherUrls(otherUrls.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSave = () => {
    const draft: ProfileDraft = {
      salonName,
      businessType,
      placeId,
      reviewUrl,
      otherUrls,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setStatusMessage("入力内容をこのブラウザに保存しました。");
  };

  return (
    <UserShell
      eyebrow="Profile"
      title="店舗情報の登録"
      description="口コミ運用に必要な店舗情報、Google 店舗候補、その他口コミサイト URL を整理するページです。既存の登録フォーム構成を維持しつつ、保存導線を戻しています。"
    >
      <div style={{ display: "grid", gap: "24px" }}>
        <section style={panelStyle}>
          <label style={labelStyle}>店舗名</label>
          <input
            type="text"
            value={salonName}
            onChange={(event) => setSalonName(event.target.value)}
            placeholder="例: Luna Beauty Clinic"
            style={inputStyle}
          />

          <div style={{ marginTop: "24px" }}>
            <label style={labelStyle}>業種</label>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {(Object.keys(bizLabel) as Array<Exclude<BusinessType, "">>).map((type) => (
                <label key={type} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="businessType"
                    checked={businessType === type}
                    onChange={() => setBusinessType(type)}
                    style={{ marginRight: "8px" }}
                  />
                  {bizLabel[type]}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section style={panelStyle}>
          <label style={labelStyle}>Google店舗検索</label>
          <PlacesSearch
            onSelect={(data) => {
              setSalonName(data.salonName);
              setPlaceId(data.placeId);
              setReviewUrl(data.reviewUrl);
              setStatusMessage("Google店舗候補を選択しました。");
            }}
          />

          {placeId ? (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                borderRadius: "18px",
                backgroundColor: "#f8f4ec",
              }}
            >
              <div style={{ fontWeight: 700, color: "#0a0a0a" }}>選択中のGoogle店舗</div>
              <div style={{ marginTop: "6px", fontSize: "13px", color: "#444444" }}>
                {salonName}
              </div>
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#0070f3",
                }}
              >
                口コミページを確認 →
              </a>
            </div>
          ) : null}
        </section>

        <section style={panelStyle}>
          <label style={labelStyle}>その他の口コミサイトURL</label>
          <div style={{ display: "grid", gap: "12px" }}>
            {otherUrls.map((url, index) => (
              <div key={`${index}-${url}`} style={{ display: "flex", gap: "10px" }}>
                <input
                  type="url"
                  value={url}
                  onChange={(event) => {
                    const nextUrls = [...otherUrls];
                    nextUrls[index] = event.target.value;
                    setOtherUrls(nextUrls);
                  }}
                  placeholder="https://..."
                  style={{ ...inputStyle, flex: 1 }}
                />
                {otherUrls.length > 1 ? (
                  <button
                    onClick={() => removeUrlField(index)}
                    style={{
                      padding: "0 16px",
                      border: "1px solid #f0c5c5",
                      backgroundColor: "#fff5f5",
                      borderRadius: "14px",
                      color: "#b64d4d",
                      cursor: "pointer",
                    }}
                  >
                    削除
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {otherUrls.length < 3 ? (
            <button
              onClick={addUrlField}
              style={{ ...secondaryButtonStyle, marginTop: "16px" }}
            >
              URLを追加
            </button>
          ) : null}
        </section>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={handleSave} style={primaryButtonStyle(false)}>
            保存する
          </button>
          <Link href="/dashboard" style={secondaryLinkStyle}>
            ダッシュボードへ戻る
          </Link>
          {statusMessage ? (
            <span style={{ fontSize: "13px", color: "#666666" }}>{statusMessage}</span>
          ) : null}
        </div>
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

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  fontSize: "13px",
  color: "#0a0a0a",
  cursor: "pointer",
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

const secondaryButtonStyle = {
  padding: "14px 24px",
  backgroundColor: "white",
  border: "1px solid #cccccc",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
  color: "#0a0a0a",
} as const;

const secondaryLinkStyle = {
  display: "inline-block",
  padding: "14px 24px",
  backgroundColor: "white",
  border: "1px solid #cccccc",
  borderRadius: "999px",
  textDecoration: "none",
  color: "#0a0a0a",
  fontSize: "13px",
  fontWeight: 700,
} as const;
