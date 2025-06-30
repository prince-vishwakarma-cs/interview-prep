import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import avatar from "./../../assets/avatar.svg";

const ProfileInfoCard = () => {
  const { user = {}, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    <div className="flex items-center">
      <img
        src={user?.avatar || avatar}
        alt="User Avatar"
        className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
      />
      <div>
        <div className="text-[15px] text-black font-bold leading-3 capitalize">
          {user.name || "Unnamed User"}
        </div>
        <button
          className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
