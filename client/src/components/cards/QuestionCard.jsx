import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  const [optimisticIsPinned, setOptimisticIsPinned] = useState(isPinned);
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  useEffect(() => {
    setOptimisticIsPinned(isPinned);
  }, [isPinned]);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 16);
    } else {
      setHeight(0);
    }
  }, [isExpanded, answer]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleTogglePin = async (e) => {
    e.stopPropagation();
    if (isUpdatingPin) return;

    setIsUpdatingPin(true);
    const originalPinState = optimisticIsPinned;
    setOptimisticIsPinned(!originalPinState);

    try {
      await onTogglePin();
    } catch (error) {
      console.error("Failed to update pin status:", error);
      setOptimisticIsPinned(originalPinState);
    } finally {
      setIsUpdatingPin(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl mb-4 border border-opacity-second-light overflow-hidden">
      <div
        className="flex items-start justify-between p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-sm font-semibold text-secondary-text">Q</span>
          <h3 className="text-sm font-medium text-primary-text">{question}</h3>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
          <button
            className="flex items-center gap-1 text-xs text-secondary-text font-medium bg-black/5 px-2 py-1 rounded-md border border-transparent hover:border-opacity-second-light cursor-pointer transition-colors"
            onClick={handleTogglePin}
            disabled={isUpdatingPin}
            title={optimisticIsPinned ? "Unpin Question" : "Pin Question"}
          >
            {optimisticIsPinned ? (
              <LuPinOff className="text-xs" />
            ) : (
              <LuPin className="text-xs" />
            )}
            <span className="hidden sm:inline">
              {optimisticIsPinned ? "Unpin" : "Pin"}
            </span>
          </button>

          <button
            className="flex items-center gap-1 text-xs text-secondary-text font-medium bg-black/5 px-2 py-1 rounded-md border border-transparent hover:border-opacity-second-light cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) {
                setIsExpanded(true);
              }
              onLearnMore();
            }}
            title="Learn More with AI"
          >
            <LuSparkles />
            <span className="hidden sm:inline">Learn More</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1 rounded text-secondary-text hover:bg-black/5 transform transition-transform"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <LuChevronDown size={20} />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="px-4 pb-4">
          {answer && <AIResponsePreview content={answer} />}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
