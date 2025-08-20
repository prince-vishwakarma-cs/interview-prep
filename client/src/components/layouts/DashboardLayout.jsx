import Navbar from "../Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-full bg-primary-background">
      <Navbar />
      {<div className="min-h-full">{children}</div>}
    </div>
  );
};

export default DashboardLayout;
