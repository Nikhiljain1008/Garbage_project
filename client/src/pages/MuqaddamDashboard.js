// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const MuqaddamDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [selectedWorker, setSelectedWorker] = useState('');
//   const [workerCategory, setWorkerCategory] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // Hard-coded list of workers (in production, fetch from backend)
//   const workerList = [
//     { id: 'worker1', name: 'Worker 1' },
//     { id: 'worker2', name: 'Worker 2' }
//   ];

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/complaints/muqaddam', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setComplaints(res.data.complaints || []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error fetching complaints');
//       }
//     };
//     fetchComplaints();
//   }, []);

//   const handleAssignWorker = async (complaintId) => {
//     try {
//       const res = await axios.post(`http://localhost:5000/api/complaints/${complaintId}/assign-worker`, {
//         workerId: selectedWorker,
//         category: workerCategory
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setMessage(res.data.message);
//       setComplaints(complaints.filter(c => c._id !== complaintId));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error assigning worker');
//     }
//   };

//   return (
//     <div>
//       <h1>Muqaddam Dashboard</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {complaints.length === 0 ? (
//         <p>No complaints assigned to you.</p>
//       ) : (
//         complaints.map((complaint) => (
//           <div key={complaint._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
//             <img src={complaint.imageUrl} alt="complaint" style={{ width: '200px' }} />
//             <p>Prediction: {complaint.flaskData.prediction}</p>
//             <p>Ward: {complaint.flaskData.ward_number}</p>
//             <div>
//               <label>Assign Worker: </label>
//               <select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
//                 <option value="">Select Worker</option>
//                 {workerList.map(worker => (
//                   <option key={worker.id} value={worker.id}>{worker.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <input
//                 type="text"
//                 placeholder="Worker Category (e.g., garbage collector)"
//                 value={workerCategory}
//                 onChange={(e) => setWorkerCategory(e.target.value)}
//               />
//             </div>
//             <button onClick={() => handleAssignWorker(complaint._id)}>
//               Assign Worker
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MuqaddamDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";

const MuqaddamDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState("");
    const [workerCategory, setWorkerCategory] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [pendingWorkers, setPendingWorkers] = useState([]);
    const muqaddamKey = "RE6R2E"; // Replace with dynamic value

    useEffect(() => {
        // Fetch complaints assigned to Muqaddam
        const fetchComplaints = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/complaints/muqaddam", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setComplaints(res.data.complaints || []);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching complaints");
            }
        };

        // Fetch pending workers for approval
        const fetchPendingWorkers = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/muqaddam/pending-workers/${muqaddamKey}`);
                setPendingWorkers(res.data || []);
            } catch (error) {
                console.error("Error fetching pending workers:", error);
            }
        };

        fetchComplaints();
        fetchPendingWorkers();
    }, []);

    const handleAssignWorker = async (complaintId) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/complaints/${complaintId}/assign-worker`,
                { workerId: selectedWorker, category: workerCategory },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setMessage(res.data.message);
            setComplaints(complaints.filter(c => c._id !== complaintId));
        } catch (err) {
            setError(err.response?.data?.message || "Error assigning worker");
        }
    };

    const handleApprove = async (workerId) => {
        try {
            await axios.put(`http://localhost:5000/api/muqaddam/approve-worker/${workerId}`);
            setPendingWorkers(pendingWorkers.filter(worker => worker._id !== workerId));
            alert("Worker Approved!");
        } catch (error) {
            alert("Error approving worker.");
        }
    };

    const handleReject = async (workerId) => {
        try {
            await axios.delete(`http://localhost:5000/api/muqaddam/reject-worker/${workerId}`);
            setPendingWorkers(pendingWorkers.filter(worker => worker._id !== workerId));
            alert("Worker Rejected!");
        } catch (error) {
            alert("Error rejecting worker.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Muqaddam Dashboard</h1>

            {/* Complaints Section */}
            <h2 className="text-xl font-semibold mt-6">Complaints Management</h2>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            {complaints.length === 0 ? (
                <p>No complaints assigned to you.</p>
            ) : (
                complaints.map((complaint) => (
                    <div key={complaint._id} className="border p-4 my-4 bg-white">
                        <img src={complaint.imageUrl} alt="complaint" className="w-40" />
                        <p>Prediction: {complaint.flaskData.prediction}</p>
                        <p>Ward: {complaint.flaskData.ward_number}</p>
                        <div>
                            <label>Assign Worker: </label>
                            <select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
                                <option value="">Select Worker</option>
                                {pendingWorkers.map(worker => (
                                    <option key={worker._id} value={worker._id}>{worker.name}</option>
                                ))}
                            </select>
                        </div>
                        <input type="text" placeholder="Worker Category" value={workerCategory} onChange={(e) => setWorkerCategory(e.target.value)} />
                        <button onClick={() => handleAssignWorker(complaint._id)} className="bg-blue-500 text-white px-4 py-1 rounded-md ml-2">
                            Assign Worker
                        </button>
                    </div>
                ))
            )}

            {/* Worker Approval Section */}
            <h2 className="text-xl font-semibold mt-6">Pending Worker Approvals</h2>
            {pendingWorkers.length === 0 ? (
                <p className="text-gray-500">No pending worker requests.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Ward</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingWorkers.map(worker => (
                            <tr key={worker._id} className="text-center">
                                <td className="border p-2">{worker.name}</td>
                                <td className="border p-2">{worker.category}</td>
                                <td className="border p-2">{worker.ward}</td>
                                <td className="border p-2">
                                    <button className="bg-green-500 text-white px-4 py-1 rounded-md mr-2" onClick={() => handleApprove(worker._id)}>
                                        Approve
                                    </button>
                                    <button className="bg-red-500 text-white px-4 py-1 rounded-md" onClick={() => handleReject(worker._id)}>
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MuqaddamDashboard;
