import React, { useState } from "react";
import UserNavbar from "../components/UserNavbar";
import PostForm from "../components/posts/PostForm";
import MyImages from "./MyImages";
// import { Camera } from "lucide-react";
import Cameraa from "../assets/cameraa.png";
import mypost from "../assets/mypost.png"

export const ReportPage = () => {
  const [postData, setPostData] = useState([]);
  const [viewReports, setViewReports] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handlePostSubmit = (newPost) => {
    setPostData([...postData, newPost]); // Add new report
    setShowForm(false); // Hide form after submission
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-white to-green-600 p-6 flex flex-col items-center">

        {/* 3x4 Grid Layout - Initially Visible */}
        {!showForm && !viewReports && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl w-full mt-32 shadow-2xl rounded-xl p-4 bg-white">
            {/* Report a Problem Card */}
            <div
              onClick={() => setShowForm(true)}
              className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gray-200 p-4 rounded-full shadow-lg">
                <img src={Cameraa} alt="camera" className="h-40 w-40 rounded-lg object-cover" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-800">Report a Problem</p>
            </div>

            {/* Your Reports Card */}
            <div
              onClick={() => setViewReports(true)}
              className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gray-200 p-4 rounded-full shadow-lg">
                <img src={mypost} alt="post" className="h-40 w-40 rounded-lg object-cover" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-800">Your Reports</p>
            </div>
          </div>

        )}

        {/* Report Submission Form */}
        {showForm && (
          <div className="max-w-3xl w-full bg-white p-6  shadow-lg rounded-lg mt-6">
            <button
              className="text-blue-700 font-semibold mb-4 block"
              onClick={() => setShowForm(false)}
            >
              ← Back
            </button>
            <PostForm onSubmit={handlePostSubmit} />
          </div>
        )}


        {/* Reports Grid */}
        {viewReports && (
          <div className="max-w-5xl w-full bg-white p-6 shadow-lg rounded-lg mt-6">
            <button
              className="text-blue-600 font-semibold mb-4 block"
              onClick={() => setViewReports(false)}
            >
              ← Back
            </button>
            <MyImages onSubmit={handlePostSubmit} />

          </div>
        )}

      </div>
    </>
  );
};
