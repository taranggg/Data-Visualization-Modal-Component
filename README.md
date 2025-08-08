# Data Visualization Modal Component

A React TypeScript modal component for interactive data visualization with charts and tables, built with ECharts and modern UI components.

## Features

- 📊 Multiple chart types (Bar, Line, Area, Radar, Step, Pie)
- 📋 Interactive data table with search and column filtering
- 🎨 Responsive design with mobile-first approach
- 🔍 Smart column selection for optimal data visualization
- 📱 Touch-friendly interface
- 🎯 TypeScript support with full type safety

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **ECharts** (via echarts-for-react) for chart visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser with ES6+ support

### Standalone Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-visualization-modal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Integration as Component

### Option 1: Copy Components Directly

1. **Copy the required files to your project:**
   ```
   src/
   ├── components/
   │   ├── DataViewer.tsx
   │   ├── DataViewerChart.tsx
   │   ├── DataViewerTable.tsx
   │   └── DemoPage.tsx (optional)
   ├── constants/
   │   └── colors.ts
   ├── utils/
   │   └── transform.ts
   └── data/
       └── rawDataFrameJson.ts (sample data)
   ```

2. **Install required dependencies in your project:**
   ```bash
   npm install echarts echarts-for-react lucide-react
   # or
   yarn add echarts echarts-for-react lucide-react
   ```

3. **Ensure Tailwind CSS is configured** in your project with these classes used by the components

4. **Import and use the components:**
   ```tsx
   import { DataViewer } from './path/to/components/DataViewer';
   
   function MyApp() {
     const myData = [
       { name: 'Item A', value: 1000, category: 'Category 1' },
       { name: 'Item B', value: 1500, category: 'Category 2' },
       // ... your data
     ];
   
     return (
       <div>
         <DataViewer data={myData} />
       </div>
     );
   }
   ```

### Option 2: Package Installation (If Published)

```bash
npm install data-visualization-modal
# or
yarn add data-visualization-modal
```

Then import:
```tsx
import { DataViewer } from 'data-visualization-modal';
```

## Component API

### DataViewer Component

The main modal component that provides both chart and table views for data visualization.

#### Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `data` | `Record<string, unknown>[]` | Array of data objects to visualize | Yes |

#### Example Usage

```tsx
import { DataViewer } from './components/DataViewer';

const sampleData = [
  {
    "customer_name": "John Doe",
    "total_amount": 15000,
    "region": "North America",
    "status": "Active"
  },
  {
    "customer_name": "Jane Smith",
    "total_amount": 22000, 
    "region": "Europe",
    "status": "Active"
  }
];

function App() {
  return (
    <div className="p-4">
      <h1>Data Visualization</h1>
      <DataViewer data={sampleData} />
    </div>
  );
}
```

### DataViewerChart Component

Standalone chart component for data visualization.

#### Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `data` | `Record<string, unknown>[]` | Array of data objects | Yes |

#### Features

- **Smart Column Selection**: Automatically selects the most relevant columns for X and Y axes
- **Multiple Chart Types**: Bar, Line, Area, Radar, Step, and Pie charts
- **Interactive Controls**: Dropdown selectors for chart type and axis columns
- **Responsive Design**: Adapts to different screen sizes

### DataViewerTable Component

Standalone table component for data display.

#### Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `data` | `Record<string, unknown>[]` | Array of data objects | Yes |

#### Features

- **Search Functionality**: Filter data across all columns
- **Column Management**: Show/hide columns with interactive controls
- **Responsive Design**: Mobile-friendly with horizontal scrolling
- **Fixed Height Container**: Matches chart container dimensions
- **Sticky Header**: Header remains visible during scrolling

## Data Format

The components expect data in the following format:

```typescript
type DataRow = Record<string, unknown>;
type Data = DataRow[];

// Example:
const data = [
  {
    "item_name": "Product Alpha",
    "quantity": 150,
    "category": "Electronics",
    "date": "2024-01-15"
  },
  // ... more rows
];
```

### Column Naming Conventions

The components work with any column names, but have smart defaults for common patterns:

**For Charts (Y-axis priority):**
- `total`, `amount`, `value`, `quantity`, `count`, `sales`, `revenue`, `price`

**For Charts (X-axis priority):**
- `name`, `title`, `label`, `category`, `type`, `region`, `status`

**Column Name Processing:**
- Removes `O_` prefixes (e.g., `O_item_name` → `item name`)
- Converts underscores to spaces
- Capitalizes first letters for display

## Styling and Customization

### Colors

Colors are centralized in `src/constants/colors.ts`:

```typescript
export const colors = {
  primary: "#dc2626", // Red-600
  secondary: "#7c3aed", // Violet-600
  // ... more colors
};

export const chartColors = {
  primary: "#dc2626",
  secondary: "#7c3aed", 
  areaFill: "rgba(220, 38, 38, 0.1)"
};

export const pieChartColors = [
  "#dc2626", "#7c3aed", "#059669", 
  // ... more colors
];
```

### Customizing Styles

The components use Tailwind CSS classes. To customize:

1. **Modify colors.ts** for color scheme changes
2. **Update className props** in component files for layout changes
3. **Override Tailwind classes** in your project's CSS

### Chart Customization

Charts use ECharts configuration. Key customization points:

- **Chart Options**: Modify `getChartOptions()` function in `DataViewerChart.tsx`
- **Responsive Behavior**: Adjust grid, legend, and axis configurations
- **Color Schemes**: Update chart color arrays in `colors.ts`

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Development Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Common Issues

1. **Charts not rendering:**
   - Ensure `echarts` and `echarts-for-react` are installed
   - Check that data format matches expected structure

2. **Styles not applying:**
   - Verify Tailwind CSS is configured in your project
   - Check that all required Tailwind classes are available

3. **TypeScript errors:**
   - Ensure TypeScript version compatibility
   - Check that all dependencies have type definitions

4. **Performance with large datasets:**
   - Consider implementing pagination for tables with 1000+ rows
   - Use data aggregation for charts with many data points

### Support

For issues and questions:
- Check existing GitHub issues
- Create new issue with minimal reproduction example
- Include browser/environment details

---

**Built with ❤️ using React, TypeScript, and ECharts**
