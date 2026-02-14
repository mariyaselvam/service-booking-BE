import express from "express";
import "express-async-errors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// LAST middleware
app.use(errorHandler);

export default app;
