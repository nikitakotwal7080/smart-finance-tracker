const User = require("../models/User");
const Budget = require("../models/Budget");

exports.saveBudget = async (req, res) => {
  try {
    const { budget, year, month } = req.body;
    const userId = req.user;

    const updatedBudget = await Budget.findOneAndUpdate(
      { user: userId, year, month },
      { amount: budget },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await User.findByIdAndUpdate(userId, { budget }, { new: true });

    const history = await Budget.find({ user: userId }).sort({ year: 1, month: 1 });

    res.json({ amount: updatedBudget.amount, history });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user;

    const budgetDoc = await Budget.findOne({
      user: userId,
      year: Number(year),
      month: Number(month),
    });

    res.json({ amount: budgetDoc ? budgetDoc.amount : 0 });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getBudgetHistory = async (req, res) => {
  try {
    const userId = req.user;
    const history = await Budget.find({ user: userId }).sort({ year: 1, month: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};