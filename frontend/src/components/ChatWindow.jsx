import React, { useState, useRef, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import MessageBubble from "./MessageBubble";
import { AuthContext } from "../context/AuthContext";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const { user } = useContext(AuthContext);

  // 🔹 Auto scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Fetch chat history for logged-in user
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/chat/history");

        // API returns { messages: [...] } from backend
        const history = res.data.messages || res.data || [];

        setMessages(
          history.map((msg) => ({
            sender: msg.role === "user" ? "user" : "ai",
            message: msg.content,
          }))
        );
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchHistory();
  }, []);

  // 🔹 Send a new message
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/chat", { message: input });

      const aiReply = res.data.reply || "🤖 Sorry, I didn’t get that.";
      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: aiReply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: "⚠️ Server not responding." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg w-full h-[75vh] overflow-hidden">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            👋 Hello {user?.username || "there"}! Start chatting below.
          </p>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} sender={m.sender} message={m.message} />
        ))}

        {loading && <MessageBubble sender="ai" message="Typing..." />}

        <div ref={endRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={sendMessage}
        className="flex border-t border-gray-200 p-3 bg-gray-50"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`ml-3 px-5 py-2 rounded-xl text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
