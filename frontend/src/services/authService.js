import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/user`;

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token); // Save token to localStorage
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token); // Save token to localStorage
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const updateUserDetails = async (userData) => {
  try {
    // Retrieve the token from local storage for authorization
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/updateUserDetails`, // Ensure this endpoint is designed for PUT requests
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );

    const data = response.data;
    return data; // Return the response data (success message or updated user data)
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const deleteUser = async () => {
  try {
    // Retrieve the token from local storage for authorization
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${API_URL}/deleteUser`, // Use DELETE method
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );

    const data = response.data;
    return data; // Return the response data (success message or updated user data)
  } catch (error) {
    console.error("Error deleting user account:", error); // Updated error message
    throw error; // Propagate the error to handle it where the function is called
  }
};

const getUserDetails = async (userData) => {
  try {
    // Retrieve the token from local storage for authorization
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/getUserDetails`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    const data = response.data;
    return data; // Return the response data (success message or updated user data)
  } catch (error) {
    console.error("Error getting user details:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const logout = () => {
  localStorage.removeItem("token"); // Remove the token
};

export {
  registerUser,
  loginUser,
  logout,
  updateUserDetails,
  deleteUser,
  getUserDetails,
};
