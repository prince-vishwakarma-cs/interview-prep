import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext);

  // 1) While we’re fetching the profile, show a loader (or null)
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  }

  // 2) If not logged in, redirect to landing/login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3) If we have a user, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
