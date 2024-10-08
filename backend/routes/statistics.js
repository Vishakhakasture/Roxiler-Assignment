const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/sales/statistics", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;
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

    if (statistics.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the selected month" });
    }

    const { totalSaleAmount, totalSoldItems, totalNotSoldItems } =
      statistics[0];

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (err) {
    console.error("Error fetching sales statistics:", err);
    res.status(500).json({
      message: "Error fetching sales statistics",
      error: err.message,
    });
  }
});

module.exports = router;
