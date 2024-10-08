const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/sales/pie-chart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;
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

    if (pieChartData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the selected month" });
    }

    res.status(200).json(pieChartData);
  } catch (err) {
    console.error("Error fetching pie chart data:", err);
    res.status(500).json({
      message: "Error fetching pie chart data",
      error: err.message,
    });
  }
});

module.exports = router;
