import React, { useState, useEffect } from "react";
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
import "./barChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [error, setError] = useState(null);

  const getData = async (month) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/bar-chart?month=${month}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data && Array.isArray(data)) {
        setBarChartData(data);
      } else {
        throw new Error("Invalid data structure received.");
      }
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    getData(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    console.log("barChartData:", barChartData);
  }, [barChartData]);

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
        data: [
          barChartData.find((item) => item._id === 0)?.itemCount || 0,
          barChartData.find((item) => item._id === 100)?.itemCount || 0,
          barChartData.find((item) => item._id === 200)?.itemCount || 0,
          barChartData.find((item) => item._id === 300)?.itemCount || 0,
          barChartData.find((item) => item._id === 400)?.itemCount || 0,
          barChartData.find((item) => item._id === 500)?.itemCount || 0,
          barChartData.find((item) => item._id === 600)?.itemCount || 0,
          barChartData.find((item) => item._id === 700)?.itemCount || 0,
          barChartData.find((item) => item._id === 800)?.itemCount || 0,
          barChartData.find((item) => item._id === 900)?.itemCount || 0,
        ],
        backgroundColor: "rgba(52, 152, 219, 0.6)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 20,
        },
        beginAtZero: true,
        min: 0,
        max: 100,
      },
    },
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">Bar Chart Stats - {selectedMonth}</h2>

      <select onChange={handleMonthChange} value={selectedMonth}>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>

      <Bar data={chartData} options={options} key={selectedMonth} />
    </div>
  );
};

export default BarChart;
