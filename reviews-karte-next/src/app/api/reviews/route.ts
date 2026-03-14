import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { review, userId } = await req.json()

    if (!review || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 黒川聖羅の返信案を生成
    const response = `
${review.split('\n').map((line: string) => `${line}`).join('\n')}

---

### 黒川聖羅の返信案

${review.split('\n').slice(0, 2).join('\n')}

お客様、ご投稿いただきありがとうございます。

貴重なご意見を拝見し、当店のサービス向上に活かさせていただきます。

ご不便をおかけした点につきましては、誠に申し訳ございません。

今後とも、より良いサービスをご提供できるよう努めてまいりますので、
またのご来店を心よりお待ち申し上げております。

---

### ポイント
- 事実と感謝を伝える
- 具体的な改善策を示す
- 第三者へのアピールを意識する
    `.trim()

    // 返信案をログに保存
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        platform: 'google',
        review_text: review,
        response_generated: response
      })

    if (reviewError) {
      console.error('Supabase error:', reviewError)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
