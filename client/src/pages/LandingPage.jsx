import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import { APP_FEATURES } from "../utils/data"; // Assuming this path and data structure are correct
import Modal from "../components/Modal";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/cards/ProfileInfoCard"; // Assuming this component is responsive
import mockup from "./../assets/mockup.svg";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-[#FFFCEF] relative overflow-hidden">
        {/* Decorative blur element - adjusted for responsiveness */}
        <div className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-amber-200/20 blur-[40px] sm:blur-[50px] md:blur-[65px] absolute top-[-50px] left-[-50px] sm:top-0 sm:left-0 z-0" />

        <div className="container max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-16 sm:pb-20 md:pb-[100px] relative z-10">
          <header className="flex justify-between items-center mb-8 sm:mb-12 md:mb-16">
            <div className="text-lg sm:text-xl text-black font-semibold">Interview Prep</div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#E99A4B] text-xs sm:text-sm font-semibold text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                onClick={() => setOpenAuthModal(true)}
              >
                Login/SignUp
              </button>
            )}
          </header>

          {/* Hero Text Section */}
          <div className="flex flex-col justify-center items-center text-center"> {/* Centered text */}
            <div className="w-full md:w-3/4 lg:w-2/3 mx-auto mb-8"> {/* Adjusted width and margin */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black font-medium mb-4 sm:mb-6 leading-tight">
                Ace Interviews with <br/>
                <span className="text-transparent bg-clip-text p-1 my-1 sm:my-2 px-2 sm:px-4 md:px-6 bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold inline-block"> {/* inline-block for proper padding application */}
                  <LuSparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#ff9324] inline mr-1 sm:mr-2" /> {/* Adjusted icon size & margin */}
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-3/4 lg:w-1/2 mx-auto"> {/* Adjusted width */}
              <p className="text-sm sm:text-base md:text-[17px] text-gray-700 mb-8"> {/* Slightly adjusted text size and color for readability */}
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery — your ultimate interview toolkit is
                here.
              </p>
              <button
                className="bg-black text-xs sm:text-sm font-semibold text-white px-5 py-2 sm:px-6 sm:py-2.5 md:px-7 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Mockup Image Section */}
        <div className="w-full flex justify-center py-8 sm:py-10 relative z-10">
          <section className="container mx-auto px-4 flex justify-center cursor-pointer" onClick={handleCTA}>
            <img
              src={mockup}
              alt="App Mockup" /* More descriptive alt text */
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-3xl" /* Adjusted max-width for better scaling */
            />
          </section>
        </div>

        {/* Features Section */}
        <div className="w-full mx-auto bg-[#fffcef00] max-w-7xl"> {/* bg is transparent, can remove if not needed */}
          <div className="container mx-auto px-4 pt-8 sm:pt-10 pb-12 sm:pb-16 md:pb-20">
            <section className="mt-5">
              <h2 className="text-xl sm:text-2xl font-medium text-center mb-8 sm:mb-10 md:mb-12">
                Features That Make You Shine
              </h2>
              {/* Responsive grid for features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
                {APP_FEATURES.map((feature) => ( // Simplified to one map if APP_FEATURES has 5 or 6 items, or adjust slicing as needed
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-4 sm:p-5 md:p-6 rounded-xl shadow hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login"); // Reset to login when modal is closed
        }}
        hideHeader // Assuming Modal component handles responsiveness
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} onClose={() => setOpenAuthModal(false)} />} {/* Pass onClose to Login/SignUp to close modal on success */}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} onClose={() => setOpenAuthModal(false)} />}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;