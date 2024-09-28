import TodoTask from "../models/TodoTask.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

// generic functions ----------------------------------------------

const checkUUIDExists = async (uuid, field) => {
  const existing = await TodoTask.findOne({
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

// get all the tasks for a specific user

const getAllTasks = async (req, res) => {
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

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ getAllTasksUserError: "User not found!" });
    }

    if (user.hidden === 1) {
      return res.status(400).json({
        getAllTasksUserError: "User deleted! Recover your account first!",
      });
    }

    const user_id_fk = userId; // Extract userId from authenticated request

    if (!userId) {
      return res.status(404).json({
        getAllTasksError: "User not found!",
      });
    }

    const tasks = await TodoTask.findAll({
      where: { user_id_fk },
      order: [["due_date", "ASC"]], // Optional: Order by due date
    });

    return res.status(200).json({
      getAllTasksMessage: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving tasks." });
  }
};

// create task

const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date, status } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ createTaskMessage: "Token is expired!" });
      }
      return res.status(401).json({ createTaskMessage: "Invalid token!" });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ createTaskMessage: "User not found!" });
    }

    if (user.hidden === 1) {
      return res.status(400).json({
        createTaskMessage: "User deleted! Recover your account first!",
      });
    }

    const user_id_fk = decoded.userId;

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
    let task_id_pk = await generateUniqueUUID("task_id_pk");

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
  } catch (error) {
    return res.status(500).json({
      createTaskMessage: "An error occured while creating the task.",
      createTaskCatchBlockError: error,
    });
  }
};

// update a task

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Get the task ID from the request parameters
    const task_id_pk = taskId;

    const { title, description, priority, due_date, status } = req.body;

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

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ getAllTasksUserError: "User not found!" });
    }

    if (user.hidden === 1) {
      return res.status(400).json({
        getAllTasksUserError: "User deleted! Recover your account first!",
      });
    }

    const user_id_fk = decoded.userId;

    // Find the task by ID
    const task = await TodoTask.findOne({
      where: {
        task_id_pk,
        user_id_fk: user_id_fk, // Ensure that the user is trying to update their own task
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Update task fields
    const updatedTask = await task.update({
      title: title ?? task.title, // Only update if provided
      description: description ?? task.description,
      priority: priority ?? task.priority,
      due_date: due_date ?? task.due_date,
      status: status ?? task.status,
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the task." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Get the task ID from the request parameters
    const task_id_pk = taskId;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token is required!" });
    }

    // Verify the token and handle potential errors
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token is expired!" });
      }
      return res.status(401).json({ error: "Invalid token!" });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ getAllTasksUserError: "User not found!" });
    }

    if (user.hidden === 1) {
      return res.status(400).json({
        getAllTasksUserError: "User deleted! Recover your account first!",
      });
    }

    const user_id_fk = decoded.userId;

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await TodoTask.findOne({
      where: {
        task_id_pk,
        user_id_fk: user_id_fk, // Ensure the task belongs to the user
      },
    });

    if (!task) {
      return res.status(404).json({ deleteTaskMessage: "Task not found." });
    }

    // Delete the task
    await task.destroy();

    return res
      .status(200)
      .json({ deleteTaskMessage: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the task." });
  }
};

export { getAllTasks, createTask, updateTask, deleteTask };
