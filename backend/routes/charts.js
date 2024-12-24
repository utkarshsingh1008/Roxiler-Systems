const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();

router.get("/bar", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

  const ranges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    // Add more ranges as needed...
  ];

  const barData = ranges.map((r) => ({
    range: r.range,
    count: transactions.filter((t) => t.price >= r.min && t.price <= r.max).length,
  }));

  res.json(barData);
});

router.get("/pie", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

  const categories = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categories).map((key) => ({
    category: key,
    count: categories[key],
  }));

  res.json(pieData);
});

module.exports = router;
