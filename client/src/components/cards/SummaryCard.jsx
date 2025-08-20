import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

export const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white border border-white rounded-2xl overflow-hidden hover:border-card-border-hover transition relative group cursor-pointer"
    >
        <div
        className="rounced =-lg p-4 cursor-pointer relative"
        style={{
          background: colors.bgcolor,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center text-lg font-semibold text-primary-text">
            {getInitials(role)}
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-black">{role}</h2>
            <p className="text-xs text-secondary-text">{topicsToFocus}</p>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="hidden group-hover:flex items-center gap-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 hover:border-rose-400 px-2.5 py-1 rounded-md absolute top-2 right-2"
      >
        <LuTrash2 size={14} />
        Delete
      </button>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          <span className="px-3 py-1 bg-light-button-bg rounded-full text-light-button-text">
            Experience: {experience} {experience === 1 ? "Year" : "Years"}
          </span>
          <span className="px-3 py-1 bg-light-button-bg rounded-full text-light-button-text">
            {questions} Q&A
          </span>
          <span className="px-3 py-1 bg-light-button-bg rounded-full text-light-button-text">
            Last Updated: {lastUpdated}
          </span>
        </div>
        <p className="px-3 text-gray-600 font-medium line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};
