const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded.id;

    next();

  } catch (err) {

    console.log("AUTH ERROR:", err.message);

    res.status(401).json({
      message: "Invalid token",
    });

  }
};