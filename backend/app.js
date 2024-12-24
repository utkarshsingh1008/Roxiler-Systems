const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const initRoutes = require("./routes/transactions");
const statsRoutes = require("./routes/statistics");
const chartRoutes = require("./routes/charts");
const combinedRoutes = require("./routes/combined");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = require("./config/database");
connectDB();

// Routes
app.use("/api/transactions", initRoutes);
app.use("/api/statistics", statsRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/combined", combinedRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
