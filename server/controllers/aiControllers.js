import { GoogleGenAI } from "@google/genai";
import { conceptExplainPrompt, contextQuestionAnswerPrompt, questionAnswerPrompt } from "../utils/prompts.js";
import dotenv from "dotenv"

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {

    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    // if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Missing required fields" });
    // }

    if(!role) res.status(400).json({message:"Please provide role"})
    if(!experience) res.status(400).json({message:"Please provide experience"})
    if(!topicsToFocus) res.status(400).json({message:"Please provide topics to focus on"})
    if(!numberOfQuestions) res.status(400).json({message:"Please provide number of questions"})


    
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const response = await ai
      .models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents:prompt,
      });


    let rawText = response.text;
    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra spaces

    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explains an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai
      .models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents:prompt,
      });

    let rawText = response.text;

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra spaces

    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

export const askQuestion = async(req,res)=>{
   try {
    const { context,question} = req.body;

    if(!question) return res.status(400).json({success:false,message:"Please ask a valid question"})
    const prompt = contextQuestionAnswerPrompt(context,question);

    const response = await ai
      .models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents:prompt,
      });

    let rawText = response.text;

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra spaces

    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
}
