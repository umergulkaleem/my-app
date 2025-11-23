"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // THIS IS THE CORRECT ENDPOINT FOR YOUR SPACE
      const response = await fetch(
        "https://umergul-payflowai.hf.space/gradio_api/run/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [input],
            fn_index: 0, // This works perfectly for your Space
          }),
        }
      );

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const result = await response.json();
      const answer = result.data?.[0] ?? "No response";

      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Warning: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="border rounded-2xl shadow-lg overflow-hidden bg-white">
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 && (
            <div className="text-center text-gray-600 mt-16">
              <h2 className="text-3xl font-bold mb-2">PayFlowAI</h2>
              <p className="text-lg">Your custom AI is live and ready!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-5 py-3 rounded-2xl border border-gray-200">
                <span className="animate-pulse">PayFlowAI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="border-t text-black bg-gray p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask PayFlowAI anything..."
              disabled={loading}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3">
            Powered by your live PayFlowAI Space
          </p>
        </div>
      </div>
    </section>
  );
};

export default Chat;
