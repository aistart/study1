import Chat from "../components/Chat";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 标题区域 */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
            DeepSeek AI 助手
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
            基于 DeepSeek-V3 模型，为您提供智能、准确的对话服务
          </p>
        </div>
      </header>

      {/* 主要聊天区域 */}
      <main className="flex-1 w-full max-w-4xl p-4 flex items-center justify-center">
        <Chat />
      </main>

      {/* 页脚版权信息 */}
      <footer className="w-full bg-white dark:bg-gray-800 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} DeepSeek AI 助手. All rights reserved.</p>
            <p className="mt-1">
              Powered by{" "}
              <a 
                href="https://deepseek.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                DeepSeek
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
