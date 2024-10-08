const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Make sure this path is correct

router.get("/transactions", async (req, res) => {
  try {
    const { month, page = 1, perPage = 10, search = "" } = req.query;

    let query = {};

    if (month) {
      query = {
        $expr: {
          $eq: [
            { $month: "$dateOfSale" },
            new Date(Date.parse(month + " 1, 2000")).getMonth() + 1,
          ],
        },
      };
    }

    let transactionsQuery = Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    if (search) {
      transactionsQuery = transactionsQuery.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { price: { $regex: search, $options: "i" } },
        ],
      });
    }

    const transactions = await transactionsQuery.exec();
    const totalRecords = await Transaction.countDocuments(query);

    res.status(200).json({
      page: parseInt(page),
      perPage: parseInt(perPage),
      totalRecords: totalRecords,
      transactions: transactions,
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({
      message: "Error fetching transactions",
      error: err.message,
    });
  }
});

module.exports = router;
