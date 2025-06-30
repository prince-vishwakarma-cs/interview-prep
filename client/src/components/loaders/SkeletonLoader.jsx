import React from "react";

const Line = ({ width = "full", height = "h-3" }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700/10 ${height} w-${width} rounded-md`}
  />
);

const SkeletonSection = ({ lines = [], containerClasses = "space-y-2" }) => (
  <div className={containerClasses} role="status">
    {lines.map((line, idx) => (
      <Line key={idx} width={line.width} height={line.height} />
    ))}
  </div>
);

export const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6 max-w-3xl">
    {/* Title placeholder */}
    <SkeletonSection
      containerClasses="space-y-4"
      lines={[{ width: "1/2", height: "h-6" }]}
    />

    {/* Paragraph placeholder */}
    <SkeletonSection
      lines={[
        { width: "full" },
        { width: "11/12" },
        { width: "10/12" },
        { width: "9/12" },
      ]}
    />

    {/* Card placeholder */}
    <div className="bg-gray-100 dark:bg-gray-700/10 rounded-lg p-4 space-y-3">
      <SkeletonSection
        containerClasses="space-y-2"
        lines={[
          { width: "3/4", height: "h-2.5" },
          { width: "2/3", height: "h-2.5" },
          { width: "1/2", height: "h-2.5" },
        ]}
      />
    </div>

    {/* Repeat another paragraph */}
    <SkeletonSection
      containerClasses="space-y-4"
      lines={[{ width: "1/2", height: "h-4" }]}
    />

    {/* Final lines */}
    <SkeletonSection
      lines={[
        { width: "full" },
        { width: "11/12" },
        { width: "10/12" },
        { width: "9/12" },
      ]}
    />
  </div>
);
