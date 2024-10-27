# Task Management Restful API

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

- **DB_HOST**: The hostname or IP address of the database server where your database is hosted. This is used to establish a connection to the database.

- **DB_NAME**: The name of the specific database you want to connect to within the database server.

- **DB_USER**: The username used to authenticate and gain access to the database.

- **DB_PASS**: The password associated with the `DB_USER` for database authentication.

- **DB_DIALECT**: The type of database you are using (e.g., MySQL, PostgreSQL, SQLite, etc.). This informs the ORM (Object-Relational Mapping) tool how to interact with the database.

- **PORT_NUMBER**: The port on which your server listens for incoming requests. This is typically set to a default like 3000 or 4000, but can be configured as needed.

- **JWT_SECRET**: The secret key used to sign JSON Web Tokens (JWTs) for authentication and secure data transmission. It helps verify the authenticity of the tokens issued by your server.

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
