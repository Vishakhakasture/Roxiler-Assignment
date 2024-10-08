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
const barChartRoutes = require("./routes/barChart");
const pieChartRoutes = require("./routes/pieChart");
const combinedDataRoutes = require("./routes/combinedData");

app.use("/api", transactionRoutes);
app.use("/api", statisticsRoutes);
app.use("/api", barChartRoutes);
app.use("/api", pieChartRoutes);
app.use("/api", combinedDataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
