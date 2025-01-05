"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const welcomeMessage = {
      sender: "AI",
      text: "您好！我是 DeepSeek AI 助手。我可以帮助您回答问题、编写代码、分析数据等。请告诉我您需要什么帮助？",
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "User", text: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", { message: input });
      const aiMessage = { sender: "AI", text: response.data.reply, timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        sender: "AI", 
        text: "抱歉，我暂时无法回应您的请求。请稍后再试。", 
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          实时对话
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="relative h-full">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-10"></div>
          
          <div className="h-full overflow-y-auto px-6 pt-4 pb-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.sender === "AI" ? "justify-start" : "justify-end"}`}>
                {msg.sender === "AI" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image
                      src="/images/ai-avatar.png"
                      alt="AI Avatar"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-3xl px-4 py-2 rounded-2xl ${
                  msg.sender === "AI" 
                    ? "bg-gray-100 dark:bg-gray-700" 
                    : "bg-blue-500 text-white"
                }`}>
                  <div className={`prose ${msg.sender === "AI" ? "dark:prose-invert" : "prose-invert"} max-w-none prose-sm lg:prose-base`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-gray-700 px-1 rounded" {...props}>
                              {children}
                            </code>
                          );
                        },
                        // 自定义其他 Markdown 元素的样式
                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        a: ({href, children}) => (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === "User" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden ml-2 flex-shrink-0">
                    <Image
                      src="/images/user-avatar.png"
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image
                    src="/images/ai-avatar.png"
                    alt="AI Avatar"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent z-10"></div>
        </div>
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入您的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          />
          <button
            className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={loading}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 