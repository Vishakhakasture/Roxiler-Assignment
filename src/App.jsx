import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import Statistics from "./components/Statistics";
import TransactionTable from "./components/TransactionTable";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const month = "June"; // This can be dynamically set based on the dropdown
  const totalSale = "$100,000"; // Example value
  const totalSoldItems = "55"; // Example value
  const totalNotSoldItems = "15";
  return (
    <Router>
      <div className="container mt-4">
        <h3 className="text-center mb-3">Roxiler</h3>

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              Roxiler
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/bar-chart">
                    Bar Chart
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/pie-chart">
                    Pie Chart
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/statistics">
                    Statistics
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/transactions">
                    Transactions
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/pie-chart" element={<PieChart />} />
          <Route
            path="/statistics"
            element={
              <Statistics
                month={month}
                totalSale={totalSale}
                totalSoldItems={totalSoldItems}
                totalNotSoldItems={totalNotSoldItems}
              />
            }
          />
          <Route path="/transactions" element={<TransactionTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
