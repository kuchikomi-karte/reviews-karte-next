import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ユーザーメッセージをログに保存
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        sender: 'user',
        content: message
      })
      .select()

    if (messageError) {
      console.error('Supabase error:', messageError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    // 黒川聖羅の返信を生成（ダミー）
    const kurokawaResponse = `
## 黒川聖羅の所見

「${message}」

この相談に対して、以下のポイントを確認してください。

### 結論
- 現在の状況を整理し、構造的な課題を特定する必要があります。

### 根拠
- 美容サロンの経営は、口コミの質と量に直結する傾向があります。
- 顧客対応の質が、口コミに反映される可能性があります。

### 具体的なアクション
1. 過去の口コミを確認し、傾向を把握する
2. 類似のクレームに対する対応を標準化する
3. 定期的にスタッフ教育を実施する

### 今後の予測
- 口コミ対応の質が向上すれば、顧客満足度も向上する傾向があります。

---

まずは過去の口コミを分析することから始めてください。具体的なデータがあれば、より的確な所見が可能になります。
    `.trim()

    // 黒川聖羅の返信をログに保存
    const { error: responseError } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        sender: 'assistant',
        content: kurokawaResponse
      })

    if (responseError) {
      console.error('Supabase error:', responseError)
    }

    return NextResponse.json({ response: kurokawaResponse })
  } catch (error) {
    console.error('Consultation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
