import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfoCard from "./cards/ProfileInfoCard";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-divider  backdrop-blur-lg">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-semibold text-primary-text leading-tight">
              Interview Prep AI
            </h1>
          </Link>

          <div className="flex items-center">
            {isAuthenticated ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="text-sm font-semibold px-6 py-2.5 rounded-full bg-light-button-bg-color text-light-button-color transition-colors hover:bg-light-button-hover-bg-color hover:text-light-button-hover-color"
                onClick={() => navigate("/login")}
              >
                Login/SignUp
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
