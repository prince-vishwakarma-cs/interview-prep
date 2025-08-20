import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import aiRouter from "./routes/aiRoutes.js";
import authRoute from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { connectDB } from "./utils/db.js";
import { FRONTEND_URL, MONGO_URI, PORT } from "./utils/variables.js";

const app = express();
const port = PORT || 5000;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true
  })
);

app.use(express.json());
app.use(cookieParser())

app.use(async (req, res, next) => {
  try {
    await connectDB(MONGO_URI);
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai",aiRouter);

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: `Server is working fine on port ${port}`,
  })
);

export default app