import express, { response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { verifyUserToken } from "./utils/verifyUserToken.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  try {
    res
      .status(200)
      .json({ response: "This is the root end point for todo app" });
  } catch (error) {
    res.status(500).json({ rootEndpointError: error });
  }
});

app.get("/verifyToken", verifyUserToken);

app.use("/user", userRoutes);
app.use("/task", taskRoutes);

export default app;
