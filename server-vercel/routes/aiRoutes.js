import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  askQuestion,
  generateConceptExplanation,
  generateInterviewQuestions,
} from "../controllers/aiControllers.js";

const router = express.Router();

router.use(protect);

router.post("/generate-questions", generateInterviewQuestions);
router.post("/generate-explanation", generateConceptExplanation);
router.post("/ask", askQuestion);

export default router;
