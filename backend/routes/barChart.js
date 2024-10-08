const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Your Transaction model

// Get Bar Chart Data (Price Ranges and Item Count)
router.get("/sales/bar-chart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1; // Convert month name to month number

    const barChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0,
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            Number.MAX_VALUE,
          ],
          default: "Other",
          output: {
            itemCount: { $sum: 1 },
          },
        },
      },
    ]);

    if (barChartData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the selected month" });
    }

    res.status(200).json(barChartData);
  } catch (err) {
    console.error("Error fetching bar chart data:", err);
    res.status(500).json({
      message: "Error fetching bar chart data",
      error: err.message,
    });
  }
});

module.exports = router;
