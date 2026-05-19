const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { saveBudget, getBudget, getBudgetHistory } = require("../controllers/budgetController");

router.get("/", authMiddleware, getBudget);
router.get("/history", authMiddleware, getBudgetHistory);
router.post("/", authMiddleware, saveBudget);

module.exports = router;