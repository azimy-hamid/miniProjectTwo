import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { generateUniqueUUID } from "../utils/generateUniqueUUID.js";

dotenv.config();

// generic functions ----------------------------------------------
const checkUUIDExists = async (uuid) => {
  const existing = await User.findOne({
    where: {
      user_id_pk: uuid,
    },
  });

  return existing !== null; // Return true if UUID exists, false if not
};

const generateUniqueUUID = async () => {
  let uuid = uuidv4();
  let exists = await checkUUIDExists(uuid); // Initial check

  while (exists) {
    uuid = uuidv4(); // Generate a new UUID
    exists = await checkUUIDExists(uuid); // Check if the new UUID exists
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
        .sttus(400)
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

    let user_id_pk = generateUniqueUUID("user_id_pk");

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
        password: hashedPassword, // Store hashed password in the database
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

      return res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// login user controller

const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .sttus(400)
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
          [Sequelize.Op.or]: [{ username: username }, { email: email }],
        },
      });

      if (!user) {
        return res.sttus(400).json({
          loginUserError: "User Not Found! Please try again or sign up.",
        });
      }

      if (user.hidden === 1) {
        return res.sttus(400).json({
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
          loginUserError: "Incorrect Credentials! Please try again.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// upidate the user

const updateUserDetails = async (req, res) => {
  try {
    const token = req.header.authorization.split(" ", [1]);

    if (!token) {
      return res.status(401).json({ error: "Token is required!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { username, email, name, last_name } = req.body;

    if (!username && email && name && last_name) {
      return res
        .status(400)
        .json({ updateUserError: "At least one field must be updated!" });
    }

    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ updateUserError: "Enter a valid email address!" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ updateUserError: "User not found!" });
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      name: name || user.name,
      last_name: last_name || user.last_name,
    });

    return res
      .status(200)
      .json({ updateUserDone: "User details updated successfully!" });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating user details." });
  }
};

// delete the user

const hideUser = async (req, res) => {
  try {
    const token = req.header.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token is required!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

export { registerUser, loginUser, updateUserDetails, hideUser };
