import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const assistant = searchParams.get("assistant");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch("/.netlify/functions/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, assistant }),
    });

    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.response || "No response" },
    ]);

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Chateando con {assistant === "zenbot" ? "ZenBot 🧘‍♂️" : "SadBot 😢"}
      </h1>
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 ${
              msg.role === "user" ? "text-right" : "text-left text-gray-600"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
