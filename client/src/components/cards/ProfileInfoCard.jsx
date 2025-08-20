import { LogOut } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/slice/userSlice";
import avatar from "./../../assets/avatar.svg";

const ProfileInfoCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isHovered, setIsHovered] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleLogout}
      >
        <img
          src={avatar}
          alt="User Avatar"
          className={`w-11 h-11 bg-gray-300 rounded-full object-cover transition-all duration-300 ${
            isHovered ? "brightness-50" : ""
          }`}
        />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LogOut className="text-white" size={22} />
          </div>
        )}
      </div>

      <div>
        <div className="text-base text-black font-semibold leading-tight capitalize">
          {user.name || "Unnamed User"}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;