import React, { useState } from "react";
import DataViewerTable from "./DataViewerTable";
import DataViewerChart from "./DataViewerChart";
import { colors } from "../constants/colors";

interface DataViewerProps {
  title: string;
  data: Record<string, unknown>[];
  className?: string;
}

type ViewMode = "Table" | "Chart";

const DataViewer: React.FC<DataViewerProps> = ({
  title,
  data,
  className = "",
}) => {
  const [activeView, setActiveView] = useState<ViewMode>("Table");

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">{title}</h2>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {activeView === "Table" && (
          <DataViewerTable data={data} />
        )}
        {activeView === "Chart" && (
          <DataViewerChart data={data} />
        )}
      </div>

      {/* Footer with view toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 space-y-2 sm:space-y-0">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveView("Table")}
            className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              activeView === "Table"
                ? "text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: activeView === "Table" ? colors.primary : undefined,
            }}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            Table
          </button>
          <button
            onClick={() => setActiveView("Chart")}
            className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              activeView === "Chart"
                ? "text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: activeView === "Chart" ? colors.primary : undefined,
            }}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Chart
          </button>
        </div>
        
        {/* Date watermark */}
        <div className="text-xs text-gray-400 font-mono">
          {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
