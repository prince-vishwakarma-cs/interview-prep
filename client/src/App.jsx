import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import CreateSessionForm from "./pages/CreateSessionPage";
import DashBoard from "./pages/DashBoardPage";
import InterviewPrep from "./pages/InterviewPrep";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import { useGetUserProfileQuery } from "./redux/api/userApi";

const App = () => {
  const { isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-session" element={<CreateSessionForm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/prep/:id" element={<InterviewPrep />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        toastOptions={{
          style: { fontSize: "14px" },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
