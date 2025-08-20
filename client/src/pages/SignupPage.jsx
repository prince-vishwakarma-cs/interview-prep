import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../components/Input";
import { useRegisterMutation } from "../redux/api/userApi";
import { validateEmail } from "../utils/helper";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await register({
        name: fullName,
        email,
        password,
      }).unwrap();
      toast.success("Account created successfully! Redirecting...");
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
          Create an Account
        </h3>
        <p className="mb-6 mt-1.5 text-xs text-secondary-text">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            value={fullName}
            onChange={(value) => setFullName(value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            disabled={isLoading}
          />

          <Input
            value={email}
            onChange={(value) => setEmail(value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            disabled={isLoading}
          />

          <Input
            value={password}
            onChange={(value) => setPassword(value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            disabled={isLoading}
          />
          {error && <p className="-my-2 text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className={`w-full rounded-lg py-3 font-semibold text-button-text bg-primary-button-bg transition-colors hover:bg-primary-button-bg-hover disabled:cursor-not-allowed disabled:opacity-60`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "SIGN UP"}
          </button>

          <p className="-mt-1 text-center text-sm text-primary-text">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary underline"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
