// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const SIDashboard = () => {
// //   const [complaints, setComplaints] = useState([]);
// //   const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
// //   const [siInstructions, setSiInstructions] = useState('');
// //   const [error, setError] = useState('');
// //   const [message, setMessage] = useState('');

// //   // In a real app, fetch the list of Muqaddams from the backend.
// //   // Here is a hard-coded example:
// //   const muqaddamList = [
// //     { id: 'M3', name: 'Muqaddam 1' },
// //     { id: 'muq2', name: 'Muqaddam 2' }
// //   ];

// //   useEffect(() => {
// //     const fetchComplaints = async () => {
// //       try {
// //         // Assume the SI's ward or identifier is already known on the backend
// //         const res = await axios.get('http://localhost:5000/api/complaints/si?ward=57', {
// //           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //         });
// //         setComplaints(res.data.complaints || []);
// //       } catch (err) {
// //         setError(err.response?.data?.message || 'Error fetching complaints');
// //       }
// //     };
// //     fetchComplaints();
// //   }, []);

// //   const handleAssignMuqaddam = async (complaintId) => {
// //     try {
// //       const res = await axios.post(`http://localhost:5000/api/complaints/${complaintId}/assign-muqaddam`, {
// //         muqaddamId: selectedMuqaddam,
// //         siInstructions: siInstructions
// //       }, {
// //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //       });
// //       setMessage(res.data.message);
// //       // Remove the assigned complaint from the list
// //       setComplaints(complaints.filter(c => c._id !== complaintId));
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Error assigning complaint');
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>SI Dashboard</h1>
// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //       {message && <p style={{ color: 'green' }}>{message}</p>}
// //       {complaints.length === 0 ? (
// //         <p>No pending complaints.</p>
// //       ) : (
// //         complaints.map((complaint) => (
// //           <div key={complaint._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
// //             <img src={complaint.imageUrl} alt="complaint" style={{ width: '200px' }} />
// //             <p>Prediction: {complaint.flaskData.prediction}</p>
// //             <p>Garbage Probability: {complaint.flaskData.garbage_probability.toFixed(2)}%</p>
// //             <p>Ward: {complaint.flaskData.ward_number}</p>
// //             <div>
// //               <label>Assign to Muqaddam: </label>
// //               <select value={selectedMuqaddam} onChange={(e) => setSelectedMuqaddam(e.target.value)}>
// //                 <option value="">Select Muqaddam</option>
// //                 {muqaddamList.map(muq => (
// //                   <option key={muq.id} value={muq.id}>{muq.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <input
// //                 type="text"
// //                 placeholder="Enter instructions (optional)"
// //                 value={siInstructions}
// //                 onChange={(e) => setSiInstructions(e.target.value)}
// //               />
// //             </div>
// //             <button onClick={() => handleAssignMuqaddam(complaint._id)}>
// //               Forward Complaint to Muqaddam
// //             </button>
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default SIDashboard;

// // Example SI Dashboard snippet for listing Muqaddams
// // src/pages/SIDashboard.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SIDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [muqaddams, setMuqaddams] = useState([]);
//   const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
//   const [siInstructions, setSiInstructions] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // Fetch pending complaints for the SI
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

//   // Fetch list of Muqaddams from backend
//   useEffect(() => {
//     const fetchMuqaddams = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/govEmployees/muqaddams', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setMuqaddams(res.data.muqaddams || []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error fetching muqaddams');
//       }
//     };
//     fetchMuqaddams();
//   }, []);

//   // Function to assign a complaint to a selected Muqaddam
//   const handleAssignMuqaddam = async (complaintId) => {
//     if (!selectedMuqaddam) {
//       setError("Please select a Muqaddam to assign");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/complaints/${complaintId}/assign-muqaddam`,
//         {
//           muqaddamId: selectedMuqaddam,
//           siInstructions: siInstructions
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }
//       );
//       setMessage(res.data.message);
//       // Remove the complaint from the list once assigned
//       setComplaints(complaints.filter((c) => c._id !== complaintId));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error assigning complaint');
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>SI Dashboard</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {complaints.length === 0 ? (
//         <p>No pending complaints.</p>
//       ) : (
//         complaints.map((complaint) => (
//           <div
//             key={complaint._id}
//             style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}
//           >
//             <img
//               src={complaint.imageUrl}
//               alt="Complaint"
//               style={{ width: '200px', display: 'block', marginBottom: '10px' }}
//             />
//             <p>
//               <strong>Prediction:</strong> {complaint.flaskData.prediction}
//             </p>
//             <p>
//               <strong>Garbage Probability:</strong> {complaint.flaskData.garbage_probability}%
//             </p>
//             <p>
//               <strong>Ward:</strong> {complaint.flaskData.ward_number}
//             </p>
//             <div style={{ marginBottom: '10px' }}>
//               <label>
//                 <strong>Assign to Muqaddam:</strong>
//               </label>
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
//               <label>
//                 <strong>SI Instructions (optional):</strong>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter instructions"
//                 value={siInstructions}
//                 onChange={(e) => setSiInstructions(e.target.value)}
//                 style={{ marginLeft: '10px', padding: '5px' }}
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



// src/pages/SIDashboard.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SIDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [muqaddams, setMuqaddams] = useState([]);
//   const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
//   const [siInstructions, setSiInstructions] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

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

//   // Fetch Muqaddams for the SI (based on SI's ward and identifier)
//   useEffect(() => {
//     const fetchMuqaddams = async () => {
//       try {
//         // Assuming your SI's details are stored in localStorage or obtained from auth context.
//         // For example, if you saved the SI's ward and identifier in the token payload or user object.
//         const siWard = localStorage.getItem('siWard');      // e.g., "57"
//         const siIdentifier = localStorage.getItem('siIdentifier'); // e.g., "SI1"
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
//   }, []);

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
//               <select value={selectedMuqaddam} onChange={(e) => setSelectedMuqaddam(e.target.value)} style={{ marginLeft: '10px' }}>
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
//             <button onClick={() => handleAssignMuqaddam(complaint._id)}>Forward Complaint to Muqaddam</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SIDashboard;
// src/pages/SIDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SIDashboard = () => {
  const [complaints, setComplaints] = useState([]);
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
    </div>
  );
};

export default SIDashboard;
