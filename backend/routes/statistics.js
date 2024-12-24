const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();

router.get("/", async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });

  const totalSaleAmount = transactions.reduce((sum, item) => sum + (item.sold ? item.price : 0), 0);
  const totalSoldItems = transactions.filter((item) => item.sold).length;
  const totalNotSoldItems = transactions.filter((item) => !item.sold).length;

  res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
});

module.exports = router;
