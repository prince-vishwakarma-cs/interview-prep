import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { useParams } from "react-router-dom";

import AIResponsePreview from "../components/AIResponsePreview";
import QuestionCard from "../components/cards/QuestionCard";
import Drawer from "../components/Drawer";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { SkeletonLoader } from "../components/loaders/SkeletonLoader";
import { RoleInfoHeader } from "../components/RoleInfoHeader";

import {
  useAskQuestionMutation,
  useGenerateExplanationMutation,
  useGenerateQuestionsMutation,
} from "../redux/api/aiApi";
import { useAddQuestionToSessionMutation, useGetOneSessionQuery, usePinQuestionMutation } from "../redux/api/sessionAPi";

const InterviewPrep = () => {
  const { id } = useParams();

  const [explanation, setExplanation] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("explanation");
  const [chatMessages, setChatMessages] = useState([]);
  const [errorMsg, setErrMsg] = useState("");

  const { data: sessionResponse, isLoading: isSessionLoading } = useGetOneSessionQuery(id);
  const [generateExplanation, { isLoading: isLoadingExplanation }] = useGenerateExplanationMutation();
  const [askQuestion] = useAskQuestionMutation();
  const [pinQuestion,{error}] = usePinQuestionMutation();
  const [generateQuestions, { isLoading: isGeneratingMore }] = useGenerateQuestionsMutation();
  const [addQuestion] = useAddQuestionToSessionMutation();

  const sessionData = sessionResponse?.session;
  const questions = useMemo(() => sessionData?.questions || [], [sessionData]);

  const chatButtonContext = useMemo(() => {
    if (explanation?.explanation) return explanation.explanation;
    if (sessionData?.role) return `The user is preparing for a ${sessionData.role} role.`;
    return "General interview preparation context.";
  }, [explanation, sessionData]);

  const handleLearnMore = async (question) => {
    setErrMsg("");
    setExplanation(null);
    setOpenDrawer(true);
    setActiveDrawerTab("explanation");

    try {
      const data = await generateExplanation({ question }).unwrap();
      setExplanation(data);
    } catch (err) {
      console.error("Explanation error:", err);
      const errorMessage = "Failed to generate explanation. Please try again.";
      setErrMsg(errorMessage);
      toast.error("Could not load explanation");
    }
  };

  const handleSendChatMessage = async (question, contextForApi) => {
    if (!question.trim()) {
      return { success: false, error: "Question cannot be empty." };
    }

    const userMessage = { id: `user-${Date.now()}`, type: "user", text: question };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const data = await askQuestion({ context: contextForApi, question }).unwrap();
      const aiText = data.answer || (typeof data === "string" ? data : "No valid response received.");
      const aiMessage = { id: `ai-${Date.now()}`, type: "ai", text: aiText };
      setChatMessages((prev) => [...prev, aiMessage]);
      return { success: true, data };
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.data?.message || "Something went wrong. Please try again.";
      const aiErrorMessage = { id: `ai-error-${Date.now()}`, type: "ai", text: `Error: ${errorMessage}` };
      setChatMessages((prev) => [...prev, aiErrorMessage]);
      return { success: false, error: errorMessage };
    }
  };

  const handlePin = async (questionId) => {
    try {
       await pinQuestion({ questionId, sessionId: id }).unwrap();
    toast.success("Pinned successfully");
    } catch (err) {
      console.error("Pin error:", err);
      toast.error("Pin failed. Please try again.");
    }
  };

  const handleLoadMore = async () => {
    if (!sessionData) return;
    setErrMsg("");

    try {
      const { role, experience, topicsToFocus } = sessionData;

      const newQuestions = await generateQuestions({
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      }).unwrap();


      await addQuestion({
        sessionId: id,
        questions: newQuestions,
      }).unwrap();

      toast.success("Added more questions");
    } catch (err) {
      console.error("Load more error:", err);
      const errorMessage = err.data?.message || "Error loading more questions";
      setErrMsg(errorMessage);
      toast.error("Could not load more questions");
    }
  };

  if (isSessionLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-full px-4 py-6 sm:px-6 lg:px-8">
          <SkeletonLoader type="page" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div
            className={`col-span-12 transition-all duration-300 ${
              openDrawer ? "md:col-span-7" : "md:col-span-12"
            }`}
          >
            {sessionData && (
              <RoleInfoHeader
                role={sessionData.role}
                topicsToFocus={sessionData.topicsToFocus}
                experience={sessionData.experience}
                questions={questions.length}
                description={sessionData.description}
                lastUpdated={
                  sessionData.updatedAt
                    ? moment(sessionData.updatedAt).format("Do MMM YY")
                    : ""
                }
              />
            )}

            <h2 className="mt-8 mb-4 text-2xl font-semibold text-primary-text">
              Interview Q&A
            </h2>

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
                    isPinned={q.isPinned}
                    onLearnMore={() => handleLearnMore(q.question)}
                    onTogglePin={() => handlePin(q._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {sessionData && questions.length === 0 && (
              <p className="py-8 text-center text-secondary-text">
                No questions generated yet. Try adjusting session settings or reloading.
              </p>
            )}

            {!sessionData && !isSessionLoading && (
                <SkeletonLoader type="questions" count={3} />
            )}

            {questions.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isGeneratingMore}
                  className="inline-flex items-center px-6 py-3 transition-colors rounded-2xl bg-primary-button-bg text-button-text hover:bg-primary-button-bg-hover disabled:opacity-50"
                >
                  {isGeneratingMore ? (
                    <div className="w-5 h-5 border-2 rounded-full border-current border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <LuListCollapse className="mr-2" />
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}
            
            {errorMsg && (
              <p className="mt-4 text-sm text-center text-red-600">{errorMsg}</p>
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
            <p className="flex items-center gap-2 p-4 text-sm text-amber-600">
              <LuCircleAlert /> {errorMsg}
            </p>
          ) : explanation?.explanation ? (
            <AIResponsePreview content={explanation.explanation} />
          ) : activeDrawerTab === "explanation" ? (
            <p className="p-4 text-center text-secondary-text">
              No explanation loaded.
            </p>
          ) : null}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;