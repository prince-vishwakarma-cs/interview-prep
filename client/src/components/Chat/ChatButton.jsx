import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { LuSend, LuSparkles } from "react-icons/lu";
import { axiosInstance } from "../../utils/axios";
import { API_PATHS } from "../../utils/api";

const ChatButton = ({ context }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSend = async (question) => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.ASK_QUESTION, {
        context,
        question,
      });
      toast.success("Response received.");
      setChatInput("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(chatInput);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence initial={false} mode="wait">
        {!isChatOpen ? (
          <motion.div
            key="icon"
            onClick={handleChatToggle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 cursor-pointer flex justify-center items-center"
            style={{ width: 48, height: 48 }}
          >
            <LuSparkles size={24} className="text-black" />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ width: 48, opacity: 0, y: 10 }}
            animate={{ width: 300, opacity: 1, y: 0 }}
            exit={{ width: 48, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center bg-white shadow-lg rounded-full px-4 py-2 border border-gray-200"
            style={{ height: 48 }}
          >
            <div
              onClick={handleChatToggle}
              className="mr-3 cursor-pointer flex items-center justify-center"
              title="Close chat"
            >
              <LuSparkles size={24} className="text-black" />
            </div>

            <motion.input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              autoFocus
              disabled={isLoading}
              className="flex-1 outline-none border-none text-sm text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.25, ease: "easeInOut" }}
            />

           <motion.button
  onClick={() => handleSend(chatInput)}
  aria-label="Send message"
  disabled={isLoading}
  className="text-[#FF9324] hover:text-[#FF9324]/95 ml-3 transition disabled:opacity-40 flex items-center justify-center"
  initial={{ opacity: 0, x: 6 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 6 }}
  transition={{ delay: 0.15, duration: 0.25, ease: "easeInOut" }}
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-t-transparent border-[#FF9324] rounded-full animate-spin" />
  ) : (
    <LuSend size={20} />
  )}
</motion.button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatButton;
