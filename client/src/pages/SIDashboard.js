// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SINavbar from '../components/SINavbar';

// const SIDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [muqaddams, setMuqaddams] = useState([]);
//   const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
//   const [siInstructions, setSiInstructions] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/complaints/si', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setComplaints(res.data.complaints || []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error fetching complaints');
//       }
//     };
//     fetchComplaints();
//   }, []);

//   useEffect(() => {
//     const fetchMuqaddams = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/govEmployees/muqaddams', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
//       setError('Please select a Muqaddam to assign');
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/complaints/${complaintId}/assign-muqaddam`,
//         {
//           muqaddamId: selectedMuqaddam,
//           siInstructions: siInstructions,
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       setMessage(res.data.message);
//       setComplaints(complaints.filter((c) => c._id !== complaintId));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error assigning complaint');
//     }
//   };

//   return (
//     <>
//       <SINavbar />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-6xl mx-auto">

//           {error && <p className="text-red-600 text-center">{error}</p>}
//           {message && <p className="text-green-600 text-center">{message}</p>}

//           {complaints.length === 0 ? (
//             <p className="text-center text-gray-600 text-lg">No pending complaints.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {complaints.map((complaint) => (
//                 <div key={complaint._id} className="bg-white rounded-lg shadow-lg p-6">
//                   <img
//                     src={complaint.imageUrl}
//                     alt="Complaint"
//                     className="w-full h-40 object-cover rounded-md mb-4"
//                   />
//                   <p className="text-gray-800">
//                     <strong>Prediction:</strong> {complaint.flaskData.prediction}
//                   </p>
//                   <p className="text-gray-800">
//                     <strong>Garbage Probability:</strong> {complaint.flaskData.garbage_probability}%
//                   </p>
//                   <p className="text-gray-800">
//                     <strong>Ward:</strong> {complaint.flaskData.ward_number}
//                   </p>

//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700">Assign to Muqaddam</label>
//                     <select
//                       value={selectedMuqaddam}
//                       onChange={(e) => setSelectedMuqaddam(e.target.value)}
//                       className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
//                     >
//                       <option value="">Select Muqaddam</option>
//                       {muqaddams.map((muq) => (
//                         <option key={muq._id} value={muq._id}>
//                           {muq.name} ({muq.identifier})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700">SI Instructions (optional)</label>
//                     <input
//                       type="text"
//                       placeholder="Enter instructions"
//                       value={siInstructions}
//                       onChange={(e) => setSiInstructions(e.target.value)}
//                       className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
//                     />
//                   </div>

//                   <button
//                     onClick={() => handleAssignMuqaddam(complaint._id)}
//                     className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
//                   >
//                     Forward to Muqaddam
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SIDashboard;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SINavbar from '../components/SINavbar';

const SIDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [muqaddams, setMuqaddams] = useState([]);
  const [selectedMuqaddam, setSelectedMuqaddam] = useState('');
  const [siInstructions, setSiInstructions] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints/si', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setComplaints(res.data.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching complaints');
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchMuqaddams = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/govEmployees/muqaddams', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMuqaddams(res.data.muqaddams || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching muqaddams');
      }
    };
    fetchMuqaddams();
  }, []);

  const handleAssignMuqaddam = async (complaintId) => {
    if (!selectedMuqaddam) {
      setError('Please select a Muqaddam to assign');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/complaints/${complaintId}/assign-muqaddam`,
        {
          muqaddamId: selectedMuqaddam,
          siInstructions: siInstructions,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessage(res.data.message);
      setComplaints(complaints.filter((c) => c._id !== complaintId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning complaint');
    }
  };

  return (
    <>
      <SINavbar />
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 px-6 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}

          {complaints.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No pending complaints.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-700 font-medium">Prediction: <span className="font-semibold">{complaint.flaskData.prediction}</span></p>
                  <p className="text-gray-700 font-medium">Garbage Probability: <span className="font-semibold">{complaint.flaskData.garbage_probability}%</span></p>
                  <p className="text-gray-700 font-medium">Ward: <span className="font-semibold">{complaint.flaskData.ward_number}</span></p>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600">Assign to Muqaddam</label>
                    <select
                      value={selectedMuqaddam}
                      onChange={(e) => setSelectedMuqaddam(e.target.value)}
                      className="mt-2 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Muqaddam</option>
                      {muqaddams.map((muq) => (
                        <option key={muq._id} value={muq._id}>
                          {muq.name} ({muq.identifier})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600">SI Instructions (optional)</label>
                    <input
                      type="text"
                      placeholder="Enter instructions"
                      value={siInstructions}
                      onChange={(e) => setSiInstructions(e.target.value)}
                      className="mt-2 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => handleAssignMuqaddam(complaint._id)}
                    className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                  >
                    Forward to Muqaddam
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SIDashboard;
