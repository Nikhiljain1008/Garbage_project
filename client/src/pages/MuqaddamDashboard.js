  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import ImageUploader from '../components/posts/ImageUploader';

  const MuqaddamDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState({});

    useEffect(() => {
      const fetchComplaints = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/complaints/muqaddam', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setComplaints(res.data.complaints || []);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching complaints');
        }
      };
      fetchComplaints();
    }, []);

    const handleSubmit = async (e, complaintId, complaintLocation, complaintLat, complaintLng, muqaddamImage, muqaddamLocation, muqaddamLat, muqaddamLng, description) => {
      e.preventDefault();
      
      if (!muqaddamImage || !muqaddamLocation || muqaddamLat === null || muqaddamLng === null) {
        setError('Please upload an image and fetch your location before submitting. client side');
        return;
      }

      const formData = new FormData();
      formData.append('complaintId', complaintId);
      //formData.append('complaintImage', complaintImage);
      formData.append('complaintLocation', complaintLocation);
      formData.append('complaintLatitude', complaintLat);
      formData.append('complaintLongitude', complaintLng);

      formData.append('image', muqaddamImage);
      formData.append('muqaddamLocation', muqaddamLocation);
      formData.append('muqaddamLatitude', muqaddamLat);
      formData.append('muqaddamLongitude', muqaddamLng);

      formData.append('description', description);

      setLoading(true);
      setSubmissionStatus((prev) => ({ ...prev, [complaintId]: 'Submitting...' }));

      try {
        const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}/submit-cleanup`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        });
        const contentType = res.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('✅ Got JSON:', data);
        } else {
          const text = await res.text();
          console.warn('❌ Not JSON. Response body was:', text);
        }
        const data = await res.json();
        if (res.ok) {
          setMessage('Post submitted successfully!');
          setComplaints(complaints.filter(c => c._id !== complaintId));
          setSubmissionStatus((prev) => ({ ...prev, [complaintId]: 'Submitted' }));
        } else {
          setError(data.message || 'Failed to submit post.');
          setSubmissionStatus((prev) => ({ ...prev, [complaintId]: 'Failed' }));
        }
      } catch (err) {
        console.log(err);
        setError('Error submitting post. Please try again.');
        setSubmissionStatus((prev) => ({ ...prev, [complaintId]: 'Failed' }));
      } finally {
        setLoading(false);
      }
  };


    return (
      <div>
        <h1>Muqaddam Dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <h2>Assigned Complaints</h2>
  {complaints.length === 0 ? (
    <p>No complaints assigned to you.</p>
  ) : (
    complaints.map((complaint) => (
      <div key={complaint._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
        <img src={complaint.imageUrl} alt="complaint" style={{ width: '200px' }} />
        <p><strong>Prediction:</strong> {complaint.flaskData.prediction}</p>
        <p><strong>Ward:</strong> {complaint.flaskData.ward_number}</p>

        {/* Display Complaint Location Details */}
        <p><strong>Location:</strong> {complaint.location}</p>
        <p><strong>Latitude:</strong> {complaint.latitude}</p>
        <p><strong>Longitude:</strong> {complaint.longitude}</p>

        {/* Image Upload & Location Form for Each Complaint */}
        <h3>Submit Cleanup Proof</h3>
        <ImageUploader onImageUpload={(img, previewUrl) => {
          setSubmissionStatus((prev) => ({ 
            ...prev, 
            [complaint._id]: { image: img, preview: previewUrl, location: '', latitude: null, longitude: null, description: '' } 
          }));
        }} initialPreview={submissionStatus[complaint._id]?.preview} />
        
        <div className="mb-4">
          <label>Current Location:</label>
          <input type="text" value={submissionStatus[complaint._id]?.location || ''} readOnly className="w-full border p-2 rounded mb-2" />
          <button type="button" className="bg-green-500 text-white py-2 px-4 rounded" 
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  setSubmissionStatus((prev) => ({ 
                    ...prev, 
                    [complaint._id]: { ...prev[complaint._id], location: `Lat: ${latitude}, Lng: ${longitude}`, latitude, longitude } 
                  }));
                });
              }
            }}>
            Use Current Location
          </button>
        </div>

        <textarea className="w-full p-2 border rounded mt-3" placeholder="Add a description..." 
          value={submissionStatus[complaint._id]?.description || ''} 
          onChange={(e) => setSubmissionStatus((prev) => ({ 
            ...prev, 
            [complaint._id]: { ...prev[complaint._id], description: e.target.value } 
          }))} />

  <button 
    onClick={(e) => handleSubmit(
      e,
      complaint._id,                                      // complaintId
      complaint.location,                                // complaintLocation
      complaint.latitude,                                // complaintLat
      complaint.longitude,                               // complaintLng
      submissionStatus[complaint._id]?.image,             // muqaddamImage (uploaded image)
      submissionStatus[complaint._id]?.location,          // muqaddamLocation (location string)
      submissionStatus[complaint._id]?.latitude,          // muqaddamLat (raw number)
      submissionStatus[complaint._id]?.longitude,         // muqaddamLng (raw number)
      submissionStatus[complaint._id]?.description        // description
    )}
    
    className={`w-full mt-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500'}`} 
    disabled={loading}
  >
    {submissionStatus[complaint._id] === 'Submitting...' ? 'Submitting...' : 'Submit'}
  </button>

      </div>
    ))
  )}


      </div>
    );
  };

  export default MuqaddamDashboard;
