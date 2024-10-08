const Transaction = require("../models/transaction");
const { initializeData } = require("../utils/fetchData");

// @desc   Initialize Database with data from third-party API
// @route  GET /api/transactions/initialize
exports.initializeDatabase = async (req, res) => {
  try {
    await initializeData(); // Fetch and seed the database
    res.status(200).json({ message: "Database initialized with seed data." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to initialize the database.",
      error: error.message,
    });
  }
};

// @desc   Create a new transaction
// @route  POST /api/transactions
exports.createTransaction = async (req, res) => {
  const { title, description, price, category, sold, dateOfSale } = req.body;

  if (!title || !price || !category || !dateOfSale) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newTransaction = new Transaction({
      title,
      description,
      price,
      category,
      sold,
      dateOfSale,
    });

    await newTransaction.save();

    res
      .status(201)
      .json({ message: "Transaction created successfully.", newTransaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create transaction.", error: error.message });
  }
};

// @desc   Get all transactions with search and pagination
// @route  GET /api/transactions
exports.getTransactions = async (req, res) => {
  const { search = "", page = 1, perPage = 10 } = req.query;

  const query = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search, $options: "i" } },
    ],
  };

  try {
    const totalTransactions = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json({
      transactions,
      total: totalTransactions,
      page: parseInt(page),
      perPage: parseInt(perPage),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions.", error: error.message });
  }
};

// @desc   Get statistics for a selected month
// @route  GET /api/transactions/stats/:month
exports.getStatistics = async (req) => {
  const { month } = req.params;
  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: month, $options: "i" },
    });

    const totalSales = transactions.reduce((acc, tx) => acc + tx.price, 0);
    const soldItems = transactions.filter((tx) => tx.sold).length;
    const notSoldItems = transactions.length - soldItems;

    return {
      totalSales,
      soldItems,
      notSoldItems,
    };
  } catch (error) {
    throw new Error("Error fetching statistics: " + error.message);
  }
};

// @desc   Get price range distribution for bar chart
// @route  GET /api/transactions/barchart/:month
exports.getPriceRangeDistribution = async (req) => {
  const { month } = req.params;
  const priceRanges = {
    "0-100": 0,
    "101-200": 0,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 0,
    "601-700": 0,
    "701-800": 0,
    "801-900": 0,
    "901-above": 0,
  };

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: month, $options: "i" },
    });

    transactions.forEach((tx) => {
      const price = tx.price;
      if (price <= 100) priceRanges["0-100"]++;
      else if (price <= 200) priceRanges["101-200"]++;
      else if (price <= 300) priceRanges["201-300"]++;
      else if (price <= 400) priceRanges["301-400"]++;
      else if (price <= 500) priceRanges["401-500"]++;
      else if (price <= 600) priceRanges["501-600"]++;
      else if (price <= 700) priceRanges["601-700"]++;
      else if (price <= 800) priceRanges["701-800"]++;
      else if (price <= 900) priceRanges["801-900"]++;
      else priceRanges["901-above"]++;
    });

    return priceRanges;
  } catch (error) {
    throw new Error(
      "Error fetching price range distribution: " + error.message
    );
  }
};

// @desc   Get category distribution for pie chart
// @route  GET /api/transactions/piechart/:month
exports.getCategoryDistribution = async (req) => {
  const { month } = req.params;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: month, $options: "i" },
    });

    const categoryCounts = transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + 1;
      return acc;
    }, {});

    return categoryCounts;
  } catch (error) {
    throw new Error("Error fetching category distribution: " + error.message);
  }
};

// @desc   Get combined response from all APIs (statistics, bar chart, pie chart)
// @route  GET /api/transactions/combined/:month
exports.getCombinedData = async (req, res) => {
  const { month } = req.params;

  try {
    const statistics = await this.getStatistics(req);
    const priceRange = await this.getPriceRangeDistribution(req);
    const categoryDistribution = await this.getCategoryDistribution(req);

    res.status(200).json({
      statistics,
      priceRange,
      categoryDistribution,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching combined data.", error: error.message });
  }
};
