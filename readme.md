# Task Management App

## Overview

This is a comprehensive task management application that includes both a backend and a frontend. The backend, built using Node.js, Express, and Sequelize, provides a RESTful API for managing tasks with user authentication. The frontend, developed with React, offers a modern and user-friendly interface for task management.

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building the API.
- **Sequelize**: ORM for managing database operations.
- **MySQL**: Database for storing user and task data.
- **JSON Web Tokens (JWT)**: For user authentication.
- **Bcrypt.js**: For hashing user passwords.
- **dotenv**: For managing environment variables.
- **Cors**: For handling cross-origin requests.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Material-UI**: A popular React UI framework for implementing Material Design.
- **Nivo**: A data visualization library for rendering beautiful charts and graphs.
- **Axios**: For making HTTP requests to the back end.
- **Formik & Yup**: For form management and validation.

## Folder Structure

### Backend

```plaintext
/backend
│
├── config/
│ └── dbConfig.js # Database configuration
│
├── controllers/
│ ├── todoTaskController.js # Task-related business logic
│ └── userController.js # User-related business logic
│
├── middlewares/
│ └── authenticate.js # Middleware for authentication
│
├── models/
│ ├── TodoTask.js # TodoTask model definition
│ └── User.js # User model definition
│
├── routes/
│ ├── taskRoutes.js # Task-related routes
│ └── userRoutes.js # User-related routes
│
├── utils/
│ └── verifyUserToken.js # Utility for token verification
│
├── app.js # Main Express application file
├── server.js # Server entry point
├── package.json # Project metadata and dependencies
└── .env # Environment variables
```

### Frontend

```plaintext
frontend/
├── src/
│ ├── components/ # Contains reusable components
│ ├── pages/ # Different pages for the application
│ ├── services/ # Services calling the api endpoints
│ ├── App.js # Main application component
│ ├── index.css # Contains some css styling
│ ├── index.js # Application entry point
│ └── themes.js # Application theme primitives
├── .env # Environment variables
├── package.json # Project metadata and dependencies
└── README.md # Project documentation
```

## Environment Variables

### Backend

- **DB_HOST**: The hostname or IP address of the database server where your database is hosted.
- **DB_NAME**: The name of the specific database you want to connect to.
- **DB_USER**: The username used to authenticate to the database.
- **DB_PASS**: The password associated with the DB_USER.
- **DB_DIALECT**: The type of database you are using (e.g., MySQL).
- **PORT_NUMBER**: The port on which your server listens for incoming requests.
- **JWT_SECRET**: The secret key used to sign JSON Web Tokens.

### Frontend

- **REACT_APP_API_BASE_URL**: Base URL for the API, typically set to `http://localhost:8000`.

## API Endpoints

### User Endpoints

- **POST /user/register**: Register a new user.
- **POST /user/login**: Login an existing user.
- **PUT /user/updateUserDetails**: Update user details (requires authentication).
- **DELETE /user/deleteUser**: Delete (hide) a user (requires authentication).
- **GET /user/getUserDetails**: Get details of the authenticated user (requires authentication).

### Task Endpoints

- **GET /task/getAllTask**: Retrieve all tasks for the authenticated user (requires authentication).
- **POST /task/create**: Create a new task (requires authentication).
- **PUT /task/updateTask/**: Update an existing task by ID (requires authentication).
- **DELETE /task/deleteTask/**: Delete a task by ID (requires authentication).
- **GET /task/getTaskCounts**: Get counts of tasks for the authenticated user (requires authentication).
- **GET /task/getTaskPriorityCounts**: Get counts of tasks based on priority for the authenticated user (requires authentication).
- **GET /task/getAllTodayTasks**: Get all tasks due today for the authenticated user (requires authentication).

# Installation

## Backend

1. Clone the repository.
2. Navigate to the backend directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a .env file in the root directory and add your environment variables.
5. Start the server:

```bash
npm start
```

Frontend
Clone the repository.
Navigate to the frontend directory.
Install the dependencies:
bash
Copy code
npm install
Create a .env file in the root directory and add your API base URL:
plaintext
Copy code
REACT_APP_API_BASE_URL=http://localhost:8000
Start the development server:
bash
Copy code
npm start
Open your browser and navigate to http://localhost:3000 to view the application.

## Frontend

1. Clone the repository.
2. Navigate to the frontend directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a .env file in the root directory and add your API base URL:

```plaintext
REACT_APP_API_BASE_URL=http://localhost:8000
```

5. Start the development server:

```bash
npm start
```

6. Open your browser and navigate to http://localhost:3000 to view the application.

## Usage

- Use a tool like Postman or Insomnia to interact with the API endpoints for the backend.
- In the frontend, navigate the application using the sidebar or header navigation to access different sections.
- Forms throughout the application utilize validation to ensure data integrity. Fill out fields as needed and submit.
- View data visualizations powered by Nivo in relevant sections of the application.
- Access the calendar to view or add events using the FullCalendar component.

## Conclusion

This task management application provides a robust solution for managing tasks efficiently, emphasizing usability and intuitive design. The integration of both a backend and frontend allows users to seamlessly interact with their tasks, enhancing productivity and facilitating better decision-making.

## Future Improvements

- **Implement Password Recovery Functionality**: Allow users to reset their passwords securely through email verification.
- **Enhance the UI with Modern Themes and Customizations**: Provide users with customizable themes and layouts.
- **Introduce Task Reminders and Notifications**: Implement email or in-app notifications for important tasks.
- **Add Collaboration Features**: Enable users to share tasks or projects with team members.
- **Implement Subtasks and Task Dependencies**: Allow users to create subtasks and set dependencies for complex projects.
- **Develop Analytics and Reporting Tools**: Provide insights into user productivity through dashboards.
