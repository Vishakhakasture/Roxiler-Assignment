import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./barChart.css"; // Importing the CSS file

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, month }) => {
  const chartData = {
    labels: [
      "0-100",
      "101-200",
      "201-300",
      "301-400",
      "401-500",
      "501-600",
      "601-700",
      "701-800",
      "801-900",
      "901 above",
    ],
    datasets: [
      {
        label: "Number of Items",
        data: data, // This will be an array with the count of items in each range
        backgroundColor: "rgba(52, 152, 219, 0.6)", // Light blue color for the bars
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 20, // Set the interval between ticks
        },
        beginAtZero: true, // Ensure the y-axis starts at zero
        min: 0, // Minimum value
        max: 100, // Maximum value
      },
    },
  };

  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">Bar Chart Stats - {month}</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
