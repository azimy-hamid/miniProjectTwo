import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (token) => {
  if (!token) {
    throw new Error("No token provided.");
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token is expired!");
    }
    throw new Error("Invalid token!");
  }
};

const verifyUserToken = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Use the verifyToken utility function to decode the token
    const decoded = verifyToken(token);

    // Find the user by decoded userId from the token
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Return success with user data
    return res.status(200).json({
      success: true,
      message: "Token Verified -- Up to date",
    });
  } catch (error) {
    // Handle errors and return appropriate status
    return res.status(401).json({ error: error.message });
  }
};

export { verifyToken, verifyUserToken };
