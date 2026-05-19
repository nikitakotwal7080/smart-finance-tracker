const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    console.log(decoded);
    req.user = decoded.id;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};