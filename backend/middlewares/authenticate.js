import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const authenticate = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    let decoded;
    try {
      // Verify the token using the secret key
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token is expired!" });
      }
      return res.status(401).json({ error: "Invalid token!" });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (user.hidden === 1) {
      return res.status(400).json({
        error: "User deleted! Recover your account first!",
      });
    }

    // Attach user to request for further use in routes
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong with authentication." });
  }
};

export default authenticate;
