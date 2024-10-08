const mongoose = require("mongoose");

// Define the schema for a transaction
const transactionSchema = new mongoose.Schema({
  productId: String,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  category: String,
  sold: Boolean,
});

// Create and export the model
module.exports = mongoose.model("Transaction", transactionSchema);
