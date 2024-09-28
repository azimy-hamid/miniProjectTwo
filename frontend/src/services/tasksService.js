import axios from "axios";

const API_URL = "http://localhost:8000/task"; // Base URL of your API

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

export { fetchAllTasks, createTask };
