import express from "express";
import * as taskController from "../controllers/todoTaskController.js";
import authenticate from "../middlewares/authenticate.js";

const taskRoutes = express.Router();

taskRoutes.get("/getAllTask", authenticate, taskController.getAllTasks);
taskRoutes.post("/create", authenticate, taskController.createTask);
taskRoutes.put("/updateTask/:taskId", authenticate, taskController.updateTask);
taskRoutes.delete(
  "/deleteTask/:taskId",
  authenticate,
  taskController.deleteTask
);

taskRoutes.get("/getTaskCounts", authenticate, taskController.getTaskCounts);
taskRoutes.get(
  "/getTaskPriorityCounts",
  authenticate,
  taskController.getTaskPriorityCounts
);

taskRoutes.get(
  "/getAllTodayTasks",
  authenticate,
  taskController.getAllTodayTasks
);

export default taskRoutes;
