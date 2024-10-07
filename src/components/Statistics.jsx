// src/components/Statistics.js
import React, { useState, useEffect } from "react";
import "./statistics.css";

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [totalSale, setTotalSale] = useState("$100,000");
  const [totalSoldItems, setTotalSoldItems] = useState("55");
  const [totalNotSoldItems, setTotalNotSoldItems] = useState("15");

  // Mapping of month names to sales data
  const monthData = {
    January: { sale: "$80,000", sold: "40", notSold: "20" },
    February: { sale: "$90,000", sold: "45", notSold: "15" },
    March: { sale: "$70,000", sold: "30", notSold: "25" },
    April: { sale: "$110,000", sold: "60", notSold: "10" },
    May: { sale: "$95,000", sold: "50", notSold: "5" },
    June: { sale: "$100,000", sold: "55", notSold: "15" },
    July: { sale: "$120,000", sold: "65", notSold: "5" },
    August: { sale: "$130,000", sold: "70", notSold: "5" },
    September: { sale: "$85,000", sold: "35", notSold: "25" },
    October: { sale: "$150,000", sold: "80", notSold: "10" },
    November: { sale: "$160,000", sold: "85", notSold: "5" },
    December: { sale: "$175,000", sold: "90", notSold: "5" },
  };

  // Update statistics when the selected month changes
  useEffect(() => {
    const currentData = monthData[selectedMonth];
    if (currentData) {
      setTotalSale(currentData.sale);
      setTotalSoldItems(currentData.sold);
      setTotalNotSoldItems(currentData.notSold);
    }
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
        {Object.keys(monthData).map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <div className="stats-box">
        <div className="statistics-item">
          <strong>Total Sale:</strong> {totalSale}
        </div>
        <div className="statistics-item">
          <strong>Total Sold Item:</strong> {totalSoldItems}
        </div>
        <div className="statistics-item">
          <strong>Total Not Sold Item:</strong> {totalNotSoldItems}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
