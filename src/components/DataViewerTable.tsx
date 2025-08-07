import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Settings2, ChevronDown } from "lucide-react";
import { colors } from "../constants/colors";

interface DataViewerTableProps {
  data: Array<Record<string, any>>;
}

const DataViewerTable: React.FC<DataViewerTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const columnSelectorRef = useRef<HTMLDivElement>(null);

  // Get all available columns
  const allColumns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Initialize visible columns on first render
  React.useEffect(() => {
    if (allColumns.length > 0 && Object.keys(visibleColumns).length === 0) {
      const initialVisible = allColumns.reduce((acc, col) => {
        acc[col] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setVisibleColumns(initialVisible);
    }
  }, [allColumns, visibleColumns]);

  // Handle click outside to close column selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false);
      }
    };

    if (showColumnSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSelector]);

  // Get visible columns
  const visibleColumnNames = useMemo(() => {
    return allColumns.filter(col => visibleColumns[col]);
  }, [allColumns, visibleColumns]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const formatColumnName = (column: string): string => {
    return column
      .replace(/^O_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search and Column Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 w-full sm:min-w-64"
            style={{ '--tw-ring-color': colors.primary } as any}
          />
        </div>
        
        <div className="relative w-full sm:w-auto" ref={columnSelectorRef}>
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-opacity-50 w-full sm:w-auto justify-center sm:justify-start"
            style={{ 
              '--tw-ring-color': colors.primary,
              boxShadow: showColumnSelector ? `0 0 0 1px ${colors.primary}` : undefined
            } as any}
          >
            <Settings2 className="w-4 h-4" />
            Columns
            <ChevronDown className={`w-4 h-4 transition-transform ${showColumnSelector ? 'rotate-180' : ''}`} />
          </button>
          
          {showColumnSelector && (
            <div className="absolute left-0 sm:right-0 mt-1 w-full sm:w-56 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
              <div className="p-3">
                <div className="text-sm font-medium text-gray-700 mb-3">Toggle columns</div>
                <div className="space-y-2">
                  {allColumns.map((column) => (
                    <div key={column} className="flex items-center">
                      <label className="flex items-center cursor-pointer select-none w-full">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={visibleColumns[column]}
                            onChange={() => toggleColumn(column)}
                            className="sr-only"
                          />
                          <div className="w-4 h-4 flex items-center justify-center cursor-pointer">
                            {visibleColumns[column] && (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: colors.primary }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700">{formatColumnName(column)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumnNames.map((column) => (
                <th
                  key={column}
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <span className="block sm:hidden">{formatColumnName(column).slice(0, 8)}{formatColumnName(column).length > 8 ? '...' : ''}</span>
                  <span className="hidden sm:block">{formatColumnName(column)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {visibleColumnNames.map((column) => (
                  <td key={column} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                    <div className="max-w-xs sm:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
                      {String(row[column] || "")}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <Search className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search term" : "No data available"}
            </p>
          </div>
        )}
      </div>
      
      {/* Footer with record count */}
      <div className="text-center sm:text-right text-sm text-gray-500 px-2">
        Showing {filteredData.length} of {data.length} records
      </div>
    </div>
  );
};

export default DataViewerTable;
