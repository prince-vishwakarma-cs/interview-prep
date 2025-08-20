import { GoogleGenAI } from "@google/genai";
import {
  conceptExplainPrompt,
  contextQuestionAnswerPrompt,
  questionAnswerPrompt,
} from "../utils/prompts.js";
import { GEMINI_API_KEY } from "../utils/variables.js";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const generateAndParse = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
  });

  let rawText = response.text;
  const cleanedText = rawText
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();

  const data = JSON.parse(cleanedText);

  return data;
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Please provide a role." });
    }
    if (!experience) {
      return res.status(400).json({ message: "Please provide an experience level." });
    }
    if (!topicsToFocus) {
      return res.status(400).json({ message: "Please provide topics to focus on." });
    }
    if (!numberOfQuestions) {
      return res.status(400).json({ message: "Please provide the number of questions." });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const data = await generateAndParse(prompt);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate interview questions.",
      error: error.message,
    });
  }
};

export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Please provide a question." });
    }

    const prompt = conceptExplainPrompt(question);

    const data = await generateAndParse(prompt);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate concept explanation.",
      error: error.message,
    });
  }
};

export const askQuestion = async (req, res) => {
  try {
    const { context, question } = req.body;

    if (!context || !question) {
      return res.status(400).json({ message: "Please provide both context and a question." });
    }
    
    const prompt = contextQuestionAnswerPrompt(context, question);

    const data = await generateAndParse(prompt);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate an answer.",
      error: error.message,
    });
  }
};