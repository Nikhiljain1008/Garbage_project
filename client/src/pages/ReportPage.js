import React, { useState } from "react";
import PostForm from "../components/posts/PostForm";

export const ReportPage = () => {
  const [postData, setPostData] = useState(null);

  const handlePostSubmit = (newPost) => {
    console.log("New Post Submitted:", newPost);
    setPostData(newPost);
  };

  return (
    <div className="App">
      <h1 className="text-center text-3xl mb-5">Garbage Reporting System</h1>
      <PostForm onSubmit={handlePostSubmit} />
      {postData && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">Submitted Post:</h3>
          <p><strong>Location:</strong> {postData.location}</p>
          <p><strong>Description:</strong> {postData.description}</p>
          <img src={postData.image} alt="Garbage" className="mt-2" />
        </div>
      )}
    </div>
  );
};

// export default ReportPage;
