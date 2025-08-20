import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, isAuthenticated } = useSelector((state)=>state.user)
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">Loading…</div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
