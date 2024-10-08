import React, { useState, useEffect } from "react";
import "./transactionTable.css";

const TransactionTable = () => {
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [transactions, setTransactions] = useState([]);

  const monthTransactions = {
    January: [
      {
        id: 1,
        title: "Item A",
        description: "Description A",
        price: "$10",
        category: "Category A",
        sold: "Yes",
        image: "imageA.png",
      },
      {
        id: 2,
        title: "Item B",
        description: "Description B",
        price: "$20",
        category: "Category B",
        sold: "No",
        image: "imageB.png",
      },
    ],
    February: [
      {
        id: 3,
        title: "Item C",
        description: "Description C",
        price: "$15",
        category: "Category C",
        sold: "Yes",
        image: "imageC.png",
      },
      {
        id: 4,
        title: "Item D",
        description: "Description D",
        price: "$25",
        category: "Category D",
        sold: "No",
        image: "imageD.png",
      },
    ],
    March: [
      {
        id: 5,
        title: "Item E",
        description: "Description E",
        price: "$30",
        category: "Category E",
        sold: "Yes",
        image: "imageE.png",
      },
      {
        id: 6,
        title: "Item F",
        description: "Description F",
        price: "$40",
        category: "Category F",
        sold: "No",
        image: "imageF.png",
      },
    ],
    June: [
      {
        id: 7,
        title: "Item G",
        description: "Description G",
        price: "$35",
        category: "Category G",
        sold: "Yes",
        image: "imageG.png",
      },
      {
        id: 8,
        title: "Item H",
        description: "Description H",
        price: "$45",
        category: "Category H",
        sold: "No",
        image: "imageH.png",
      },
    ],
  };

  useEffect(() => {
    setTransactions(monthTransactions[selectedMonth] || []);
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="transaction-table-container">
      <h2>Product Transaction</h2>
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="month-dropdown"
      >
        {Object.keys(monthTransactions).map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold}</td>
                <td>
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="transaction-image"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                No transactions available for the selected month.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <span className="page-info">Page No: 1</span> {/* Left aligned */}
        <button>Previous</button>
        <div> - </div>
        <button>Next</button>
        <span className="per-page">Per Page: 10</span>
      </div>
    </div>
  );
};

export default TransactionTable;
