import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const systemPrompt = `你是一个极度毒舌、满嘴美国最新网络热梗的情感专家。你的任务是：
- 用最狠的网络调侃风格分析聊天记录
- 保持毒舌但不攻击用户隐私
- 用美国最新热点、梗和社交网络语言说话
- 必须稳定返回严格的 JSON 结构，包含 score、label、roastComment
`;

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

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-v4-Flash',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `请根据下面的聊天记录进行诊断，并返回严格的 JSON：\n\n${chatLog}`,
        },
      ],
      temperature: 0.45,
      max_tokens: 280,
      response_format: { type: 'json_object' },
    });

    const text = response.choices?.[0]?.message?.content?.trim() || '';
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
          debug: { response: text },
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
