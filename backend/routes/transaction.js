const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Make sure this path is correct

// List all transactions with search and pagination
router.get("/transactions", async (req, res) => {
  try {
    const { month, page = 1, perPage = 10, search = "" } = req.query;

    // Create a query object
    let query = {};

    // If a month is provided, we need to match the month part of dateOfSale
    if (month) {
      query = {
        $expr: {
          $eq: [
            { $month: "$dateOfSale" },
            new Date(Date.parse(month + " 1, 2000")).getMonth() + 1,
          ], // Convert month to number
        },
      };
    }

    let transactionsQuery = Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    // If search term is provided, apply regex search on title, description, and price
    if (search) {
      transactionsQuery = transactionsQuery.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { price: { $regex: search, $options: "i" } },
        ],
      });
    }

    // Execute the query
    const transactions = await transactionsQuery.exec();
    const totalRecords = await Transaction.countDocuments(query);

    // Send the response
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
