import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { UserContext } from "../../context/userContext";
import { validateEmail } from "../../utils/helper";
import { axiosInstance } from "../../utils/axios";
import { API_PATHS } from "../../utils/api";

const SignUp = ({ setCurrentPage }) => {
  // const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    console.log(fullName)
    console.log(email)
    console.log(password)

    if (!fullName) {
      setError("Please enter full name.");
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      // if (profilePic) {
      //   const imgUploadRes = await uploadImage(profilePic);
      //   profileImageUrl = imgUploadRes?.imageUrl || "";
      // }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl:" ",
      });

      console.log(response)

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="w-[90vw] md:w-[50vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        {/* <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} /> */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={( value) => setFullName(value)}
            label="Full Name"
            placeholder="John"
            type="text"
          />

          <Input
            value={email}
            onChange={( value ) => setEmail(value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={( value ) => setPassword(value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          SIGN UP
        </button>
        <p className="text-[13px] text-slate-800 mt-3">
          Already an account?{" "}
          <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
