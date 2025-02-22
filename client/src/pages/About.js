import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 px-6 py-12 overflow-hidden">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl bg-gray-150 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center mt-0"
                >
                    <h1 className="text-5xl font-bold text-blue-900 mb-4">About Our Project</h1>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Our solid waste management system is designed to streamline waste collection by leveraging a hierarchical structure.
                        Users can lodge complaints about waste collection, which are processed through the system and assigned to appropriate officials.
                    </p>
                    <div className="mt-6 space-y-4">
                        <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-orange-200 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-green-700">Efficient Complaint Resolution</h2>
                            <p className="text-gray-600">Complaints are seamlessly assigned from SI to Muqaddam, ensuring quick action.</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-orange-700">AI-Powered Garbage Detection</h2>
                            <p className="text-gray-600">Flask-based AI model analyzes images to determine waste levels in different areas.</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-green-200 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-blue-700">User & Government Role-Based Access</h2>
                            <p className="text-gray-600">The platform supports various roles like users, SIs, Muqaddams, and workers for seamless workflow.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default About;
