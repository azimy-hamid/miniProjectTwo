import TodoTask from "../models/TodoTask";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { generateUniqueUUID } from "../utils/generateUniqueUUID.js";

const getAllTasks = async (req, res) => {};

// create task

const createTask = async () => {
  try {
    const { title, description, priority, due_date, status } = req.body;
    const user_id_fk = req.userId; // Extract userId from authenticated request -- means the user should be logged in to create tasks
    const token = req.header.authorization.split(" ", [1]);

    if (!token) {
      return res.status(401).json({ error: "Token is required!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (
      !user_id_fk ||
      !title ||
      !description ||
      !priority ||
      !due_date ||
      !status
    ) {
      return res.status(400).json({
        createTaskMessage: "All fields must be filled!",
      });
    }
    let task_id_pk = generateUniqueUUID("task_id_pk");

    if (
      task_id_pk &&
      user_id_fk &&
      title &&
      description &&
      priority &&
      due_date &&
      status
    ) {
      const newTask = await TodoTask.create({
        task_id_pk,
        user_id_fk,
        title,
        description,
        priority,
        due_date,
        status,
      });
      return res.status(200).json({
        createTaskMessage: "Task created successfully",
        task: newTask,
      });
    }
  } catch (error) {}
};
