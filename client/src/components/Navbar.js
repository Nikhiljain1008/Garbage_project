import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">Garbage Reporting</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/report" className="hover:underline">Report Issue</Link>
      </div>
    </nav>
  );
};

export default Navbar;
