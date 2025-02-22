import React from "react";
import Navbar from "../components/Navbar";

const contacts = [
    {
        name: "Shravan Kokate",
        email: "shravan.kokate22@vit.edu",
        phone: "XXXXXX0226",
    },
    {
        name: "Babusha Kolhe",
        email: "babusha.kolhe22@vit.edu",
        phone: "XXXXXX2345",
    },
    {
        name: "Nikhil Jain",
        email: "nikhil.jain22@vit.edu",
        phone: "XXXXXX5466",
    },
    {
        name: "Aadil Shaikh",
        email: "aadil.shaikh22@vit.edu",
        phone: "XXXXXX8765",
    },
];

const Contacts = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 px-6 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-6">Contact Us</h1>
                <p className="text-lg sm:text-xl text-gray-700 text-center max-w-2xl mb-8">
                    Reach out to our team for any queries or support.
                </p>

                <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {contacts.map((contact, index) => (
                        <div
                            key={index}
                            className="bg-gray-150 rounded-xl shadow-2xl p-6 flex flex-col items-center transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
                        >
                            <h3 className="text-xl font-bold text-gray-800">{contact.name}</h3>
                            <p className="text-gray-700">{contact.email}</p>
                            <p className="text-gray-600 font-semibold">{contact.phone}</p>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
};

export default Contacts;
