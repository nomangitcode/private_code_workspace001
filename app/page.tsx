'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type RoastResult = {
  score: number;
  label: string;
  roastComment: string;
};

export default function HomePage() {
  const [chatLog, setChatLog] = useState('');
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gradientCard = useMemo(
    () =>
      result
        ? 'animate-fade-in border-pink-400/40 bg-[#12011d]/80 shadow-[0_0_40px_rgba(255,0,201,0.28)]'
        : '',
    [result]
  );

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setChatLog(text);
  };

  const handleSubmit = async () => {
    if (!chatLog.trim()) {
      setError('请先粘贴或上传聊天记录。');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatLog }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || '诊断失败，请重试。');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('网络异常，请检查连接。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08020f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-pink-500/20 bg-gradient-to-br from-[#1a0524] via-[#130118] to-[#09040d] p-6 shadow-[0_0_80px_rgba(255,0,191,0.18)] backdrop-blur-xl">
          <div className="mb-8 space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-pink-400/70">AI 聊天记录毒舌判官</p>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              你的聊天记录，我来毒舌点评。
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
              粘贴一段聊天记录，AI 会用最嘲讽的美式网络热梗，输出舔狗指数、趣味人格标签和 150 字毒舌分析。
            </p>
          </div>

          <section className="space-y-6">
            <div className="rounded-3xl border border-fuchsia-500/20 bg-[#130116]/90 p-4 shadow-[0_0_40px_rgba(255,7,161,0.12)]">
              <label className="mb-3 block text-sm font-medium text-pink-200">聊天记录输入</label>
              <textarea
                value={chatLog}
                onChange={(event) => setChatLog(event.target.value)}
                placeholder="粘贴你的聊天记录，或上传 .txt 文件..."
                className="h-40 w-full resize-none rounded-3xl border border-pink-500/40 bg-[#0a0814] px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="cursor-pointer rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-3 text-sm text-pink-200 transition hover:bg-pink-500/20">
                  上传聊天记录
                  <input
                    type="file"
                    accept="text/plain"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="text-xs text-slate-500">支持 .txt 文本文件，自动读取内容。</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(238,77,255,0.24)] transition hover:shadow-[0_20px_60px_rgba(255,0,221,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? '诊断中…' : '开始诊断'}
            </button>

            {error ? (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className={`rounded-[2rem] border border-pink-400/20 p-6 ${gradientCard}`}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-pink-300/80">毒舌诊断结果</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">AI 直击你的聊天底线</h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-pink-100 ring-1 ring-white/10">
                    Score {result.score}/100
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/5 bg-white/5 p-4 text-sm text-slate-100 shadow-[inset_0_0_40px_rgba(255,255,255,0.04)]">
                    <p className="text-xs uppercase tracking-[0.26em] text-pink-200/80">标签</p>
                    <p className="mt-2 text-lg font-semibold text-white">{result.label}</p>
                  </div>

                  <div className="rounded-3xl border border-fuchsia-500/20 bg-[#14041a]/90 p-5 text-sm leading-7 text-slate-200">
                    <p className="text-xs uppercase tracking-[0.24em] text-pink-300/70">毒舌分析</p>
                    <p className="mt-3 whitespace-pre-line">{result.roastComment}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="mt-6 inline-flex rounded-full border border-pink-500/50 bg-white/5 px-5 py-3 text-sm text-pink-100 transition hover:bg-pink-500/10"
                >
                  重新测试
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
