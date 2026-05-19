const Expense = require("../models/Expense");

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.params.userId });
  res.json(expenses);
};

exports.addExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
};

exports.updateExpense = async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

exports.deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};