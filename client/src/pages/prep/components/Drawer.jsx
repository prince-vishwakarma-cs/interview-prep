import React, { useState } from "react";
import { LuX, LuSend } from "react-icons/lu";

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
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] w-full md:w-[40vw] bg-white transition-transform duration-300 ease-in-out shadow-2xl shadow-cyan-800/10 border-l border-gray-200 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h5 className="text-base font-semibold text-black">
          {currentVisibleTitle}
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg"
        >
          <LuX size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {["explanation", "chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-3 px-4 text-sm font-medium focus:outline-none ${
              activeTab === tab
                ? "text-[#FF9324] border-b-2 border-[#FF9324]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Body (flex-col layout with scrollable middle and fixed input) */}
      <div className="flex flex-col h-[calc(100%-73px-49px)]">
        {" "}
        {/* header + tabs = 122px */}
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
                      className={`max-w-[80%] p-3 rounded-3xl text-sm ${
                        msg.type === "user"
                          ? "bg-[#FF9324] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No messages yet. Type your question below to start the chat.
                </p>
              )}
            </div>
          )}
        </div>
        {/* Fixed input bar */}
        {activeTab === "chat" && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div
              className="
        flex items-center
        rounded-full
         border-gray-300 border-0.25
        shadow-sm
        focus-within:ring-1 focus-within:ring-[#FF9324] focus-within:border-[#FF9324]
        bg-white
        transition-colors duration-200
        "
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleInternalKeyDown}
                placeholder="Ask anything..."
                autoFocus
                disabled={isSending}
                className="
          flex-1
          px-4
          py-3
          text-sm text-gray-900
          placeholder-gray-400
          bg-transparent
          outline-none
          disabled:cursor-not-allowed disabled:text-gray-400 disabled:placeholder-gray-300
          transition-colors duration-200
        "
              />
              <button
                onClick={handleInternalChatSend}
                aria-label="Send message"
                disabled={isSending || !chatInput.trim()}
                className="
          ml-3
          p-3
          m-1
          rounded-full
          bg-[#FF9324]/20
          text-[#FF9324]
          hover:bg-[#e67e00]
          active:scale-95
          disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
          transition
          duration-150
          flex items-center justify-center
          shadow-md
        "
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  <LuSend size={20} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
