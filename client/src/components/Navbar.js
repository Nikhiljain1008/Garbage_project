


import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current route

  return (
    <nav className="absoulte  bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-lg z-50 ">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 p-4 ">
        <div className="flex justify-between items-center h-16 ">
          {/* Logo + App Name */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-12 sm:h-14 w-auto" />
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">My App</h2>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            {["/", "/About", "/Contacts"].map((path, index) => {
              const labels = ["Home", "About", "Contacts"];
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`px-6 sm:px-8 py-2 sm:py-3 bg-blue-900 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base 
                      ${location.pathname === path ? "border-4 border-blue-800" : ""}`}
                  >
                    {labels[index]}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button (Right Aligned) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden mt-5 w-10 h-10 flex items-center justify-center bg-blue-900 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-700"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Z-index to be above content) */}
        {isOpen && (
          <div className="md:hidden bg-gray-200 shadow-lg rounded-lg p-4 absolute right-4 top-16 w-48 z-50 border border-gray-100">
            <ul className="flex flex-col space-y-2 font-medium text-gray-900">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 bg-blue-700 text-white rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/About"
                  className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/Contacts"
                  className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  onClick={() => setIsOpen(false)}
                >
                  contacts
                </Link>
              </li>


            </ul>
          </div>
        )}


      </div>
    </nav>
  );
};

export default Navbar;

