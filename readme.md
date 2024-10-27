
# Project Documentation for Todo App Backend

## Overview
This backend application is built using Node.js, Express, and Sequelize, providing a RESTful API for managing a todo application with user authentication and task management features.

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building the API.
- **Sequelize**: ORM for managing database operations.
- **MySQL**: Database for storing user and task data.
- **JSON Web Tokens (JWT)**: For user authentication.
- **Bcrypt.js**: For hashing user passwords.
- **dotenv**: For managing environment variables.
- **Cors**: For handling cross-origin requests.

## Folder Structure
```
/backend
│
├── config/
│   └── dbConfig.js            # Database configuration
│
├── controllers/
│   ├── todoTaskController.js   # Task-related business logic
│   └── userController.js       # User-related business logic
│
├── middlewares/
│   └── authenticate.js         # Middleware for authentication
│
├── models/
│   ├── TodoTask.js             # TodoTask model definition
│   └── User.js                  # User model definition
│
├── routes/
│   ├── taskRoutes.js           # Task-related routes
│   └── userRoutes.js           # User-related routes
│
├── utils/
│   └── verifyUserToken.js      # Utility for token verification
│
├── app.js                      # Main Express application file
├── server.js                   # Server entry point
├── package.json                # Project metadata and dependencies
└── .env                        # Environment variables
```

## Environment Variables
- **PORT_NUMBER**: The port on which the server runs.
- **JWT_SECRET**: The secret key used to sign JWT tokens.

## API Endpoints

**User Endpoints**
- **POST /user/register**: Register a new user.
- **POST /user/login**: Login an existing user.
- **PUT /user/updateUserDetails**: Update user details (requires authentication).
- **DELETE /user/deleteUser**: Delete (hide) a user (requires authentication).
- **GET /user/getUserDetails**: Get details of the authenticated user (requires authentication).

**Task Endpoints**
- **GET /task/getAllTask**: Retrieve all tasks for the authenticated user (requires authentication).
- **POST /task/create**: Create a new task (requires authentication).
- **PUT /task/updateTask/:taskId**: Update an existing task by ID (requires authentication).
- **DELETE /task/deleteTask/:taskId**: Delete a task by ID (requires authentication).
- **GET /task/getTaskCounts**: Get counts of tasks for the authenticated user (requires authentication).
- **GET /task/getTaskPriorityCounts**: Get counts of tasks based on priority for the authenticated user (requires authentication).
- **GET /task/getAllTodayTasks**: Get all tasks due today for the authenticated user (requires authentication).

## Installation
1. Clone the repository.
2. Navigate to the backend directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables.
5. Start the server:
   ```bash
   npm start
   ```

## Usage
- Use a tool like Postman or Insomnia to interact with the API endpoints.
- Ensure to include the JWT token in the Authorization header for protected routes.
