import React, { useEffect, useState } from "react";
import { transformDataFrameJsonToRows } from "../utils/transform";
import rawDataFrameJson, { employeeData, countryData } from "../data/rawDataFrameJson";
import DataViewer from "./DataViewer";

const DemoPage: React.FC = () => {
  const [orderData, setOrderData] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const rowData = transformDataFrameJsonToRows(rawDataFrameJson);
    setOrderData(rowData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8 px-2">
          Reusable DataViewer Components
        </h1>

        {/* Employee Sales Performance */}
        <DataViewer
          title="Employee Sales Performance Summary"
          data={employeeData}
          className="mb-6 sm:mb-8"
        />

        {/* Country Orders */}
        <DataViewer
          title="Total Order Quantity by Country"
          data={countryData}
          className="mb-6 sm:mb-8"
        />

        {/* Order Data */}
        <DataViewer
          title="Order Management Dashboard"
          data={orderData}
        />
      </div>
    </div>
  );
};

export default DemoPage;