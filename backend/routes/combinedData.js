const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Your Transaction model

// Fetch Combined Data (All in One API)
router.get("/sales/combined-data", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1; // Convert month name to month number

    // Fetch Statistics
    const statistics = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          totalNotSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
          },
        },
      },
    ]);

    // Fetch Bar Chart Data
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

    // Fetch Pie Chart Data
    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          itemCount: 1,
        },
      },
    ]);

    if (
      statistics.length === 0 ||
      barChartData.length === 0 ||
      pieChartData.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "No data found for the selected month" });
    }

    const combinedData = {
      statistics: statistics[0],
      barChartData,
      pieChartData,
    };

    res.status(200).json(combinedData);
  } catch (err) {
    console.error("Error fetching combined data:", err);
    res.status(500).json({
      message: "Error fetching combined data",
      error: err.message,
    });
  }
});

module.exports = router;
