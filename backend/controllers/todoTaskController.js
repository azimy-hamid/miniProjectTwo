import TodoTask from "../models/TodoTask.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sequelize from "../config/dbConfig.js";

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
      where: { user_id_fk, hidden: 0 },
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
        hidden: 0,
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
        user_id_fk, // Ensure the task belongs to the user
      },
    });

    if (!task) {
      return res.status(404).json({ deleteTaskMessage: "Task not found." });
    }

    // Set the hidden field to 1 instead of deleting the task
    task.hidden = 1;
    await task.save(); // Save the changes to the task

    return res
      .status(200)
      .json({ deleteTaskMessage: "Task marked as deleted (hidden)." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while marking the task as deleted." });
  }
};

const getTaskCounts = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ getTaskCountsMessage: "Token is expired!" });
      }
      return res.status(401).json({ getTaskCountsMessage: "Invalid token!" });
    }

    const userId = decoded.userId;

    // Validate the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ getTaskCountsMessage: "User not found!" });
    }
    if (user.hidden === 1) {
      return res.status(400).json({
        getTaskCountsMessage: "User deleted! Recover your account first!",
      });
    }

    // Query for completed and incomplete task counts
    const counts = await TodoTask.findAll({
      where: { user_id_fk: userId, hidden: 0 }, // Make sure to consider only non-hidden tasks
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    const completedCount =
      counts.find((item) => item.dataValues.status === "complete")?.dataValues
        .count || 0;
    const incompleteCount =
      counts.find((item) => item.dataValues.status === "incomplete")?.dataValues
        .count || 0;

    return res.status(200).json({
      getTaskCountsMessage:
        "Number of completed and incomplete tasks retrieved successfully",
      numberOfCompletedAndIncompletedTasks: { completedCount, incompleteCount },
    });
  } catch (error) {
    console.error("Error fetching task counts:", error);
    return res.status(500).json({
      getTaskCountsMessage: "An error occurred while retrieving task counts.",
      getTaskCountsCatchBlockError: error,
    });
  }
};

const getTaskPriorityCounts = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ getTaskPriorityCountsMessage: "Token is expired!" });
      }
      return res
        .status(401)
        .json({ getTaskPriorityCountsMessage: "Invalid token!" });
    }

    const userId = decoded.userId;

    // Validate the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ getTaskPriorityCountsMessage: "User not found!" });
    }
    if (user.hidden === 1) {
      return res.status(400).json({
        getTaskPriorityCountsMessage:
          "User deleted! Recover your account first!",
      });
    }

    // Query for task counts by priority (low, medium, high)
    const counts = await TodoTask.findAll({
      where: { user_id_fk: userId, hidden: 0 }, // Only non-hidden tasks
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("priority")), "count"],
      ],
      group: ["priority"],
    });

    // Extract counts for each priority
    const lowPriorityCount =
      counts.find((item) => item.dataValues.priority === "low")?.dataValues
        .count || 0;
    const mediumPriorityCount =
      counts.find((item) => item.dataValues.priority === "medium")?.dataValues
        .count || 0;
    const highPriorityCount =
      counts.find((item) => item.dataValues.priority === "high")?.dataValues
        .count || 0;

    // Return the counts
    return res.status(200).json({
      getTaskPriorityCountsMessage:
        "Number of tasks by priority retrieved successfully",
      numberOfLowMediumAndHighPriorityTasks: {
        lowPriorityCount,
        mediumPriorityCount,
        highPriorityCount,
      },
    });
  } catch (error) {
    console.error("Error fetching task priority counts:", error);
    return res.status(500).json({
      getTaskPriorityCountsMessage:
        "An error occurred while retrieving task priority counts.",
      getTaskPriorityCountsCatchBlockError: error,
    });
  }
};

export {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskCounts,
  getTaskPriorityCounts,
};
