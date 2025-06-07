import React, { useEffect, useState } from 'react';
import { RadialChart } from 'react-vis';

const DeliveryStatus = ({ orders = [] }) => {
  const [chartData, setChartData] = useState([]);

  // Effect to update chart data when orders change
  useEffect(() => {
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Define colors for each status
    const statusColors = {
      Delivered: '#4caf50',  // Green
      Pending: '#ff9800',     // Orange
      Received: '#f44336',    // Red
      Processing: '#2196f3',  // Blue
      Shipped: '#9c27b0',     // Purple
      OntheWay: '#9e9e9e',
      Shipping: "#abc543",
    };

    const labelColors = {
      Delivered: '#ffffff',  // White
      Pending: '#ffffff',     // White
      Canceled: '#ffffff',    // White
      Processing: '#ffffff',  // White
      Shipped: '#ffffff',     // White
      Unknown: '#000000',      // Black for unknown status
    };

    const newChartData = Object.entries(statusCount).map(([status, count]) => ({
      angle: count,
      label: status,
      color: statusColors[status] || '#ff9ab0', // Default to black if status is not found
      labelColor: labelColors[status] || '#abc112' // Color for label
    }));

    setChartData(newChartData);
  }, [orders]);

  // Check if orders are available
  if (!orders || orders.length === 0) {
    return <div className="text-center text-gray-500">No orders available</div>; // Optional: Display a message if no orders
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
      <h3 className="text-red-500 text-2xl font-Poppins pb-2">Order Status Distribution</h3>
      <RadialChart
        data={chartData}
        width={300}
        height={300}
        showLabels
        labelsRadiusMultiplier={1.1}
        colorType="literal" // Use the color provided in the data
        labelStyle={(d) => ({
          fill: d.labelColor || '#000000', // Set the label color based on the data
          fontWeight: 'bold', // Make the label bold
          transition: 'all 0.3s ease', // Add transition for smooth animation
        })}
      />
      <div className="mt-4 flex flex-col space-y-2">
        {chartData.map((data) => (
          <div key={data.label} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.color }}
            ></div>
            <span className="ml-2 text-lg">{data.label}: {data.angle} orders</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryStatus;
