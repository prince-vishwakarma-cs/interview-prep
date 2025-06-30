import React, { useRef, useState, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/prep/components/AIResponsePreview";

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

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      // Add a small buffer (e.g., 16px for padding) to scrollHeight
      setHeight(contentRef.current.scrollHeight + 16);
    } else {
      setHeight(0);
    }
  }, [isExpanded, answer]); // Re-calculate height if answer changes while expanded

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // The handleLearnMore function in the original code was not used.
  // The logic was directly in the button's onClick.
  // Retaining direct logic in button with stopPropagation.

  return (
    <div className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm border border-gray-100">
      {/* Question Header */}
      <div className="flex items-start justify-between p-4 cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-start gap-3 flex-1">
          <span className="text-sm font-semibold text-gray-500">Q</span>
          <h3 className="text-sm font-medium text-gray-800">{question}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center gap-1 text-xs text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded whitespace-nowrap border border-indigo-50 hover:border-indigo-200 cursor-pointer transition-colors mr-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card from toggling
              onTogglePin();
            }}
            title={isPinned ? "Unpin Question" : "Pin Question"}
          >
            {isPinned ? (
              <LuPinOff className="text-xs" />
            ) : (
              <LuPin className="text-xs" />
            )}
            <span className="hidden sm:inline">{isPinned ? "Unpin" : "Pin"}</span>
          </button>
          {/* Learn More Button */}
          <button
            className="flex items-center gap-1 text-xs text-cyan-800 font-medium bg-cyan-50 px-2 py-1 rounded whitespace-nowrap border border-cyan-50 hover:border-cyan-200 cursor-pointer transition-colors mr-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card from toggling
              // Ensure card is expanded when "Learn More" is clicked, then call onLearnMore
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
            onClick={e => {
              e.stopPropagation(); // This already correctly stops propagation for the chevron
              toggleExpand();
            }}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1 rounded hover:bg-gray-100 transform transition-transform"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <LuChevronDown size={20} />
          </button>
        </div>
      </div>
      {/* Answer Section */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="px-4 pb-4"> {/* Ensure this div has padding if contentRef.current.scrollHeight doesn't include it */}
          {answer && <AIResponsePreview content={answer} />}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;