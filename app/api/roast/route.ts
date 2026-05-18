import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const systemPrompt = `你是一个极度毒舌、满嘴美国最新网络热梗的情感专家。你的任务是：
- 用最狠的网络调侃风格分析聊天记录
- 保持毒舌但不攻击用户隐私
- 用美国最新热点、梗和社交网络语言说话
- 必须稳定返回严格的 JSON 结构，包含 score、label、roastComment
`;

const schema = {
  type: 'object',
  properties: {
    score: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      description: '舔狗指数，0-100',
    },
    label: {
      type: 'string',
      description: '趣味人格标签',
    },
    roastComment: {
      type: 'string',
      description: '150字毒舌分析',
    },
  },
  required: ['score', 'label', 'roastComment'],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chatLog = String(body.chatLog ?? '').trim();

    if (!chatLog) {
      return NextResponse.json(
        { error: '请输入聊天记录以进行诊断。' },
        { status: 400 }
      );
    }

    const response = await genai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        systemPrompt,
        `请根据下面的聊天记录进行诊断，并返回严格的 JSON：\n\n${chatLog}`,
      ],
      config: {
        temperature: 0.45,
        maxOutputTokens: 280,
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
      },
    });

    const raw = response.candidates?.[0];
    const text = response.text?.trim() ||
      raw?.content?.parts?.map((part) => (part?.text ?? '')).join('').trim() ||
      '';
    let result: { score?: number; label?: string; roastComment?: string } | undefined;

    if (text) {
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse failed:', parseError, text);
      }
    }

    if (
      !result ||
      result.score === undefined ||
      result.score === null ||
      !result.label ||
      !result.roastComment
    ) {
      return NextResponse.json(
        {
          error: 'AI 未能返回有效结构化结果。',
          debug: { response: raw },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Roast API error:', error);
    return NextResponse.json(
      { error: '诊断服务异常，请稍后重试。' },
      { status: 500 }
    );
  }
}
