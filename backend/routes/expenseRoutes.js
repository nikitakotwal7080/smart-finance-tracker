const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ADD EXPENSE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, category, notes, date } = req.body;

    const expense = await Expense.create({
      user: req.user,
      amount,
      category,
      notes,
      date,
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// GET ALL USER EXPENSES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// UPDATE EXPENSE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { amount, category, notes, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { amount, category, notes, date },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE EXPENSE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user });

    res.json({
      message: "Expense deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;