import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";


export const LandingPage = () => {
    return (
        <>
            <Navbar />

            <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 px-6 py-12 overflow-hidden">
                {/* Animated Card Container */}

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="bg-gray-150 rounded-3xl  shadow-2xl p-8 sm:p-12 max-w-3xl w-full text-center border border-gray-200 backdrop-blur-lg bg-opacity-80 z-10"
                >
                    {/* Title */}
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-lg mb-6">
                        🏛 Public Service Portal
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-lg text-gray-800 mb-8 leading-relaxed text-justify font-medium">
                        Join our initiative to keep our communities clean and green. Report garbage issues directly to your local municipal ward supervisors and contribute to a cleaner, safer environment for all.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                        <Link
                            to="/login"
                            className="px-6 sm:px-8 py-2 sm:py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-green-700 w-full sm:w-auto text-sm sm:text-base"
                        >
                            Citizen
                        </Link>
                        <Link
                            to="/register2"
                            className="px-6 sm:px-8 py-2 sm:py-3 bg-green-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-green-800 w-full sm:w-auto text-sm sm:text-base"
                        >
                            Gov Employee
                        </Link>
                    </div>
                </motion.div>
            </div>


        </>
    );
};
