import express from "express";
import * as userController from "../controllers/userController.js";
const userRoutes = express.Router();

userRoutes.post("/register", userController.registerUser);
userRoutes.post("/login", userController.loginUser);
userRoutes.post("/updateDetails", userController.updateUserDetails);
userRoutes.post("/deleteUser", userController.hideUser);

export default userRoutes;
