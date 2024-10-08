const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Existing GET routes
router.get("/initialize", transactionController.initializeDatabase);
router.get("/", transactionController.getTransactions);
router.get("/stats/:month", transactionController.getStatistics);
router.get("/barchart/:month", transactionController.getPriceRangeDistribution);
router.get("/piechart/:month", transactionController.getCategoryDistribution);
router.get("/combined/:month", transactionController.getCombinedData);

// New POST route for creating a transaction
router.post("/", transactionController.createTransaction);

module.exports = router;
