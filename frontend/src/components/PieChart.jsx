import React, { useEffect, useState, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./style.css";

Chart.register(
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [month, setMonth] = useState("January");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/sales/pie-chart?month=${month}`
        );
        const data = await response.json();
        console.log("Fetched Data:", data);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    getData();
  }, [month]);

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: chartData.map((item) => item._id),
          datasets: [
            {
              label: "Items Count by Category",
              data: chartData.map((item) => item.itemCount),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div className="chart-container">
      <h3>Pie Chart - Category Distribution</h3>

      <div>
        <label htmlFor="monthSelect">Month:</label>
        <select id="monthSelect" value={month} onChange={handleMonthChange}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>

      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
