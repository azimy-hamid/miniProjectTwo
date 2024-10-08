import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/dbConfig.js";
import User from "./models/User.js";
import TodoTask from "./models/TodoTask.js"; // Make sure this is imported

dotenv.config();

const syncDatabase = async () => {
  try {
    await sequelize.sync(); // You can use { force: true } during development to reset the tables
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database & tables:", error);
  }
};

const startServer = async () => {
  await syncDatabase();

  app.listen(process.env.PORT_NUMBER, () => {
    console.log(
      `Mini project Two backend Server running on port: ${process.env.PORT_NUMBER}`
    );
  });
};

startServer();
