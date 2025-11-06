import ChatMessage from "../models/ChatMessage.js";
import { getAIReply } from "../services/openaiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id; // ✅ your middleware sets the whole user

    if (!message) return res.status(400).json({ error: "Message required" });
    if (!userId) return res.status(401).json({ error: "User not authorized" });

    // Save user message
    await ChatMessage.create({
      userId,
      role: "user",
      content: message,
    });

    // Fetch previous messages for context
    const historyDocs = await ChatMessage.find({ userId }).sort({ createdAt: 1 }).lean();

    const messages = historyDocs.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    // Limit to last 20 for efficiency
    const lastMessages = messages.slice(-20);

    lastMessages.push({ role: "user", content: message });

    // Generate reply using OpenAI
    const reply = await getAIReply(lastMessages);

    // Save assistant reply
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: reply,
    });

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "User not authorized" });

    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ messages });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
