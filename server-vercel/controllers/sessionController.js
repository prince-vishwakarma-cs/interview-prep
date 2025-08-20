import { Question } from "../models/Question.js";
import { Session } from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;

    if (
      !role ||
      !experience ||
      !topicsToFocus ||
      !description ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields. The 'questions' field must be a non-empty array.",
      });
    }

    const areAllQuestionsValid = questions.every(
      (q) => q && q.question && q.answer
    );

    if (!areAllQuestionsValid) {
      return res.status(400).json({
        success: false,
        message:
          "Each object in the 'questions' array must contain both a 'question' and an 'answer' field.",
      });
    }

    const userId = req.user.id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
      questions: [],
    });

    const questionsToCreate = questions.map((q) => ({
      session: session._id,
      question: q.question,
      answer: q.answer,
    }));

    const createdQuestions = await Question.insertMany(questionsToCreate);

    session.questions = createdQuestions.map((q) => q._id);
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while creating session." });
  }
};

export const getMySessions = async (req, res) => {
  try {
    // This was already correct.
    const sessions = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching sessions." });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: You are not authorized to view this session." });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching session." });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res
        .status(403) 
        .json({ success: false, message: "Not authorized to delete this session" });
    }
    
    await Question.deleteMany({ session: session._id });
    await Session.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting session." });
  }
};

export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Valid sessionId and a non-empty questions array are required." });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Forbidden: You do not own this session." });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json({
      success: true,
      message: "Questions added successfully",
      questions: createdQuestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while adding questions." });
  }
};

export const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('session');

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (question.session.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Forbidden: You cannot modify this question." });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating question." });
  }
};

export const updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id).populate('session');

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (question.session.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Forbidden: You cannot update this question." });
    }

    question.note = note || "";
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating note." });
  }
};