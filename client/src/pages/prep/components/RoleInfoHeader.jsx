import React from "react";
import { motion } from "framer-motion";

export const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <motion.div
      className="relative bg-white overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Decorative Blobs */}
      <div className="absolute -top-10 right-0 w-72 h-72 opacity-30 animate-blob1 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl"></div>
      <div className="absolute top-20 -right-20 w-56 h-56 opacity-30 animate-blob2 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl"></div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Role and Topics */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-900">{role}</h2>
            <p className="mt-2 text-base text-gray-600">{topicsToFocus}</p>
            {description && (
              <p className="mt-4 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-block bg-black text-white text-xs md:text-sm font-medium px-4 py-2 rounded-full">
              Experience: {experience} {experience === 1 ? "Year" : "Years"}
            </span>
            <span className="inline-block bg-black text-white text-xs md:text-sm font-medium px-4 py-2 rounded-full">
              {questions} Q&A
            </span>
            <span className="inline-block bg-black text-white text-xs md:text-sm font-medium px-4 py-2 rounded-full">
              Last Updated: {lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
