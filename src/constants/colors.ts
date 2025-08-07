// Central color configuration for the entire application
// Change colors here to reflect changes across the app

export const colors = {
  // Primary theme colors
  primary: "#FD6464",           // Red - Main brand color
  secondary: "rgba(253, 100, 100, 0.7)",  // Red with transparency
  accent: "#FD6464",            // Red - For accent elements (same as primary)
  
  // Chart colors - Single color theme
  chart: {
    primary: "#FD6464",         // Red - Main chart color
    secondary: "rgba(253, 100, 100, 0.7)",
    areaFill: "rgba(253, 100, 100, 0.2)",
  },
  
  // Pie chart colors - Multi-color palette
  pieChart: [
    "#3B82F6",  // Blue
    "#EF4444",  // Red  
    "#10B981",  // Emerald
    "#F59E0B",  // Amber
    "#8B5CF6",  // Violet
    "#EC4899",  // Pink
    "#06B6D4",  // Cyan
    "#84CC16",  // Lime
    "#F97316",  // Orange
    "#6366F1",  // Indigo
    "#14B8A6",  // Teal
    "#F43F5E",  // Rose
    "#8B4513",  // Saddle Brown
    "#FF69B4",  // Hot Pink
    "#32CD32",  // Lime Green
    "#FF4500",  // Orange Red
    "#9370DB",  // Medium Purple
    "#00CED1",  // Dark Turquoise
    "#FFD700",  // Gold
    "#DC143C",  // Crimson
  ],
  
  // UI colors
  ui: {
    background: "#FFFFFF",
    surface: "#F9FAFB",
    border: "#E5E7EB",
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      muted: "#9CA3AF",
    },
  },
  
  // Status colors
  status: {
    success: "#10B981",
    warning: "#F59E0B", 
    error: "#EF4444",
    info: "#3B82F6",
  },
} as const;

// Export individual color sets for convenience
export const chartColors = colors.chart;
export const pieChartColors = colors.pieChart;
export const uiColors = colors.ui;
export const statusColors = colors.status;
