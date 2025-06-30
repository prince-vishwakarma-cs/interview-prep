import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/api";
import { axiosInstance } from "../../utils/axios";

export const CreateSessionForm = ({ onClose, onRefresh }) => {
  const {user}= useContext(UserContext)
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Optional: watch formData updates
  useEffect(() => {
  }, [formData]);


  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;


    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all the required fields.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        { role, experience, topicsToFocus, numberOfQuestions: 10 }
      );
      const generatedQuestions = aiResponse.data;


      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        user:user._id,role,
        questions: generatedQuestions,
      });


      const newId = response.data?.session?._id;
   if(newId) {
    if (onClose) onClose();      
if (onRefresh) onRefresh(); 
   }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "An error occurred while creating the session."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[50vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">
        Start a New Interview Journey
      </h3>
      <p className="text-xs text-slate-500 mt-[5px] mb-3">
        Fill out a few quick details and unlock your personalized set of
        interview questions!
      </p>
      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          label="Target Role"
          placeholder="e.g., Frontend Developer"
          type="text"
          value={formData.role}
          onChange={value => handleChange("role", value)}
        />
        <Input
          label="Years of Experience"
          placeholder="e.g., 3 years"
          type="number"
          value={formData.experience}
          onChange={value => handleChange("experience", value)}
        />
        <Input
          label="Topics to Focus On"
          placeholder="e.g., React, Node.js"
          type="text"
          value={formData.topicsToFocus}
          onChange={value => handleChange("topicsToFocus", value)}
        />
        <Input
          label="Description"
          placeholder="Any notes for this session"
          type="text"
          value={formData.description}
          onChange={value => handleChange("description", value)}
        />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating…" : "Create Session"}
        </button>
      </form>
    </div>
  );
};
