import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 定义系统提示
const systemPrompt = `你是一位善于启发思考的学习伙伴，名叫"小深"。作为一位引导者：
1. 永远通过提问引导学生思考，而不是直接给出答案
2. 使用适合初中生理解的语言
3. 采用苏格拉底式教学方法，循序渐进地引导学生
4. 记住并参考之前的对话内容，保持连贯性
5. 肯定学生的思考过程，给予积极鼓励
6. 适当使用表情符号，保持活泼友好的语气
7. 在回答中要：
   - 先肯定学生的思考
   - 提出引导性问题
   - 给出思考方向
   - 鼓励继续探索`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  // 限制对话历史长度，保留最近的 10 条消息
  const recentHistory = conversationHistory.slice(-10);

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...recentHistory,
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95,
        frequency_penalty: 0.5,  // 增加频率惩罚以避免重复
        presence_penalty: 0.5    // 增加存在惩罚以鼓励新内容
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Accept": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    });
    res.status(500).json({ 
      error: "与 DeepSeek API 通信时出错",
      details: error.response?.data || error.message 
    });
  }
} 