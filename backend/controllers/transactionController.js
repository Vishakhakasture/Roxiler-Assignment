const axios = require("axios");
const Transaction = require("../models/transaction");

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.insertMany(transactions);
    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ message: "Failed to initialize database" });
  }
};

exports.listTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search = "" } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  const regex = new RegExp(search, "i");
  const startOfMonth = new Date(
    `${new Date().getFullYear()}-${month}-01T00:00:00Z`
  );
  const endOfMonth = new Date(
    new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
  );

  const filter = {
    dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
    $or: [{ title: regex }, { description: regex }, { price: regex }],
  };

  try {
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

exports.statistics = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  const startOfMonth = new Date(
    `${new Date().getFullYear()}-${month}-01T00:00:00Z`
  );
  const endOfMonth = new Date(
    new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
  );

  try {
    const totalSales = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
          totalSold: { $sum: 1 },
        },
      },
    ]);

    const totalNotSold = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
          sold: false,
        },
      },
      { $group: { _id: null, totalNotSold: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalSales: totalSales[0] ? totalSales[0].totalAmount : 0,
      totalSold: totalSales[0] ? totalSales[0].totalSold : 0,
      totalNotSold: totalNotSold[0] ? totalNotSold[0].totalNotSold : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

exports.barChartData = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901+", min: 901, max: Infinity },
  ];

  const startOfMonth = new Date(
    `${new Date().getFullYear()}-${month}-01T00:00:00Z`
  );
  const endOfMonth = new Date(
    new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
  );

  const barChartData = [];

  for (const range of priceRanges) {
    const count = await Transaction.countDocuments({
      dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      price: { $gte: range.min, $lte: range.max },
    });
    barChartData.push({ range: range.range, count });
  }

  res.status(200).json(barChartData);
};

exports.pieChartData = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  const startOfMonth = new Date(
    `${new Date().getFullYear()}-${month}-01T00:00:00Z`
  );
  const endOfMonth = new Date(
    new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
  );

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json(pieChartData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pie chart data" });
  }
};
