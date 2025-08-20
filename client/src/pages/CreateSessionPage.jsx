import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useGenerateQuestionsMutation } from "../redux/api/aiApi";
import { useCreateSessionMutation } from "../redux/api/sessionAPi";

const CreateSessionForm = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [generateQuestions] = useGenerateQuestionsMutation();
  const [createSession] = useCreateSessionMutation();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus,description } = formData;

    if (!isAuthenticated) {
      setError("You must be logged in to create a session.");
      return;
    }

    if (!role || !experience || !topicsToFocus || !description) {
      setError("Please fill all the required fields.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const questionResponse = await generateQuestions({
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      }).unwrap();

      const sessionResponse = await createSession({
        ...formData,
        user: user._id,
        questions: questionResponse,
      }).unwrap();

      const newId = sessionResponse?.session?._id;

      if (newId) {
        navigate(`/prep/${newId}`);
      } else {
        throw new Error("Session created, but no ID was returned.");
      }
    } catch (err) {
      setError(
        err.data?.message ||
          err.message ||
          "An error occurred while creating the session."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-lg p-6 sm:p-8 border border-opacity-second-light rounded-2xl bg-card-bg">
        <h3 className="text-lg font-semibold text-primary-text">
          Start a New Interview Journey
        </h3>
        <p className="text-xs text-secondary-text mt-1.5 mb-6">
          Fill out a few quick details and unlock your personalized set of
          interview questions!
        </p>

        <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
          <Input
            label="Target Role"
            placeholder="e.g., Frontend Developer"
            type="text"
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
          />
          <Input
            label="Years of Experience"
            placeholder="e.g., 3 years"
            type="text"
            value={formData.experience}
            onChange={(value) => handleChange("experience", value)}
          />
          <Input
            label="Topics to Focus On"
            placeholder="e.g., React, Node.js"
            type="text"
            value={formData.topicsToFocus}
            onChange={(value) => handleChange("topicsToFocus", value)}
          />
          <Input
            label="Description"
            placeholder="Any notes for this session"
            type="text"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
          
          />
          {error && <p className="text-red-500 text-xs -my-2">{error}</p>}

          <button
            type="submit"
            className={`text-button-text bg-primary-button-bg hover:bg-primary-button-bg-hover w-full py-3 font-semibold rounded-lg transition-colors ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating…" : "Create Session"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionForm;