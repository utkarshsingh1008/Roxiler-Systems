const express = require("express");
const axios = require("axios");
const Transaction = require("../models/Transaction");
const router = express.Router();

// Initialize database
router.post("/init-database", async (req, res) => {
  try {
    const { data } = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    await Transaction.deleteMany(); // Clear database before seeding
    await Transaction.insertMany(data);
    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions with search and pagination
router.get("/", async (req, res) => {
  const { month, search = "", page = 1, per_page = 10 } = req.query;

  const startDate = new Date(`${month} 1`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const filter = {
    dateOfSale: { $gte: startDate, $lte: endDate },
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search, $options: "i" } },
    ],
  };

  const transactions = await Transaction.find(filter)
    .skip((page - 1) * per_page)
    .limit(Number(per_page));

  const total = await Transaction.countDocuments(filter);
  res.json({ transactions, total, page });
});

module.exports = router;
