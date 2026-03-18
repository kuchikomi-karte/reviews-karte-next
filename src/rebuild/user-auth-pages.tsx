"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  getAuthFailureMessage,
  getUserAuthConfigSummary,
  hasUserAuthConfig,
  toLoggableAuthError,
} from "@/lib/auth/user";
import { getAuthCallbackUrl } from "@/lib/site-url";
import { SiteHeader } from "@/rebuild/site-header";

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  border: "1px solid #cccccc",
  backgroundColor: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "Noto Sans JP, sans-serif",
  color: "#0a0a0a",
};

const errorBannerStyle = {
  padding: "12px 16px",
  backgroundColor: "#fff5f5",
  border: "1px solid #ffdddd",
  marginBottom: "20px",
  fontSize: "12px",
  color: "#cc3333",
};

export function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const hasSupabaseConfig = hasUserAuthConfig();

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get(
      "authError",
    );

    if (authError !== "google_callback_failed") {
      return;
    }

    setError("Google ログインの完了に失敗しました。時間を置いて再度お試しください。");
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    if (!hasSupabaseConfig) {
      console.error("[user-login] Missing public Supabase config", {
        config: getUserAuthConfigSummary(),
      });
      setError("ログイン設定が不足しています。環境変数を確認してください。");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClientComponentClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("[user-login] Password login failed", {
          error: toLoggableAuthError(authError),
        });
        setError(getAuthFailureMessage("email-login", authError));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (authError) {
      console.error("[user-login] Unexpected password login error", {
        error: toLoggableAuthError(authError),
      });
      setError(getAuthFailureMessage("email-login", authError));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!hasSupabaseConfig) {
      console.error("[user-login] Missing public Supabase config", {
        config: getUserAuthConfigSummary(),
      });
      setError("Google ログイン設定が不足しています。環境変数を確認してください。");
      return;
    }

    setError("");

    try {
      const supabase = createClientComponentClient();
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl({ flow: "login" }) },
      });

      if (authError) {
        console.error("[user-login] Google login start failed", {
          error: toLoggableAuthError(authError),
        });
        setError(getAuthFailureMessage("google-login", authError));
        return;
      }

      if (!data?.url) {
        console.error("[user-login] Google login did not return a redirect URL");
        setError(getAuthFailureMessage("google-login"));
        return;
      }

      window.location.href = data.url;
    } catch (authError) {
      console.error("[user-login] Unexpected Google login error", {
        error: toLoggableAuthError(authError),
      });
      setError(getAuthFailureMessage("google-login", authError));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f0e8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Noto Sans JP, sans-serif",
      }}
    >
      <SiteHeader authLinkHref="/register" authLinkLabel="新規登録" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          {error ? (
            <div style={{ ...errorBannerStyle, letterSpacing: "0.05em" }}>
              {error}
            </div>
          ) : null}

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#0a0a0a",
              color: "#f5f0e8",
              border: "none",
              fontSize: "13px",
              letterSpacing: "0.12em",
              cursor: "pointer",
              marginBottom: "28px",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 500,
            }}
          >
            Googleアカウントでログイン
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#cccccc" }} />
            <span
              style={{
                fontSize: "10px",
                color: "#888888",
                letterSpacing: "0.15em",
              }}
            >
              または
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#cccccc" }} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "#0a0a0a",
                marginBottom: "8px",
              }}
            >
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "#0a0a0a",
                marginBottom: "8px",
              }}
            >
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleLogin();
                }
              }}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: loading ? "#cccccc" : "#c9a84c",
              color: "#0a0a0a",
              border: "none",
              fontSize: "13px",
              letterSpacing: "0.12em",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 500,
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const hasSupabaseConfig = hasUserAuthConfig();

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get(
      "authError",
    );

    if (authError !== "google_callback_failed") {
      return;
    }

    setError("Google 登録の完了に失敗しました。時間を置いて再度お試しください。");
  }, []);

  const handleRegister = async () => {
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは 6 文字以上で入力してください。");
      return;
    }

    if (!agreedToTerms) {
      setError("利用規約とプライバシーポリシーへの同意が必要です。");
      return;
    }

    if (!hasSupabaseConfig) {
      console.error("[user-register] Missing public Supabase config", {
        config: getUserAuthConfigSummary(),
      });
      setError("登録設定が不足しています。環境変数を確認してください。");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClientComponentClient();
      const { error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        console.error("[user-register] Email registration failed", {
          error: toLoggableAuthError(authError),
        });
        setError(getAuthFailureMessage("email-register", authError));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (authError) {
      console.error("[user-register] Unexpected email registration error", {
        error: toLoggableAuthError(authError),
      });
      setError(getAuthFailureMessage("email-register", authError));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!agreedToTerms) {
      setError("利用規約とプライバシーポリシーへの同意が必要です。");
      return;
    }

    if (!hasSupabaseConfig) {
      console.error("[user-register] Missing public Supabase config", {
        config: getUserAuthConfigSummary(),
      });
      setError("Google 登録設定が不足しています。環境変数を確認してください。");
      return;
    }

    setError("");

    try {
      const supabase = createClientComponentClient();
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl({ flow: "register" }) },
      });

      if (authError) {
        console.error("[user-register] Google registration start failed", {
          error: toLoggableAuthError(authError),
        });
        setError(getAuthFailureMessage("google-register", authError));
        return;
      }

      if (!data?.url) {
        console.error(
          "[user-register] Google registration did not return a redirect URL",
        );
        setError(getAuthFailureMessage("google-register"));
        return;
      }

      window.location.href = data.url;
    } catch (authError) {
      console.error("[user-register] Unexpected Google registration error", {
        error: toLoggableAuthError(authError),
      });
      setError(getAuthFailureMessage("google-register", authError));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f0e8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Noto Sans JP, sans-serif",
      }}
    >
      <SiteHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: "40px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: "#888888",
              marginBottom: "12px",
            }}
          >
            ai x me lab
          </p>
          <h1
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "22px",
              fontWeight: 400,
              letterSpacing: "0.2em",
              color: "#0a0a0a",
              margin: "0 0 12px 0",
            }}
          >
            口コミカルテ
          </h1>
          <div
            style={{
              width: "32px",
              height: "1px",
              backgroundColor: "#c9a84c",
              margin: "0 auto 12px",
            }}
          />
          <h2
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#0a0a0a",
              margin: 0,
            }}
          >
            新規登録
          </h2>
        </div>

        <div style={{ width: "100%", maxWidth: "380px" }}>
          {error ? <div style={errorBannerStyle}>{error}</div> : null}

          <div
            style={{
              border: "1px solid #d4c9b0",
              borderRadius: "6px",
              height: "140px",
              overflowY: "scroll",
              padding: "16px",
              fontSize: "12px",
              color: "#555",
              lineHeight: "1.8",
              marginBottom: "20px",
              backgroundColor: "#ffffff",
            }}
          >
            <strong>利用規約・個人情報の取り扱い</strong>
            <br />
            本サービスの利用にあたっては、利用規約およびプライバシーポリシーへの同意が必要です。
            登録前に内容をご確認ください。
            <br />
            <br />
            <a href="/terms" target="_blank" style={{ color: "#c9a84c" }}>
              利用規約を確認する
            </a>
            <br />
            <a href="/privacy" target="_blank" style={{ color: "#c9a84c" }}>
              プライバシーポリシーを確認する
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreedToTerms}
              onChange={(event) => setAgreedToTerms(event.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#c9a84c",
                marginTop: "2px",
                flexShrink: 0,
              }}
            />
            <label
              htmlFor="agreeTerms"
              style={{ fontSize: "13px", color: "#555", cursor: "pointer" }}
            >
              利用規約およびプライバシーポリシーに同意して登録します。
            </label>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#cccccc",
              marginBottom: "24px",
            }}
          />

          <button
            onClick={handleGoogleLogin}
            disabled={!agreedToTerms}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: agreedToTerms ? "#0a0a0a" : "#cccccc",
              color: "#f5f0e8",
              border: "none",
              fontSize: "13px",
              letterSpacing: "0.12em",
              cursor: agreedToTerms ? "pointer" : "not-allowed",
              marginBottom: "24px",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 500,
              opacity: agreedToTerms ? 1 : 0.5,
            }}
          >
            Googleアカウントで登録
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#cccccc" }} />
            <span
              style={{
                fontSize: "10px",
                color: "#888888",
                letterSpacing: "0.15em",
              }}
            >
              または
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#cccccc" }} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "#0a0a0a",
                marginBottom: "8px",
              }}
            >
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "#0a0a0a",
                marginBottom: "8px",
              }}
            >
              パスワード（6文字以上）
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleRegister();
                }
              }}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading || !agreedToTerms}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor:
                loading || !agreedToTerms ? "#cccccc" : "#c9a84c",
              color: "#0a0a0a",
              border: "none",
              fontSize: "13px",
              letterSpacing: "0.12em",
              cursor: loading || !agreedToTerms ? "not-allowed" : "pointer",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 500,
              opacity: loading || !agreedToTerms ? 0.5 : 1,
            }}
          >
            {loading ? "登録中..." : "新規登録"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "12px",
              color: "#888888",
            }}
          >
            すでにアカウントをお持ちの方は
            <a
              href="/login"
              style={{
                color: "#c9a84c",
                textDecoration: "none",
                marginLeft: "4px",
              }}
            >
              ログイン
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
