import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { Sequelize, Op } from "sequelize";

dotenv.config();

// generic functions ----------------------------------------------
const checkUUIDExists = async (uuid, field) => {
  const existing = await User.findOne({
    where: {
      [field]: uuid,
    },
  });

  return existing !== null; // Return true if UUID exists, false if not
};

const generateUniqueUUID = async (field) => {
  let uuid = uuidv4();
  let exists = await checkUUIDExists(uuid, field); // Initial check

  while (exists) {
    uuid = uuidv4(); // Generate a new UUID
    exists = await checkUUIDExists(uuid, field); // Check if the new UUID exists
  }

  return uuid;
};
// ------------------------------------------------------------

// register user controller

const registerUser = async (req, res) => {
  try {
    const { username, email, password, name, last_name } = req.body;

    if (!username || !email || !password || !name || !last_name) {
      return res
        .status(400)
        .json({ registerUserError: "All fields must be filled!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ registerUserError: "Enter a valid email address!" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        registerUserError:
          "Password not strong enough! Must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.",
      });
    }

    let user_id_pk = await generateUniqueUUID("user_id_pk");
    console.log(` the uuid: ${user_id_pk}`);
    if (
      user_id_pk &&
      username &&
      validator.isEmail(email) &&
      validator.isStrongPassword(password) &&
      name &&
      last_name
    ) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        user_id_pk,
        username,
        email,
        password: hashedPassword,
        name,
        last_name,
      });

      const token = jwt.sign(
        {
          userId: newUser.user_id_pk,
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(token);
      return res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({
      registerUserError:
        "An unexpected error occurred. Please try again later.",
      catchBlockErr: error,
    });
  }
};

// login user controller

const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ loginUserError: "All fields must be filled!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ loginUserError: "Enter a valid email address!" });
    }

    if (username && validator.isEmail(email) && password) {
      const user = await User.findOne({
        where: {
          username: username,
          email: email,
        },
      });

      if (!user) {
        return res.status(400).json({
          loginUserError: "User Not Found! Please try again or sign up.",
        });
      }

      if (user.hidden === 1) {
        return res.status(400).json({
          loginUserError: "User deleted! Recover your account first!",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            userId: user.user_id_pk,
            username: user.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({ token });
      } else {
        return res.status(400).json({
          loginUserError: "Incorrect Password.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      loginUserError: "An unexpected error occurred. Please try again later.",
      catchBlockErr: error,
    });
  }
};

// upidate the user
const updateUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ updateUserMessage: "Token is expired!" });
      }
      return res.status(401).json({ updateUserMessage: "Invalid token!" });
    }

    const userId = decoded.userId;

    const { username, email, name, last_name, password } = req.body;

    if (!username && !email && !name && !last_name && !password) {
      return res
        .status(400)
        .json({ updateUserMessage: "At least one field must be updated!" });
    }

    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ updateUserMessage: "Enter a valid email address!" });
    }

    if (password && !validator.isStrongPassword(password)) {
      return res.status(400).json({
        updateUserMessage:
          "Password not strong enough! Must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ updateUserMessage: "User not found!" });
    }

    if (user.hidden === 1) {
      return res.status(400).json({
        updateUserMessage: "User deleted! Recover your account first!",
      });
    }

    // If password is provided, hash it before saving
    let updatedPassword = user.password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      name: name || user.name,
      last_name: last_name || user.last_name,
      password: updatedPassword, // Update password if provided
    });

    return res
      .status(200)
      .json({ updateUserMessage: "User details updated successfully!" });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({
      updateUserMessage: "An error occurred while updating user details.",
      catchBlockErr: error,
    });
  }
};

// delete the user

const hideUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token is expired!" });
      }
      return res.status(401).json({ error: "Invalid token!" });
    }

    const userId = decoded.userId;

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ hideUserError: "User not found!" });
    }

    // Update the hidden field to 1
    await user.update({ hidden: 1 });

    return res
      .status(200)
      .json({ hideUserDone: "User account deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the user account." });
  }
};

const getUserDetails = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ getUserDetailsMessage: "Token is expired!" });
      }
      return res.status(401).json({ getUserDetailsMessage: "Invalid token!" });
    }

    const userId = decoded.userId;

    // Fetch the user details from the database
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ getUserDetailsMessage: "User not found!" });
    }

    // If user is hidden or deleted
    if (user.hidden === 1) {
      return res.status(400).json({
        getUserDetailsMessage: "User is deleted. Recover your account first!",
      });
    }

    // Return the user details (without password)
    const { username, email, name, last_name } = user;
    return res.status(200).json({
      user: {
        username,
        email,
        name,
        last_name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      getUserDetailsMessage: "An error occurred while getting user details.",
      getUserDetailsCatchBlockError: error,
    });
  }
};

export { registerUser, loginUser, updateUserDetails, hideUser, getUserDetails };
