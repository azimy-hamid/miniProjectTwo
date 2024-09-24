import express from "express";
import * as taskController from "../controllers/todoTaskController.js";
const taskRoutes = express.Router();

taskRoutes.get("/getAllTask", taskController.getAllTasks);
taskRoutes.post("/create", taskController.createTask);
taskRoutes.put("/updateTask/:taskId", taskController.updateTask);
taskRoutes.delete("/deleteTask/:taskId", taskController.deleteTask);

export default taskRoutes;
