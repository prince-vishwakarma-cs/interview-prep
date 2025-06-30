import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import {
  askQuestion,
  generateConceptExplanation,
  generateInterviewQuestions,
} from "./controllers/aiControllers.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({ 
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB(process.env.MONGO_URI);

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);  
app.post("/api/ai/ask", protect, askQuestion);  

app.get("/", (req, res) => res.status(200).json({
    success:true,
    message:`Server is working fine on port ${port}`
}));

app.listen(port, () => console.log(`Server is running on port ${port}`));
