import React, { useState, useEffect } from "react";
import "./transactionTable.css";

const TransactionTable = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  // transaction data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/transactions?month=${selectedMonth}&page=${currentPage}&perPage=${perPage}`
        );
        const data = await response.json();

        setTransactions(data.transactions || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transactions. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, currentPage]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="transaction-table-container">
      <h2>Product Transaction</h2>

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
      )}

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-info">
          Page No: {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
        <span className="per-page">Per Page: {perPage}</span>
      </div>
    </div>
  );
};

export default TransactionTable;
