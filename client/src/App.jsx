import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import LandingPage from "./pages/LandingPage";
import DashBoard from "./pages/home/DashBoard";
import InterviewPrep from "./pages/prep/InterviewPrep";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProvider from "./context/userContext";

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
