import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { ChevronDown } from "lucide-react";
import { colors, chartColors, pieChartColors } from "../constants/colors";

interface DataViewerChartProps {
  data: Record<string, unknown>[];
}

type ChartType = "Bar Chart" | "Line Chart" | "Area Chart" | "Radar Chart" | "Step Chart" | "Pie Chart";

const DataViewerChart: React.FC<DataViewerChartProps> = ({ data }) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("Bar Chart");
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [selectedXAxis, setSelectedXAxis] = useState<string>("");
  const [selectedYAxis, setSelectedYAxis] = useState<string>("");
  const [showXAxisSelector, setShowXAxisSelector] = useState(false);
  const [showYAxisSelector, setShowYAxisSelector] = useState(false);

  const chartTypes: ChartType[] = ["Bar Chart", "Line Chart", "Area Chart", "Radar Chart", "Step Chart", "Pie Chart"];

  // Analyze data to find numeric and categorical columns
  const { numericColumns, categoricalColumns, allColumns } = useMemo(() => {
    if (data.length === 0) return { numericColumns: [], categoricalColumns: [], allColumns: [] };

    const firstRow = data[0];
    const numeric: string[] = [];
    const categorical: string[] = [];
    const all: string[] = Object.keys(firstRow);

    Object.entries(firstRow).forEach(([key, value]) => {
      if (typeof value === "number") {
        numeric.push(key);
      } else {
        categorical.push(key);
      }
    });

    return { numericColumns: numeric, categoricalColumns: categorical, allColumns: all };
  }, [data]);

  // Smart column selection - prioritize meaningful columns
  const getSmartColumnSelection = () => {
    if (numericColumns.length === 0 || categoricalColumns.length === 0) {
      return { xAxisColumn: "", yAxisColumn: "" };
    }

    // Find the best Y-axis column (numeric) - prioritize sales, total, amount, etc.
    const yAxisPriority = ['total sales', 'sales', 'amount', 'total', 'revenue', 'value', 'price', 'quantity'];
    let yAxisColumn = numericColumns[0]; // default to first numeric
    
    for (const priority of yAxisPriority) {
      const found = numericColumns.find(col => 
        col.toLowerCase().includes(priority.toLowerCase())
      );
      if (found) {
        yAxisColumn = found;
        break;
      }
    }

    // Find the best X-axis column (categorical) - prioritize names over IDs
    const xAxisPriority = ['name', 'first name', 'last name', 'country', 'category', 'type'];
    let xAxisColumn = categoricalColumns[0]; // default to first categorical
    
    for (const priority of xAxisPriority) {
      const found = categoricalColumns.find(col => 
        col.toLowerCase().includes(priority.toLowerCase())
      );
      if (found) {
        xAxisColumn = found;
        break;
      }
    }

    // Avoid using ID columns as X-axis if there are better options
    if (xAxisColumn.toLowerCase().includes('id') && categoricalColumns.length > 1) {
      const nonIdColumns = categoricalColumns.filter(col => 
        !col.toLowerCase().includes('id')
      );
      if (nonIdColumns.length > 0) {
        xAxisColumn = nonIdColumns[0];
      }
    }

    return { xAxisColumn, yAxisColumn };
  };

  // Initialize selected columns based on smart selection or user preference
  const smartSelection = getSmartColumnSelection();
  const currentXAxis = selectedXAxis || smartSelection.xAxisColumn;
  const currentYAxis = selectedYAxis || smartSelection.yAxisColumn;

  // Generate chart data based on selected or smart column selection
  const chartData = useMemo(() => {
    if (data.length === 0 || categoricalColumns.length === 0 || numericColumns.length === 0) {
      return { 
        categories: [] as string[], 
        values: [] as number[], 
        numericCol: "" as string, 
        categoryCol: "" as string 
      };
    }

    const categoryCol = currentXAxis;
    const numericCol = currentYAxis;

    // Group by category and sum/average numeric values
    const groupedData = data.reduce((acc, row) => {
      const category = String(row[categoryCol] || "Unknown");
      const value = Number(row[numericCol] || 0);
      
      if (!acc[category]) {
        acc[category] = { sum: 0, count: 0 };
      }
      const group = acc[category] as { sum: number; count: number };
      group.sum += value;
      group.count += 1;
      
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    const categories = Object.keys(groupedData);
    const values = categories.map(cat => (groupedData[cat] as { sum: number; count: number }).sum);

    return { categories, values, numericCol, categoryCol } as {
      categories: string[];
      values: number[];
      numericCol: string;
      categoryCol: string;
    };
  }, [data, currentXAxis, currentYAxis, categoricalColumns, numericColumns]);

  const getChartOptions = () => {
    const { categories, values, numericCol, categoryCol } = chartData;

    if (categories.length === 0) {
      return null;
    }

    // Get colors from centralized color configuration
    const primaryColor = chartColors.primary;
    const secondaryColor = chartColors.secondary;
    const areaFillColor = chartColors.areaFill;

    const baseOptions = {
      // title: {
      //   text: `${numericCol?.replace(/^O_/, "").replace(/_/g, " ")} by ${categoryCol?.replace(/^O_/, "").replace(/_/g, " ")}`,
      //   left: "center",
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: "bold",
      //   },
      // },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "transparent",
        textStyle: {
          color: "#fff",
          fontSize: 12,
        },
        confine: true, // Keep tooltip within container
      },
      grid: {
        left: "12%",
        right: "8%", 
        bottom: "25%",
        top: "8%",
        containLabel: true,
      },
      legend: {
        data: [numericCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "value"],
        bottom: "2%",
        left: "center",
        textStyle: {
          color: "#666",
          fontSize: 10,
        },
        padding: [5, 10, 5, 10],
      },
    };

    switch (selectedChartType) {
      case "Bar Chart": {
        return {
          ...baseOptions,
          xAxis: {
            type: "category",
            data: categories,
            name: categoryCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "category",
            nameLocation: "middle",
            nameGap: 30,
            nameTextStyle: {
              color: "#666",
              fontSize: 10,
            },
            axisLabel: {
              rotate: categories.length > 8 ? 45 : categories.length > 4 ? 30 : 0,
              fontSize: 10,
              interval: categories.length > 10 ? 'auto' : 0,
            },
          },
          yAxis: {
            type: "value",
            name: numericCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "value",
            nameLocation: "middle",
            nameGap: 40,
            nameTextStyle: {
              color: "#666",
              fontSize: 10,
            },
            axisLabel: {
              formatter: (value: number) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                } else if (value === 0) {
                  return '0';
                } else {
                  return value.toString();
                }
              },
            },
          },
          series: [
            {
              name: numericCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "value",
              data: values,
              type: "bar",
              itemStyle: {
                color: primaryColor,
                borderRadius: [4, 4, 0, 0],
              },
              barWidth: "60%",
            },
          ],
        };
      }

      case "Line Chart": {
        return {
          ...baseOptions,
          xAxis: {
            type: "category",
            data: categories,
            name: categoryCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "category",
            nameLocation: "middle",
            nameGap: 30,
            nameTextStyle: {
              color: "#666",
              fontSize: 10,
            },
            axisLabel: {
              rotate: categories.length > 8 ? 45 : categories.length > 4 ? 30 : 0,
              fontSize: 10,
              interval: categories.length > 10 ? 'auto' : 0,
            },
          },
          yAxis: {
            type: "value",
            name: numericCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "value",
            nameLocation: "middle",
            nameGap: 40,
            nameTextStyle: {
              color: "#666",
              fontSize: 10,
            },
            axisLabel: {
              formatter: (value: number) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                } else if (value === 0) {
                  return '0';
                } else {
                  return value.toString();
                }
              },
            },
          },
          series: [
            {
              name: numericCol?.replace(/^O_/, "").replace(/_/g, " ").toLowerCase() || "value",
              data: values,
              type: "line",
              smooth: true,
              lineStyle: {
                color: primaryColor,
                width: 3,
              },
              itemStyle: {
                color: primaryColor,
              },
            },
          ],
        };
      }

      case "Pie Chart": {
        return {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            confine: true,
          },
          legend: {
            data: categories.map(cat => cat.length > 15 ? cat.substring(0, 15) + '...' : cat),
            bottom: "5%",
            left: "center",
            textStyle: {
              color: "#666",
              fontSize: 10,
            },
            orient: categories.length > 4 ? 'horizontal' : 'horizontal',
            type: categories.length > 6 ? 'scroll' : 'plain',
          },
          series: [
            {
              name: numericCol?.replace(/^O_/, "").replace(/_/g, " "),
              type: "pie",
              radius: "50%",
              data: categories.map((cat, index) => ({
                name: cat,
                value: values[index],
                itemStyle: {
                  color: pieChartColors[index % pieChartColors.length],
                },
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
      }

      case "Area Chart":
        return {
          ...baseOptions,
          xAxis: {
            type: "category",
            data: categories,
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: (value: number) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                } else if (value === 0) {
                  return '0';
                } else {
                  return value.toString();
                }
              },
            },
          },
          series: [
            {
              data: values,
              type: "line",
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: secondaryColor,
                    },
                    {
                      offset: 1,
                      color: areaFillColor,
                    },
                  ],
                },
              },
              lineStyle: {
                color: primaryColor,
                width: 3,
              },
              itemStyle: {
                color: primaryColor,
              },
              smooth: true,
            },
          ],
        };

      case "Radar Chart": {
        // For radar chart, we need to limit categories to avoid overcrowding
        const radarCategories: string[] = categories.slice(0, 6); // Take only first 6 categories
        const radarValues = radarCategories.map((cat: string) => {
          const index = categories.indexOf(cat);
          return values[index] || 0;
        });
        
        // Normalize values for radar chart (scale to 0-100)
        const maxValue = Math.max(...radarValues);
        const minValue = Math.min(...radarValues);
        const normalizedValues = radarValues.map(val => {
          if (maxValue === minValue) return 50; // If all values are same
          return ((val - minValue) / (maxValue - minValue)) * 100;
        });
        
        return {
          tooltip: {
            trigger: "item",
            formatter: (params: { dataIndex: number }) => {
              const originalValue = radarValues[params.dataIndex] || 0;
              return `${radarCategories[params.dataIndex]}: $${originalValue.toLocaleString()}`;
            },
            confine: true,
          },
          legend: {
            data: [numericCol?.replace(/^O_/, "").replace(/_/g, " ")],
            bottom: "5%",
            left: "center",
            textStyle: {
              color: "#666",
              fontSize: 10,
            },
          },
          radar: {
            indicator: radarCategories.map((cat) => ({
              name: cat.length > 10 ? cat.substring(0, 10) + '...' : cat,
              max: 100,
              min: 0,
            })),
            shape: "polygon",
            radius: "60%",
            splitNumber: 4,
            axisLabel: {
              show: true,
              fontSize: 10,
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['rgba(114, 172, 209, 0.05)', 'rgba(114, 172, 209, 0.1)'],
              },
            },
          },
          series: [
            {
              name: numericCol?.replace(/^O_/, "").replace(/_/g, " "),
              type: "radar",
              symbol: "circle",
              symbolSize: 6,
              data: [
                {
                  value: normalizedValues,
                  name: "Data",
                  itemStyle: {
                    color: primaryColor,
                  },
                  areaStyle: {
                    color: areaFillColor,
                  },
                  lineStyle: {
                    color: primaryColor,
                    width: 2,
                  },
                },
              ],
            },
          ],
        };
      }

      case "Step Chart": {
        return {
          ...baseOptions,
          xAxis: {
            type: "category",
            data: categories,
            axisLabel: {
              rotate: categories.length > 8 ? 45 : categories.length > 4 ? 30 : 0,
              fontSize: 10,
              interval: categories.length > 10 ? 'auto' : 0,
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: (value: number) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                } else if (value === 0) {
                  return '0';
                } else {
                  return value.toString();
                }
              },
            },
          },
          series: [
            {
              data: values,
              type: "line",
              step: "middle", // This creates the step effect
              lineStyle: {
                color: primaryColor,
                width: 3,
              },
              itemStyle: {
                color: primaryColor,
                borderWidth: 2,
              },
              symbol: "circle",
              symbolSize: 6,
            },
          ],
        };
      }

      default:
        return null;
    }
  };

  const chartOptions = getChartOptions();

  if (!chartOptions) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p>No suitable data for charting</p>
          <p className="text-sm">Need at least one numeric and one categorical column</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Chart Type Selector */}
      <div className="flex justify-start">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowChartSelector(!showChartSelector)}
            className="flex items-center justify-center sm:justify-start px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 outline-none w-full sm:min-w-[120px] text-sm"
            style={{
              '--tw-ring-color': colors.primary + '33',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <span className="mr-2">{selectedChartType}</span>
            <ChevronDown size={14} className={`transition-transform ${showChartSelector ? 'rotate-180' : ''}`} />
          </button>
          
          {showChartSelector && (
            <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-48 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {chartTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedChartType(type);
                    setShowChartSelector(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                    selectedChartType === type ? 'text-red-800' : 'text-gray-700'
                  }`}
                  style={{
                    backgroundColor: selectedChartType === type ? `${colors.primary}20` : undefined,
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Column Selection */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* X-Axis Column Selector */}
        <div className="relative flex-1 sm:max-w-xs">
          <label className="block text-xs font-medium text-gray-600 mb-1">X-Axis (Category)</label>
          <button
            onClick={() => setShowXAxisSelector(!showXAxisSelector)}
            className="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 outline-none text-sm"
            style={{
              '--tw-ring-color': colors.primary + '33',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <span className="truncate">{currentXAxis}</span>
            <ChevronDown size={14} className={`ml-2 transition-transform ${showXAxisSelector ? 'rotate-180' : ''}`} />
          </button>
          
          {showXAxisSelector && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
              {allColumns.map((column) => (
                <button
                  key={column}
                  onClick={() => {
                    setSelectedXAxis(column);
                    setShowXAxisSelector(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                    currentXAxis === column ? 'text-red-800' : 'text-gray-700'
                  }`}
                  style={{
                    backgroundColor: currentXAxis === column ? `${colors.primary}20` : undefined,
                  }}
                >
                  <span className="truncate">{column}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Y-Axis Column Selector */}
        <div className="relative flex-1 sm:max-w-xs">
          <label className="block text-xs font-medium text-gray-600 mb-1">Y-Axis (Value)</label>
          <button
            onClick={() => setShowYAxisSelector(!showYAxisSelector)}
            className="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 outline-none text-sm"
            style={{
              '--tw-ring-color': colors.primary + '33',
            } as React.CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <span className="truncate">{currentYAxis}</span>
            <ChevronDown size={14} className={`ml-2 transition-transform ${showYAxisSelector ? 'rotate-180' : ''}`} />
          </button>
          
          {showYAxisSelector && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
              {allColumns.map((column) => (
                <button
                  key={column}
                  onClick={() => {
                    setSelectedYAxis(column);
                    setShowYAxisSelector(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                    currentYAxis === column ? 'text-red-800' : 'text-gray-700'
                  }`}
                  style={{
                    backgroundColor: currentYAxis === column ? `${colors.primary}20` : undefined,
                  }}
                >
                  <span className="truncate">{column}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-2 sm:p-4 rounded-lg border border-gray-200">
        <div className="w-full h-80 sm:h-96">
          <ReactECharts 
            key={selectedChartType}
            option={chartOptions} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'svg' }}
            notMerge={true}
            lazyUpdate={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DataViewerChart;
