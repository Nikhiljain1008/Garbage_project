
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SIDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [muqaddams, setMuqaddams] = useState([]);
//   const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
//   const [siInstructions, setSiInstructions] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [pendingComplaints, setPendingComplaints] = useState([]);
//   const [assignedComplaints, setAssignedComplaints] = useState([]);

//   // Get SI details from localStorage
//   const siWard = localStorage.getItem('siWard');            // e.g., "57"
//   const siIdentifier = localStorage.getItem('siIdentifier');  // e.g., "SI1"

//   // Fetch SI's pending complaints
//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/complaints/si', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setComplaints(res.data.complaints || []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error fetching complaints');
//       }
//     };
//     fetchComplaints();
//   }, []);

//   // Fetch Muqaddams for the SI based on ward and siIdentifier
//   useEffect(() => {
//     const fetchMuqaddams = async () => {
//       try {
//         if (!siWard || !siIdentifier) return;
//         const res = await axios.get(`http://localhost:5000/api/govEmployees/muqaddams?ward=${siWard}&siIdentifier=${siIdentifier}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setMuqaddams(res.data.muqaddams || []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error fetching muqaddams');
//       }
//     };
//     fetchMuqaddams();
//   }, [siWard, siIdentifier]);

//   const handleAssignMuqaddam = async (complaintId) => {
//     if (!selectedMuqaddam) {
//       setError("Please select a Muqaddam to assign");
//       return;
//     }
//     try {
//       const res = await axios.post(`http://localhost:5000/api/complaints/${complaintId}/assign-muqaddam`, {
//         muqaddamId: selectedMuqaddam,
//         siInstructions
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setMessage(res.data.message);
//       setComplaints(complaints.filter(c => c._id !== complaintId));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error assigning complaint');
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>SI Dashboard</h1>
//       <p><strong>Your Ward:</strong> {siWard} | <strong>Your Identifier:</strong> {siIdentifier}</p>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {complaints.length === 0 ? (
//         <p>No pending complaints.</p>
//       ) : (
//         complaints.map((complaint) => (
//           <div key={complaint._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//             <img src={`${complaint.imageUrl}`} alt="Complaint" style={{ width: '200px', marginBottom: '10px' }} />
//             <p><strong>Prediction:</strong> {complaint.flaskData.prediction}</p>
//             <p><strong>Garbage Probability:</strong> {complaint.flaskData.garbage_probability}%</p>
//             <p><strong>Ward:</strong> {complaint.flaskData.ward_number}</p>
//             <div style={{ marginBottom: '10px' }}>
//               <label><strong>Assign to Muqaddam:</strong></label>
//               <select
//                 value={selectedMuqaddam}
//                 onChange={(e) => setSelectedMuqaddam(e.target.value)}
//                 style={{ marginLeft: '10px' }}
//               >
//                 <option value="">Select Muqaddam</option>
//                 {muqaddams.map((muq) => (
//                   <option key={muq._id} value={muq._id}>
//                     {muq.name} ({muq.identifier})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ marginBottom: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="Enter instructions (optional)"
//                 value={siInstructions}
//                 onChange={(e) => setSiInstructions(e.target.value)}
//                 style={{ padding: '5px' }}
//               />
//             </div>
//             <button onClick={() => handleAssignMuqaddam(complaint._id)}>
//               Forward Complaint to Muqaddam
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SIDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SIDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [forwardedComplaints, setForwardedComplaints] = useState([]);
  const [muqaddams, setMuqaddams] = useState([]);
  const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
  const [siInstructions, setSiInstructions] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Get SI details from localStorage
  const siWard = localStorage.getItem('siWard');            // e.g., "57"
  const siIdentifier = localStorage.getItem('siIdentifier');  // e.g., "SI1"

  // Fetch SI's pending complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints/si', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setComplaints(res.data.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching complaints');
      }
    };
    fetchComplaints();
  }, []);

  // Fetch SI's forwarded complaints
  useEffect(() => {
    const fetchForwardedComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints/si/forwarded', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setForwardedComplaints(res.data.forwardedComplaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching forwarded complaints');
      }
    };
    fetchForwardedComplaints();
  }, []);

  // Fetch Muqaddams for the SI based on ward and siIdentifier
  useEffect(() => {
    const fetchMuqaddams = async () => {
      try {
        if (!siWard || !siIdentifier) return;
        const res = await axios.get(`http://localhost:5000/api/govEmployees/muqaddams?ward=${siWard}&siIdentifier=${siIdentifier}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMuqaddams(res.data.muqaddams || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching muqaddams');
      }
    };
    fetchMuqaddams();
  }, [siWard, siIdentifier]);

  const handleAssignMuqaddam = async (complaintId) => {
    if (!selectedMuqaddam) {
      setError("Please select a Muqaddam to assign");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/complaints/${complaintId}/assign-muqaddam`, {
        muqaddamId: selectedMuqaddam,
        siInstructions
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(res.data.message);
      setComplaints(complaints.filter(c => c._id !== complaintId));
      // Refresh forwarded complaints after forwarding
      setForwardedComplaints([...forwardedComplaints, res.data.complaint]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning complaint');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>SI Dashboard</h1>
      <p><strong>Your Ward:</strong> {siWard} | <strong>Your Identifier:</strong> {siIdentifier}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Pending Complaints Section */}
      <h2>Pending Complaints</h2>
      {complaints.length === 0 ? (
        <p>No pending complaints.</p>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <img src={`${complaint.imageUrl}`} alt="Complaint" style={{ width: '200px', marginBottom: '10px' }} />
            <p><strong>Prediction:</strong> {complaint.flaskData.prediction}</p>
            <p><strong>Garbage Probability:</strong> {complaint.flaskData.garbage_probability}%</p>
            <p><strong>Ward:</strong> {complaint.flaskData.ward_number}</p>
            <div style={{ marginBottom: '10px' }}>
              <label><strong>Assign to Muqaddam:</strong></label>
              <select
                value={selectedMuqaddam}
                onChange={(e) => setSelectedMuqaddam(e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <option value="">Select Muqaddam</option>
                {muqaddams.map((muq) => (
                  <option key={muq._id} value={muq._id}>
                    {muq.name} ({muq.identifier})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Enter instructions (optional)"
                value={siInstructions}
                onChange={(e) => setSiInstructions(e.target.value)}
                style={{ padding: '5px' }}
              />
            </div>
            <button onClick={() => handleAssignMuqaddam(complaint._id)}>
              Forward Complaint to Muqaddam
            </button>
          </div>
        ))
      )}

      {/* Forwarded Complaints Section */}
      <h2>Forwarded Complaints</h2>
      {forwardedComplaints.length === 0 ? (
        <p>No forwarded complaints.</p>
      ) : (
        forwardedComplaints.map((complaint) => (
          <div key={complaint._id} style={{ border: '1px solid #007bff', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f8ff' }}>
            <img src={`${complaint.imageUrl}`}alt="Complaint" style={{ width: '200px', marginBottom: '10px' }} />
            <p><strong>Prediction:</strong> {complaint.flaskData.prediction}</p>
            <p><strong>Garbage Probability:</strong> {complaint.flaskData.garbage_probability}%</p>
            <p><strong>Ward:</strong> {complaint.flaskData.ward_number}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
            <p></p>
          </div>
        ))
      )}
    </div>
  );
};

export default SIDashboard;
