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
        setComplaints(res.data.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaints');
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {complaints.length > 0 ? (
        complaints.map((complaint, index) => (
          <div key={index}>
            <img src={complaint.imageUrl} alt={`Complaint ${index}`} style={{ width: '200px' }} />
            <p>Status: {complaint.status}</p>
            <p>Prediction: {complaint.flaskData.prediction}</p>
            <p>Garbage Probability: {complaint.flaskData.garbage_probability.toFixed(2)}%</p>
          </div>
        ))
      ) : (
        <div>No complaints found</div>
      )}
    </div>
  );
};

export default MyImages;
