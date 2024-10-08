const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const transactionRoutes = require("./routes/transaction");
const statisticsRoutes = require("./routes/statistics");
const barChartRoutes = require("./routes/barChart"); // Import bar chart route
const pieChartRoutes = require("./routes/pieChart"); // Import pie chart route
const combinedDataRoutes = require("./routes/combinedData"); // Import combined data route

app.use("/api", transactionRoutes);
app.use("/api", statisticsRoutes);
app.use("/api", barChartRoutes); // Use bar chart route
app.use("/api", pieChartRoutes); // Use pie chart route
app.use("/api", combinedDataRoutes); // Use combined data route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
