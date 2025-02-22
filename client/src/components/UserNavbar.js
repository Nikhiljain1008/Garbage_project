

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import logo from "../assets/logo.png";
import profileIcon from "../assets/Profile.png"; // Profile icon

const UserNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Handle Logout
    const handleLogout = () => {
        logout(navigate);
    };

    return (
        <nav className="relative h-20 bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-lg z-50 flex items-center justify-between px-6">
            {/* Logo + Dashboard Name */}
            <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="h-12 sm:h-14 w-auto" />
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">User Dashboard</h2>
            </div>

            {/* Profile Icon */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full overflow-hidden bg-white border-4 border-white shadow-md transition-all duration-300 hover:scale-105"
                >
                    <img src={profileIcon} alt="Profile" className="w-full h-full object-cover" />
                </button>

                {/* Dropdown Menu for Logout */}
                {isOpen && (
                    <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg p-4 z-50 text-center border border-gray-200">
                        <img src={profileIcon} alt="Profile" className="w-16 h-16 mx-auto rounded-full bg-white p-1" />
                        <button
                            onClick={handleLogout}
                            className="mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-800 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

        </nav>
    );
};

export default UserNavbar;

