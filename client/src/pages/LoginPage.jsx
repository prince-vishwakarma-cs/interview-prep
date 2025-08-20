import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { validateEmail } from "../utils/helper";
import { useLoginMutation } from "../redux/api/userApi";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    try {
      await login({ email, password }).unwrap();
      toast.success("Login successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
     const errorMessage =
        err?.data?.error || "An unknown error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full min-w-[90vw] max-w-lg rounded-2xl border border-opacity-second-light bg-card-bg p-6 sm:p-8 md:min-w-125">
        <h3 className="text-lg font-semibold text-primary-text">
          Welcome Back
        </h3>
        <p className="mb-6 mt-1.5 text-xs text-secondary-text">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            value={email}
            onChange={(value) => setEmail(value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={(value) => setPassword(value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="-my-2 text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className={`w-full rounded-lg py-3 font-semibold text-button-text bg-primary-button-bg transition-colors hover:bg-primary-button-bg-hover ${
              isLoading ? "cursor-not-allowed opacity-75" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="-mt-1 text-center text-sm text-primary-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
