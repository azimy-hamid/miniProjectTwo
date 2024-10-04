import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/task`;

const fetchAllTasks = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/getAllTask`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    const data = await response.data.tasks;

    return data;
  } catch (error) {
    console.error("Error getting the tasks:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const createTask = async (taskDetails) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/create`, taskDetails, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error("Error getting the tasks:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const updateTask = async (taskId, taskData) => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage

  try {
    // Make the PUT request to update the task
    const response = await axios.put(
      `${API_URL}/updateTask/${taskId}`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );
    return response.data; // Return the updated task data
  } catch (error) {
    console.error("Error updating task:", error); // Log the error for debugging
    throw error; // Re-throw the error to be handled by the calling function
  }
};

const deleteTask = async (taskId) => {
  const token = localStorage.getItem("token"); // Assuming you store the token in local storage

  try {
    const response = await axios.delete(`${API_URL}/deleteTask/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });
    return response.data; // Return response for further handling
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error(error.response?.data?.error || "Failed to delete task");
  }
};

const getTaskCounts = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/getTaskCounts`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error("Error getting the tasks:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const getTaskPriorityCounts = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/getTaskPriorityCounts`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error("Error getting the tasks:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const fetchAllTodayTasks = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/getAllTodayTasks`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    const data = await response.data.tasks;

    return data;
  } catch (error) {
    console.error("Error getting the tasks:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export {
  fetchAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskCounts,
  getTaskPriorityCounts,
  fetchAllTodayTasks,
};
