"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserShell } from "@/components/dashboard/UserShell";

const PlacesSearch = dynamic(
  () => import("@/components/PlacesSearch").then((module) => module.PlacesSearch),
  { ssr: false },
);

type BusinessType = "" | "hair" | "nail" | "esthetic" | "other";

type ProfileDraft = {
  salonName: string;
  businessType: BusinessType;
  placeId: string;
  reviewUrl: string;
  otherUrls: string[];
};

type UserProfileRow = {
  id?: string;
  email?: string;
  salon_name?: string | null;
  business_type?: string | null;
  google_review_url?: string | null;
  other_review_url_1?: string | null;
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
    return {
      salonName: "",
      businessType: "",
      placeId: "",
      reviewUrl: "",
      otherUrls: [""],
    };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      salonName: "",
      businessType: "",
      placeId: "",
      reviewUrl: "",
      otherUrls: [""],
    };
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

async function findProfileRow(
  supabase: ReturnType<typeof createClientComponentClient>,
  userId: string,
  email?: string,
) {
  const { data: profileById, error: profileByIdError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle<UserProfileRow>();

  if (profileByIdError) {
    return { data: null, error: profileByIdError, source: "id" as const };
  }

  if (profileById) {
    return { data: profileById, error: null, source: "id" as const };
  }

  if (!email) {
    return { data: null, error: null, source: "missing" as const };
  }

  const { data: profileByEmail, error: profileByEmailError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle<UserProfileRow>();

  if (profileByEmailError) {
    return { data: null, error: profileByEmailError, source: "email" as const };
  }

  return { data: profileByEmail, error: null, source: "email" as const };
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
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const profileResult = await findProfileRow(supabase, user.id, user.email);
      if (profileResult.error) {
        console.error(
          `Profile load by ${profileResult.source} error:`,
          JSON.stringify(profileResult.error),
        );
        return;
      }

      const data = profileResult.data;
      if (!data) return;

      if (data.salon_name) setSalonName(data.salon_name);
      if (data.business_type) setBusinessType(data.business_type as BusinessType);
      if (data.google_review_url) setReviewUrl(data.google_review_url);
      if (data.other_review_url_1) setOtherUrls([data.other_review_url_1]);
    };

    void loadProfile();
  }, []);

  const addUrlField = () => {
    if (otherUrls.length < 3) {
      setOtherUrls([...otherUrls, ""]);
    }
  };

  const removeUrlField = (index: number) => {
    setOtherUrls(otherUrls.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!user.email) {
        setStatusMessage("保存に失敗しました。メールアドレスを取得できませんでした。");
        return;
      }

      const profilePayload = {
        salon_name: salonName,
        business_type: businessType || null,
        google_review_url: reviewUrl || null,
        other_review_url_1: otherUrls[0] || null,
      };

      const { data: existingById, error: existingByIdError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle<{ id: string }>();

      if (existingByIdError) {
        console.error(
          "Profile save lookup by id error:",
          JSON.stringify(existingByIdError),
        );
        setStatusMessage(
          `保存に失敗しました。[${existingByIdError.code}] ${existingByIdError.message}`,
        );
        return;
      }

      if (existingById) {
        const { error: updateByIdError } = await supabase
          .from("users")
          .update({
            ...profilePayload,
            email: user.email,
          })
          .eq("id", user.id);

        if (updateByIdError) {
          console.error(
            "Profile update by id error:",
            JSON.stringify(updateByIdError),
          );
          setStatusMessage(
            `保存に失敗しました。[${updateByIdError.code}] ${updateByIdError.message}`,
          );
          return;
        }
      } else {
        const { data: existingByEmail, error: existingByEmailError } =
          await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle<{ id: string }>();

        if (existingByEmailError) {
          console.error(
            "Profile save lookup by email error:",
            JSON.stringify(existingByEmailError),
          );
          setStatusMessage(
            `保存に失敗しました。[${existingByEmailError.code}] ${existingByEmailError.message}`,
          );
          return;
        }

        if (existingByEmail) {
          const { error: updateByEmailError } = await supabase
            .from("users")
            .update(profilePayload)
            .eq("email", user.email);

          if (updateByEmailError) {
            console.error(
              "Profile update by email error:",
              JSON.stringify(updateByEmailError),
            );
            setStatusMessage(
              `保存に失敗しました。[${updateByEmailError.code}] ${updateByEmailError.message}`,
            );
            return;
          }
        } else {
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            ...profilePayload,
          });

          if (insertError) {
            console.error("Profile insert error:", JSON.stringify(insertError));
            setStatusMessage(
              `保存に失敗しました。[${insertError.code}] ${insertError.message}`,
            );
            return;
          }
        }
      }

      const draft: ProfileDraft = {
        salonName,
        businessType,
        placeId,
        reviewUrl,
        otherUrls,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      router.push("/dashboard");
    } catch (error) {
      console.error("保存エラー詳細:", JSON.stringify(error));
      setStatusMessage("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserShell
      eyebrow="Profile"
      title="店舗情報の登録"
      description="口コミ活用に必要な店舗情報、Google口コミURL、その他の口コミサイトURLを登録します。"
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
              {(Object.keys(bizLabel) as Array<Exclude<BusinessType, "">>).map(
                (type) => (
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
                ),
              )}
            </div>
          </div>
        </section>

        <section style={panelStyle}>
          <label style={labelStyle}>Google店舗候補</label>
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
              <div style={{ fontWeight: 700, color: "#0a0a0a" }}>
                選択中のGoogle店舗
              </div>
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  color: "#444444",
                }}
              >
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
                GoogleレビューURLを確認
              </a>
            </div>
          ) : null}
        </section>

        <section style={panelStyle}>
          <label style={labelStyle}>その他の口コミURL</label>
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

        {statusMessage ? (
          <p style={{ fontSize: "13px", color: "#b64d4d" }}>{statusMessage}</p>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            style={primaryButtonStyle(saving)}
          >
            {saving ? "保存中..." : "登録"}
          </button>
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
