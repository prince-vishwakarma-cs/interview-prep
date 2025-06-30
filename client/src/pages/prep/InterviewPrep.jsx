import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import SpinnerLoader from "../../components/loaders/SpinLoader";
import { RoleInfoHeader } from "./components/RoleInfoHeader";
import Drawer from "./components/Drawer";
import QuestionCard from "../../components/cards/QuestionCard";
import { axiosInstance } from "../../utils/axios";
import { API_PATHS } from "../../utils/api";
import { SkeletonLoader } from "../../components/loaders/SkeletonLoader";
import AIResponsePreview from "./components/AIResponsePreview";

const InterviewPrep = () => {
  const { id: sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrMsg] = useState("");
  const [explanation, setExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("explanation");
  const [chatMessages, setChatMessages] = useState([]);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (data.session) setSessionData(data.session);
    } catch (err) {
      console.error("Failed to fetch session:", err);
    }
  }, [sessionId]);

  const chatButtonContext = useMemo(() => {
    if (explanation?.explanation) return explanation.explanation;
    if (sessionData?.role) return `The user is preparing for a ${sessionData.role} role.`;
    return "General interview preparation context.";
  }, [explanation, sessionData]);

  const handleLearnMore = async (question) => {
    setErrMsg("");
    setExplanation(null);
    setIsLoadingExplanation(true);
    setOpenDrawer(true);
    setActiveDrawerTab("explanation");

    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question });
      setExplanation(data);
    } catch (err) {
      console.error("Explanation error:", err);
      setErrMsg("Failed to generate explanation. Please try again.");
      toast.error("Could not load explanation");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleChatButtonExpansionToggle = (isExpanded) => {
    if (isExpanded) {
      setOpenDrawer(true);
      setActiveDrawerTab("chat");
    }
  };

  const handleSendChatMessage = async (question, contextForApi) => {
    if (!question.trim()) return { success: false, error: "Question cannot be empty." };

    const userMessage = { id: `user-${Date.now()}`, type: "user", text: question };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.ASK_QUESTION, {
        context: contextForApi,
        question,
      });

      const aiText = data.answer || (typeof data === "string" ? data : "No valid response received.");
      const aiMessage = { id: `ai-${Date.now()}`, type: "ai", text: aiText };
      setChatMessages((prev) => [...prev, aiMessage]);

      return { success: true, data };
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      const aiErrorMessage = { id: `ai-error-${Date.now()}`, type: "ai", text: `Error: ${errorMessage}` };
      setChatMessages((prev) => [...prev, aiErrorMessage]);

      return { success: false, error: errorMessage };
    }
  };

  const handlePin = async (qid) => {
    try {
      await axiosInstance.post(API_PATHS.QUESTION.PIN(qid));
      toast.success("Pinned successfully");
      fetchSession();
    } catch (err) {
      console.error("Pin error:", err);
      toast.error("Pin failed");
    }
  };

  const handleLoadMore = async () => {
    if (!sessionData) return;

    setIsUpdating(true);
    try {
      const { role, experience, topicsToFocus } = sessionData;

      const aiRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      });

      await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: aiRes.data,
      });

      toast.success("Added more questions");
      fetchSession();
    } catch (err) {
      console.error("Load more error:", err);
      setErrMsg(err.response?.data?.message || "Error loading more questions");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSession();
  }, [sessionId, fetchSession]);

  const questions = useMemo(() => sessionData?.questions || [], [sessionData]);

  return (
    <DashboardLayout>
      <div className="max-w-full mx-8 px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className={`col-span-12 transition-all duration-300 ${openDrawer ? 'md:col-span-7' : 'md:col-span-12'}`}>
            <RoleInfoHeader
              role={sessionData?.role}
              topicsToFocus={sessionData?.topicsToFocus}
              experience={sessionData?.experience}
              questions={questions.length}
              description={sessionData?.description}
              lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""}
            />
          </div>

          <div className={`col-span-12 transition-all duration-300 ${openDrawer ? 'md:col-span-7' : 'md:col-span-12'}`}>
            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">Interview Q&A</h2>
            <AnimatePresence>
              {questions.map((q, idx) => (
                <motion.div
                  key={q._id || idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                >
                  <QuestionCard
                    question={q.question}
                    answer={q.answer}
                    onLearnMore={() => handleLearnMore(q.question)}
                    isPinned={q.isPinned}
                    onTogglePin={() => handlePin(q._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {!sessionData && <SkeletonLoader type="questions" count={3} />}
            {sessionData && questions.length === 0 && (
              <p className="text-center text-gray-500 py-8">No questions generated yet. Try adjusting session settings or reloading.</p>
            )}

            {questions.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isUpdating}
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition"
                >
                  {isUpdating ?    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />  : (<><LuListCollapse className="mr-2" /> Load More</>)}
                </button>
              </div>
            )}

            {isUpdating && errorMsg && (
              <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
            )}
          </div>
        </div>

        <Drawer
          isOpen={openDrawer}
          onClose={() => setOpenDrawer(false)}
          title={explanation?.title || "Further Details"}
          activeTab={activeDrawerTab}
          onTabChange={setActiveDrawerTab}
          chatMessages={chatMessages}
          chatButtonContext={chatButtonContext}
          onSendChatMessage={handleSendChatMessage}
        >
          {isLoadingExplanation ? (
            <SkeletonLoader />
          ) : errorMsg && activeDrawerTab === "explanation" ? (
            <p className="text-sm text-amber-600 flex items-center gap-2 p-4">
              <LuCircleAlert /> {errorMsg}
            </p>
          ) : explanation?.explanation ? (
            <AIResponsePreview content={explanation.explanation} />
          ) : activeDrawerTab === "explanation" ? (
            <p className="text-gray-500 text-center p-4">No explanation loaded.</p>
          ) : null}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
