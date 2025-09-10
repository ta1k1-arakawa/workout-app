import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const body = await req.json();
  const { goal, level, height, weight, frequency, duration, equipment } = body;

  try {
    const prompt = `
      あなたは優秀なパーソナルトレーナーです。
      以下の条件に基づいて、ジムでのトレーニングメニューを1回分だけ提案してください。

      【基本情報】
      - 目標: ${goal}
      - レベル: ${level}
      ${height ? `- 身長: ${height}cm` : ''}
      ${weight ? `- 体重: ${weight}kg` : ''}
      - 週のトレーニング頻度: ${frequency}回
      - 1回のトレーニング時間: ${duration}分
      ${equipment ? `- 利用可能な器具: ${equipment}` : ''}

      【要求事項】
      - 種目数は5つ
      - 各種目のセット数とレップ数（回数）も具体的に指定
      - 目標とレベルに応じた適切な重量設定のアドバイスも含める
      - トレーニングの順序も考慮（大きな筋肉から小さな筋肉へ）
      - セット間の休憩時間の目安も記載

      【回答形式】
      必ずJSON形式で、以下のような構造で回答してください:
      {
        "menu": [
          {
            "name": "種目名1",
            "sets": "3セット",
            "reps": "10回",
            "weight": "重量の目安",
            "rest": "セット間休憩時間"
          },
          {
            "name": "種目名2",
            "sets": "3セット",
            "reps": "12回",
            "weight": "重量の目安",
            "rest": "セット間休憩時間"
          }
        ],
        "tips": "トレーニングのポイントや注意事項",
        "totalTime": "予想総時間（分）"
      }
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // JSONの抽出
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      text = jsonMatch[1];
    }

    return new Response(text, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "メニューの生成に失敗しました。" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}