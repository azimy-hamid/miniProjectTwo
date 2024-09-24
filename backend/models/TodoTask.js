import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import User from "./User.js";

const TodoTask = sequelize.define(
  "TodoTask",
  {
    task_id_pk: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id_fk: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "user_id_pk",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("incomplete", "complete"),
      defaultValue: "incomplete",
    },
  },
  {
    tableName: "todo_tasks", // Specify the table name
    timestamps: true, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
  }
);

export default TodoTask;
