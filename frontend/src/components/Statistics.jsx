import React, { useState, useEffect } from "react";
import "./statistics.css";

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [totalSale, setTotalSale] = useState(null);
  const [totalSoldItems, setTotalSoldItems] = useState(null);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/sales/statistics?month=${selectedMonth}`
        );

        const data = await response.json();
        console.log("API Response Data: ", data);

        if (response.ok) {
          setTotalSale(data.totalSaleAmount);
          setTotalSoldItems(data.totalSoldItems);
          setTotalNotSoldItems(data.totalNotSoldItems);
        } else {
          throw new Error("Failed to fetch data from API");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch statistics. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="statistics-container">
      <h2>Statistics - {selectedMonth}</h2>

      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="month-dropdown"
      >
        {[
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
        ].map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Sale</td>
                <td>{totalSale}</td>
              </tr>
              <tr>
                <td>Total Sold Items</td>
                <td>{totalSoldItems}</td>
              </tr>
              <tr>
                <td>Total Not Sold Items</td>
                <td>{totalNotSoldItems}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Statistics;
