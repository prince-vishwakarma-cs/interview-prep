import React from 'react';
import { Link } from 'react-router-dom';
import ProfileInfoCard from '../cards/ProfileInfoCard';


const Navbar = () => (
  <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
    <div className="max-w-full mx-8 px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
      {/* Logo / Title */}
      <Link to="/" className="flex items-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
          Interview Prep AI
        </h1>
      </Link>

      {/* Profile Card */}
      <div className="flex items-center space-x-4">
        <ProfileInfoCard />
      </div>
    </div>
  </header>
);

export default Navbar;
