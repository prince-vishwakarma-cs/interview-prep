import { Send, X } from "lucide-react";
import { useState } from "react";

const formatAIResponse = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  formattedText = formattedText.replace(/```([\s\S]*?)```/g, (match, code) => {
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="bg-gray-800 text-white rounded p-3 my-2 overflow-x-auto"><code class="font-mono text-sm">${escapedCode}</code></pre>`;
  });

  formattedText = formattedText.replace(
    /(?:^\s*\*\s.*(?:\n|$))+/gm,
    (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((item) => `<li>${item.replace(/^\s*\*\s/, "")}</li>`)
        .join("");
      return `<ul class="list-disc list-inside my-2">${items}</ul>`;
    }
  );
  return formattedText.replace(/\n/g, "<br />");
};

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  activeTab,
  onTabChange,
  chatMessages,
  chatButtonContext,
  onSendChatMessage,
}) => {
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const currentVisibleTitle = activeTab === "chat" ? "Chat with AI" : title;

  const handleInternalChatSend = async () => {
    if (!chatInput.trim() || isSending) return;
    setIsSending(true);
    const result = await onSendChatMessage(chatInput, chatButtonContext);
    setIsSending(false);
    if (result && result.success) {
      setChatInput("");
    }
  };

  const handleInternalKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalChatSend();
    }
  };

  return (
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] w-full md:w-[40vw]  p-2 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="bg-white rounded-2xl h-full">
        <div className="flex items-center justify-between p-6 border-b border-opacity-second-light">
          <h5 className="text-base font-semibold text-primary-text">
            {currentVisibleTitle}
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 text-secondary-text hover:bg-black/5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-opacity-second-light">
          {["explanation", "chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium focus:outline-none transition-colors ${
                activeTab === tab
                  ? "text-primary-text border-b-2 border-primary-text"
                  : "text-secondary-text hover:text-primary-text hover:bg-black/5"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-col h-[calc(100%-73px-49px)]">
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
            {activeTab === "explanation" && children}
            {activeTab === "chat" && (
              <div className="space-y-4">
                {chatMessages?.length > 0 ? (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                          msg.type === "user"
                            ? "bg-primary-button-bg text-button-text"
                            : "bg-black/5 text-primary-text"
                        }`}
                      >
                        {msg.type === "user" ? (
                          msg.text
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatAIResponse(msg.text),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-text text-center py-4">
                    No messages yet. Ask a question to start the chat.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          {activeTab === "chat" && (
            <div className="p-4 border-t border-opacity-second-light bg-card-bg">
              <div className="flex items-center rounded-lg border border-opacity-second-light focus-within:ring-1 focus-within:ring-primary focus-within:border-primary bg-primary-background transition-all">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleInternalKeyDown}
                  placeholder="Ask anything..."
                  autoFocus
                  disabled={isSending}
                  className="flex-1 px-4 py-3 text-sm text-primary-text placeholder-secondary-text bg-transparent outline-none disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleInternalChatSend}
                  aria-label="Send message"
                  disabled={isSending || !chatInput.trim()}
                  className="m-1 p-2 rounded-md bg-primary-button-bg text-button-text hover:bg-primary-button-bg-hover disabled:bg-black/10 disabled:text-secondary-text disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
