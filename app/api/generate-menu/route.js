import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const body = await req.json();
  const { goal, level, height, weight, selectedDays, duration, equipment } = body;

  try {
    // 環境変数のチェック
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('GEMINI_API_KEYが設定されていません');
      return new Response(JSON.stringify({ 
        error: "Gemini APIキーが設定されていません。.env.localファイルにGEMINI_API_KEYを追加してください。APIキーは https://aistudio.google.com/app/apikey から取得できます。" 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
      あなたは優秀なパーソナルトレーナーです。
      以下の条件に基づいて、選択された曜日ごとに異なるトレーニングメニューを提案してください。

      【基本情報】
      - 目標: ${goal}
      - レベル: ${level}
      ${height ? `- 身長: ${height}cm` : ''}
      ${weight ? `- 体重: ${weight}kg` : ''}
      - トレーニング曜日: ${selectedDays.join(', ')}
      - 1回のトレーニング時間: ${duration}分
      ${equipment ? `- 利用可能な器具: ${equipment}` : ''}

      【要求事項】
      - 各曜日に異なるトレーニングタイプを割り当て（上半身、下半身、全身、有酸素など）
      - 各曜日の種目数は4-6つ
      - 各種目のセット数とレップ数（回数）も具体的に指定
      - 目標とレベルに応じた適切な重量設定のアドバイスも含める
      - トレーニングの順序も考慮（大きな筋肉から小さな筋肉へ）
      - セット間の休憩時間の目安も記載
      - totalTimeは数字のみで記載（例: "60"）
      - weeklyTipsは各項目を1-2行以内の短い文章で、1.タイトル 2.ポイント の形式で記載する。

      【回答形式】
      必ず有効なJSON形式で、以下のような構造で回答してください。マークダウンのコードブロックは使用せず、純粋なJSONのみを返してください。
      重要な注意事項：
      - JSONの開始は { で、終了は } でなければなりません
      - すべての文字列は二重引用符で囲んでください
      - 最後の要素の後にカンマを付けないでください
      - 完全なJSONを返してください（途中で切れないように）
      {
        "weeklyMenu": {
          "月": {
            "type": "上半身",
            "menu": [
              {
                "name": "種目名1",
                "sets": "3セット",
                "reps": "10回",
                "weight": "重量の目安",
                "rest": "セット間休憩時間"
              }
            ],
            "tips": "この日のトレーニングのポイント",
            "totalTime": "60"
          },
          "火": {
            "type": "下半身",
            "menu": [
              {
                "name": "種目名1",
                "sets": "3セット",
                "reps": "12回",
                "weight": "重量の目安",
                "rest": "セット間休憩時間"
              }
            ],
            "tips": "この日のトレーニングのポイント",
            "totalTime": "60"
          }
        },
        "weeklyTips": "週間全体のトレーニングのポイントや注意事項"
      }
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.3, // より一貫したレスポンスのため温度を下げる
        maxOutputTokens: 4096, // より長いレスポンスを許可
        topP: 0.8,
        topK: 40,
      },
    });

    console.log('Gemini APIにリクエストを送信中...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response) {
      throw new Error('Gemini APIからのレスポンスが空です');
    }
    
    let text = response.text();
    console.log('Gemini APIからのレスポンス:', text.substring(0, 200) + '...');

    // レスポンスが空でないことを確認
    if (!text || text.trim().length === 0) {
      throw new Error('Gemini APIからのレスポンスが空です');
    }

    // JSONの抽出（マークダウンブロックがある場合）
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      text = jsonMatch[1].trim();
    } else {
      // マークダウンブロックがない場合、テキスト全体をJSONとして扱う
      text = text.trim();
    }

    // JSONの解析を試行
    try {
      // 空の文字列チェック
      if (!text || text.length === 0) {
        throw new Error('解析対象のテキストが空です');
      }

      // JSONの開始と終了を確認
      if (!text.startsWith('{') || !text.endsWith('}')) {
        console.warn('JSONの形式が正しくない可能性があります。テキスト:', text.substring(0, 100));
        // 不完全なJSONの場合、可能な限り修復を試行
        if (text.includes('{') && !text.endsWith('}')) {
          // 最後の } を探して追加
          const lastBraceIndex = text.lastIndexOf('}');
          if (lastBraceIndex > 0) {
            text = text.substring(0, lastBraceIndex + 1);
          } else {
            text = text + '}';
          }
        }
      }

      const parsedJson = JSON.parse(text);
      
      // レスポンスの構造を検証
      if (!parsedJson.weeklyMenu || typeof parsedJson.weeklyMenu !== 'object') {
        throw new Error('レスポンスにweeklyMenuが含まれていません');
      }

      return new Response(JSON.stringify(parsedJson), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError);
      console.error('レスポンステキスト:', text);
      console.error('テキストの長さ:', text.length);
      
      // より詳細なエラー情報を提供
      let errorMessage = "AIからのレスポンスが適切なJSON形式ではありませんでした。";
      if (parseError.message.includes('Unexpected end of JSON input')) {
        errorMessage = "AIからのレスポンスが途中で切れています。もう一度お試しください。";
      } else if (parseError.message.includes('Unexpected token')) {
        errorMessage = "AIからのレスポンスに無効な文字が含まれています。";
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: parseError.message,
        rawResponse: text.substring(0, 500) // 最初の500文字のみ表示
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('メニュー生成エラー:', error);
    
    // エラーの種類に応じて詳細なメッセージを返す
    let errorMessage = "メニューの生成に失敗しました。";
    
    if (error.message?.includes('API key')) {
      errorMessage = "Gemini APIキーが無効です。正しいAPIキーを設定してください。";
    } else if (error.message?.includes('quota')) {
      errorMessage = "APIの利用制限に達しました。しばらく待ってから再試行してください。";
    } else if (error.message?.includes('permission')) {
      errorMessage = "APIキーに必要な権限がありません。";
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = "ネットワークエラーが発生しました。インターネット接続を確認してください。";
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}