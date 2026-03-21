"use client";

import type { ReactNode } from "react";
import { startTransition } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { USER_LOGIN_PATH, hasUserAuthConfig } from "@/lib/auth/user";

type DashboardHeaderProps = {
  onLogout: () => void;
};

type UserShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header
      style={{
        backgroundColor: "#0a0a0a",
        padding: "0 48px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "#888888",
            fontFamily: "Noto Sans JP, sans-serif",
          }}
        >
          ai×me lab
        </span>
        <span
          style={{
            fontSize: "16px",
            letterSpacing: "0.15em",
            color: "#f5f0e8",
            fontFamily: "Noto Serif JP, serif",
            fontWeight: 400,
          }}
        >
          口コミ経営カルテ
        </span>
      </div>
      <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Link
          href="/dashboard/profile"
          style={{
            fontSize: "12px",
            letterSpacing: "0.1em",
            color: "#cccccc",
            textDecoration: "none",
            fontFamily: "Noto Sans JP, sans-serif",
          }}
        >
          プロフィール設定
        </Link>
        <Link
          href="/dashboard"
          style={{
            fontSize: "12px",
            letterSpacing: "0.1em",
            color: "#cccccc",
            textDecoration: "none",
            fontFamily: "Noto Sans JP, sans-serif",
          }}
        >
          口コミ経営カルテ
        </Link>
        <button
          onClick={onLogout}
          style={{
            fontSize: "12px",
            color: "#888888",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "Noto Sans JP, sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          ログアウト
        </button>
      </nav>
    </header>
  );
}

export function UserShell({
  eyebrow,
  title,
  description,
  children,
}: UserShellProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (hasUserAuthConfig()) {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
    }

    startTransition(() => {
      router.push(USER_LOGIN_PATH);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f0e8",
        fontFamily: "Noto Sans JP, sans-serif",
      }}
    >
      <DashboardHeader onLogout={handleLogout} />
      <main style={{ padding: "40px 24px 72px" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div
            style={{
              marginBottom: "28px",
              padding: "32px",
              backgroundColor: "white",
              border: "1px solid #ddd8ce",
              borderRadius: "28px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#888888",
              }}
            >
              {eyebrow}
            </p>
            <h1
              style={{
                margin: "14px 0 12px",
                fontFamily: "Noto Serif JP, serif",
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#0a0a0a",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: "720px",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "#666666",
              }}
            >
              {description}
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

