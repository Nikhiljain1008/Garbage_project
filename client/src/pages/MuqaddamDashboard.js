import React, { useState, useEffect } from 'react';
import axios from 'axios';


const MuqaddamDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [workerCategory, setWorkerCategory] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Hard-coded list of workers (in production, fetch from backend)
  const workerList = [
    { id: 'worker1', name: 'Worker 1' },
    { id: 'worker2', name: 'Worker 2' }
  ];

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

  const handleAssignWorker = async (complaintId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/complaints/${complaintId}/assign-worker`, {
        workerId: selectedWorker,
        category: workerCategory
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(res.data.message);
      setComplaints(complaints.filter(c => c._id !== complaintId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning worker');
    }
  };

  return (
    <>
      <div>
        <h1>Muqaddam Dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {complaints.length === 0 ? (
          <p>No complaints assigned to you.</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
              <img src={complaint.imageUrl} alt="complaint" style={{ width: '200px' }} />
              <p>Prediction: {complaint.flaskData.prediction}</p>
              <p>Ward: {complaint.flaskData.ward_number}</p>
              <div>
                <label>Assign Worker: </label>
                <select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
                  <option value="">Select Worker</option>
                  {workerList.map(worker => (
                    <option key={worker.id} value={worker.id}>{worker.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Worker Category (e.g., garbage collector)"
                  value={workerCategory}
                  onChange={(e) => setWorkerCategory(e.target.value)}
                />
              </div>
              <button onClick={() => handleAssignWorker(complaint._id)}>
                Assign Worker
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MuqaddamDashboard;
