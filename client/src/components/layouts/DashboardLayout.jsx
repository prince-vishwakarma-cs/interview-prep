import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-full">
      <Navbar/>
      {user && <div className="min-h-full">{children}</div>}
    </div>
  );
};

export default DashboardLayout;