const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    console.log("AUTH HEADER:", authHeader);
    console.log("JWT SECRET:", process.env.JWT_SECRET);

    if (!authHeader) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    console.log("TOKEN:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    req.user = decoded.id;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);

    res.status(401).json({
      message: "Invalid token",
    });
  }
};