"use client";

import { useState } from "react";
import Link from "next/link";
import { UserShell } from "@/components/dashboard/UserShell";

type BusinessType = "" | "hair" | "nail" | "esthetic" | "other";
type SearchPlace = {
  name: string;
  formattedAddress: string;
};
type ProfileDraft = {
  salonName: string;
  businessType: BusinessType;
  googleAddress: string;
  otherUrls: string[];
};

const STORAGE_KEY = "reviews-karte-profile-draft";

const bizLabel: Record<Exclude<BusinessType, "">, string> = {
  hair: "ヘアサロン",
  nail: "ネイルサロン",
  esthetic: "エステサロン",
  other: "その他",
};

const mockPlaces: SearchPlace[] = [
  { name: "Luna Beauty Clinic", formattedAddress: "東京都港区南青山 1-2-3" },
  { name: "Atelier MUSE", formattedAddress: "東京都渋谷区神宮前 4-5-6" },
  { name: "Noble Smile Dental", formattedAddress: "東京都中央区銀座 7-8-9" },
];

function getStoredDraft(): ProfileDraft {
  if (typeof window === "undefined") {
    return {
      salonName: "",
      businessType: "",
      googleAddress: "",
      otherUrls: [""],
    };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      salonName: "",
      businessType: "",
      googleAddress: "",
      otherUrls: [""],
    };
  }

  const draft = JSON.parse(stored) as Partial<ProfileDraft>;

  return {
    salonName: draft.salonName ?? "",
    businessType: (draft.businessType as BusinessType) ?? "",
    googleAddress: draft.googleAddress ?? "",
    otherUrls: draft.otherUrls?.length ? draft.otherUrls : [""],
  };
}

export default function ProfilePage() {
  const initialDraft = getStoredDraft();
  const [salonName, setSalonName] = useState(initialDraft.salonName);
  const [businessType, setBusinessType] = useState<BusinessType>(
    initialDraft.businessType,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SearchPlace | null>(
    initialDraft.googleAddress
      ? {
          name: initialDraft.salonName,
          formattedAddress: initialDraft.googleAddress,
        }
      : null,
  );
  const [otherUrls, setOtherUrls] = useState(initialDraft.otherUrls);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSearch = () => {
    setIsSearching(true);
    setStatusMessage("");

    window.setTimeout(() => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const filteredPlaces = mockPlaces.filter((place) =>
        place.name.toLowerCase().includes(normalizedQuery),
      );
      setSearchResults(filteredPlaces);
      setIsSearching(false);
    }, 350);
  };

  const handleSelectPlace = (place: SearchPlace) => {
    setSelectedPlace(place);
    setSalonName(place.name);
    setSearchResults([]);
    setStatusMessage("Google店舗候補を選択しました。");
  };

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
      googleAddress: selectedPlace?.formattedAddress ?? "",
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
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="店舗名または地名を入力"
              style={{ ...inputStyle, flex: 1, minWidth: "240px" }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={primaryButtonStyle(isSearching)}
            >
              {isSearching ? "検索中..." : "検索"}
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#888888" }}>
            現在は候補確認用のローカル検索です。候補を選ぶと店舗情報に反映されます。
          </p>

          {searchResults.length > 0 ? (
            <div style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
              {searchResults.map((place) => (
                <button
                  key={place.name}
                  onClick={() => handleSelectPlace(place)}
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    border: "1px solid #e5dfd4",
                    borderRadius: "16px",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0a0a0a" }}>{place.name}</div>
                  <div style={{ marginTop: "4px", fontSize: "12px", color: "#666666" }}>
                    {place.formattedAddress}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {selectedPlace ? (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                borderRadius: "18px",
                backgroundColor: "#f8f4ec",
              }}
            >
              <div style={{ fontWeight: 700, color: "#0a0a0a" }}>選択中のGoogle店舗</div>
              <div style={{ marginTop: "6px", fontSize: "13px", color: "#666666" }}>
                {selectedPlace.formattedAddress}
              </div>
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
