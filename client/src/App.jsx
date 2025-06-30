import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import UserProvider from "./context/userContext";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import DashBoard from "./pages/home/DashBoard";
import LandingPage from "./pages/LandingPage";
import InterviewPrep from "./pages/prep/InterviewPrep";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setCurrentPage={() => {}} />} />
          <Route path="/signup" element={<SignUp setCurrentPage={() => {}} />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/prep/:id" element={<InterviewPrep />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          toastOptions={{
            style: { fontSize: "14px" },
          }}
        />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
