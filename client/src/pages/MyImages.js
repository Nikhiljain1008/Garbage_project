// src/pages/MyImages.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyImages = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/images/my-images", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log("Fetched Complaints:", res.data);
        setComplaints(res.data.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaints');
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      {complaints.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {complaints.map((complaint) => (
            <div key={complaint._id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
              <img src={complaint.imageUrl} alt={`Complaint ${complaint._id}`} style={{ width: "100%", borderRadius: "5px" }} />
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Prediction:</strong> {complaint.flaskData?.prediction || "N/A"}</p>
              <p><strong>Garbage Probability:</strong> {complaint.flaskData?.garbage_probability?.toFixed(2) || "N/A"}%</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No complaints found</div>
      )}
    </div>
  );
};

export default MyImages;
