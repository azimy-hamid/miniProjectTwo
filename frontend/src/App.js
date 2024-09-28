import React, { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "./themes.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import LoginForm from "./pages/loginForm/index.jsx";
import SignupForm from "./pages/signupForm/index.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import UpdateUserForm from "./pages/updateUserDetailsForm/index.jsx";
import Tasks from "./pages/allTasksTable/index.jsx";
import CreateTaskForm from "./pages/createTaskForm/index.jsx";

const API_URL = "http://localhost:8000/verifyToken"; // Base URL of your API

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state

  useEffect(() => {
    const token = localStorage.getItem("token");

    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}`, {
            headers: { Authorization: `Bearer ${token}` }, // Send token in headers
          });
          if (response.data.success) {
            setIsAuthenticated(true); // Token is valid
          } else {
            setIsAuthenticated(false); // Token is invalid
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setIsAuthenticated(false); // Verification error means not authenticated
        }
      } else {
        setIsAuthenticated(false); // No token means not authenticated
      }
    };

    verifyToken();
  }, []);

  // Show a loading state while verifying the token
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a spinner/loading component
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <SignupForm />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
              />

              <Route
                path="/updateUserDetails"
                element={
                  isAuthenticated ? <UpdateUserForm /> : <Navigate to="/" />
                }
              />

              <Route
                path="/getAllTask"
                element={isAuthenticated ? <Tasks /> : <Navigate to="/" />}
              />

              <Route
                path="/createTask"
                element={
                  isAuthenticated ? <CreateTaskForm /> : <Navigate to="/" />
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
