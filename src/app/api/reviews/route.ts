import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function buildReviewResponse(review: string) {
  return `
${review.split("\n").map((line: string) => `${line}`).join("\n")}

---

### 返信案

このたびはご来店とご意見をありがとうございます。
いただいた内容をスタッフ間で共有し、次回の体験改善につなげます。
またのご来店をお待ちしております。
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { review, userId } = await req.json();

    if (!review || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = buildReviewResponse(review);

    if (supabase) {
      const { error: reviewError } = await supabase.from("reviews").insert({
        user_id: userId,
        platform: "google",
        review_text: review,
        response_generated: response,
      });

      if (reviewError) {
        console.error("Supabase error:", reviewError);
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
