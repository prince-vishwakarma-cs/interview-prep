import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    topicsToFocus: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }],
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);