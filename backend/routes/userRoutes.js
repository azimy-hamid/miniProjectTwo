import express from "express";
import * as userController from "../controllers/userController.js";
import authenticate from "../middlewares/authenticate.js";
const userRoutes = express.Router();

userRoutes.post("/register", userController.registerUser);
userRoutes.post("/login", userController.loginUser);
userRoutes.put(
  "/updateUserDetails",
  authenticate,
  userController.updateUserDetails
);
userRoutes.delete("/deleteUser", authenticate, userController.hideUser);

export default userRoutes;
