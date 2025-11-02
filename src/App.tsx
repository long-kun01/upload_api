import React, { useCallback, useMemo, useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = useMemo(() => {
    return import.meta.env.VITE_API_URL as string | undefined;
  }, []);

  const handleAsk = useCallback(async () => {
    const q = question.trim();
    if (!q) return;
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      let resultText: string;
      if (apiUrl) {
        const res = await fetch(apiUrl.replace(/\/$/, "") + "/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });
        if (!res.ok) {
          throw new Error(`请求失败: ${res.status}`);
        }
        const data = await res.json();
        resultText = (data && (data.answer || data.result || data.text)) ?? "";
        if (!resultText) {
          resultText = "没有从服务端获取到答案。";
        }
      } else {
        // 本地模拟：无后端时返回占位答案
        await new Promise((r) => setTimeout(r, 600));
        resultText = `这是一个示例回答：你问的是“${q}”。配置 VITE_API_URL 后将调用真实服务端。`;
      }
      setAnswer(resultText);
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : String(e);
      setError(m || "请求出错，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, question]);

  const handleKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === "Enter" && !isLoading) {
        handleAsk();
      }
    },
    [handleAsk, isLoading]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 flex flex-col items-center justify-center text-center px-6">
      {/* 机器人 Logo */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">🤖</span>
        </div>
      </div>

      {/* 标题 */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
        生财有术 | <span className="text-blue-500">AI问答助手</span>
      </h1>
      <p className="text-gray-500 mb-8 text-sm sm:text-base">
        基于社区 10 万+ 优质内容，为您提供专业的商业洞察和实战经验
      </p>

      {/* 搜索框 */}
      <div className="w-full max-w-lg flex bg-white shadow-lg rounded-full overflow-hidden border border-gray-200">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题，探索商业智慧..."
          className="flex-1 px-6 py-3 text-gray-700 focus:outline-none"
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || isLoading}
          className="bg-gradient-to-r from-blue-400 to-teal-400 text-white font-semibold px-6 py-3 hover:from-blue-500 hover:to-teal-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "思考中…" : "提问"}
        </button>
      </div>

      {/* Answer / Error */}
      <div className="w-full max-w-2xl mt-8 text-left">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}
        {answer ? (
          <div className="rounded-xl border border-gray-200 bg-white/80 px-5 py-4 shadow">
            <div className="text-sm text-gray-500 mb-2">AI 回答</div>
            <div className="whitespace-pre-wrap leading-7 text-gray-800">{answer}</div>
          </div>
        ) : null}
      </div>

      {/* 页脚 */}
      <footer className="mt-12 text-gray-400 text-xs">
        © 2025 生财有术 | AI问答助手
      </footer>
    </div>
  );
}
