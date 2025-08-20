import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { APP_FEATURES } from "../utils/data";
import mockup from "./../assets/mockup.svg";

const LandingPage = () => {
  const {user} = useSelector((state)=>state.user)
  const navigate = useNavigate();

  const handleCTA = () => {
    if (!user) { 
      navigate("/login")
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <DashboardLayout>

      <div className="min-h-screen bg-primary-background relative overflow-hidden">
 
        <div className="container max-w-7xl mx-auto px-4 pt-16 pb-24 relative z-10">
          
         <div className="text-center">
            <div className="max-w-4xl mx-auto mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black font-medium mb-6 leading-tight">
                Ace Interviews with <br />
                <span className=" text-primary font-semibold inline-block">
                   AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="max-w-xl mx-auto">
              <p className="text-base md:text-lg text-gray-700 mb-8">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery — your ultimate interview toolkit is
                here.
              </p>
              <button
                className="bg-primary-button-bg text-sm font-semibold text-button-text px-7 py-2.5 rounded-full transition-colors hover:bg-primary-button-bg-hover"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center py-10 relative z-10">
          <section
            className="container mx-auto px-4 flex justify-center cursor-pointer"
            onClick={handleCTA}
          >
            <img
              src={mockup}
              alt="App Mockup"
              className="w-full max-w-sm md:max-w-md lg:max-w-xl xl:max-w-3xl"
            />
          </section>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 py-16">
            <section>
              <h2 className="text-2xl font-medium text-center mb-12">
                Features That Make You Shine
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {APP_FEATURES.map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-card-bg p-6 rounded-xl transition border border-white hover:border-card-border-hover"
                  >
                    <h3 className="text-primary-text font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary-text">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    
    </DashboardLayout>
    </>
  );
};

export default LandingPage;
