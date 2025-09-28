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
- 各曜日の種目数は3-4つ（簡潔に）
- 各種目のセット数とレップ数を簡潔に指定
- 重量設定は簡潔なアドバイスのみ
- セット間の休憩時間も簡潔に記載
- totalTimeは数字のみで記載（例: "60"）

【重要】回答は必ず以下の形式の完全なJSONのみを返してください。他のテキストは一切含めないでください。

{
  "weeklyMenu": {
    "月": {
      "type": "上半身",
      "menu": [
        {
          "name": "ベンチプレス",
          "sets": "3セット",
          "reps": "10回",
          "weight": "適切な重量",
          "rest": "60秒"
        }
      ],
      "tips": "上半身の基本トレーニング",
      "totalTime": "60"
    }
  }
}
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 4096, // トークン数を増やして完全なレスポンスを保証
        topP: 0.7,
        topK: 20,
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
      if (!text.startsWith('{')) {
        throw new Error('JSONが正しい形式で開始されていません');
      }

      // 不完全なJSONの場合、可能な限り修復を試行
      if (!text.endsWith('}')) {
        console.warn('JSONが不完全です。修復を試行します。');
        
        // より高度な修復ロジック
        let braceCount = 0;
        let lastValidPosition = -1;
        
        for (let i = 0; i < text.length; i++) {
          if (text[i] === '{') {
            braceCount++;
          } else if (text[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              lastValidPosition = i;
            }
          }
        }
        
        if (lastValidPosition > 0) {
          text = text.substring(0, lastValidPosition + 1);
          console.log('JSONを修復しました。長さ:', text.length);
        } else {
          throw new Error('JSONが不完全で修復できません');
        }
      }

      const parsedJson = JSON.parse(text);
      
      // レスポンスの構造を検証
      if (!parsedJson.weeklyMenu || typeof parsedJson.weeklyMenu !== 'object') {
        throw new Error('レスポンスにweeklyMenuが含まれていません');
      }

      console.log('JSON解析成功');
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