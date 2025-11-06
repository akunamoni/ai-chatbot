import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAIReply  = async (messages) => {

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature:0.7,
    max_tokens: 800,
  });

  return completion?.choices?.[0]?.message?.content ?? "";
};
