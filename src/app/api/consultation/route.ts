import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function buildConsultationResponse(message: string) {
  return `
## 相談メモ

${message}

### 整理ポイント
- 現在の状況を一度棚卸しし、改善対象を 3 つ以内に絞る
- 口コミ返信と店舗情報の整合を先に揃える
- 来店導線と再来導線を分けて確認する
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (supabase) {
      const { error: messageError } = await supabase.from("messages").insert({
        user_id: userId,
        sender: "user",
        content: message,
      });

      if (messageError) {
        console.error("Supabase error:", messageError);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
      }
    }

    const response = buildConsultationResponse(message);

    if (supabase) {
      const { error: responseError } = await supabase.from("messages").insert({
        user_id: userId,
        sender: "assistant",
        content: response,
      });

      if (responseError) {
        console.error("Supabase error:", responseError);
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Consultation API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
