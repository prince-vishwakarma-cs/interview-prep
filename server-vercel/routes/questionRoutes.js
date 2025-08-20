import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addQuestionsToSession,
  togglePinQuestion,
  updateQuestionNote,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);

export default router;
