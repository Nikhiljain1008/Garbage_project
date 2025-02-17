import { useState } from "react";
import ImageUploader from "./ImageUploader";

const PostForm = () => {
const [image, setImage] = useState(null);
const [location, setLocation] = useState("");
const [description, setDescription] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState(""); // State for displaying errors
const [preview, setPreview] = useState(null); // State for the preview URL

const fetchCurrentLocation = () => {
setError(""); // Clear any previous errors
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(
(position) => {
const { latitude, longitude } = position.coords;
const currentLocation = `Lat: ${latitude}, Lng: ${longitude}`;
setLocation(currentLocation);
},
(error) => {
setError("Failed to get current location: " + error.message); // Use setError
}
);
} else {
setError("Geolocation is not supported by this browser."); // Use setError
}
};

const handleSubmit = async (e) => {
e.preventDefault();
setError(""); // Clear any previous errors

if (!image || !location) {
setError("Please upload an image and provide a location."); // Use setError
return;
}
console.log(location)
console.log(image)

const formData = new FormData();
formData.append("image", image);
formData.append("location", location);
formData.append("description", description);

console.log(formData)
console.log("Token being sent:", localStorage.getItem("token"));

setLoading(true);
try {
    const res = await fetch("http://localhost:5000/api/images/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,  // 🔥 Send JWT token
        },
        body: formData,
    });
    

    console.log("passing the API");

    const data = await res.json();
    console.log(data);
    console.log(res);

    if (res.ok) {
        alert("Post submitted successfully!");
        setImage(null);
        setLocation("");
        setDescription("");
        setPreview(null); // Reset the preview
    } else {
        setError(data.message || "Failed to submit post.");
    }
} catch (err) {
    setError("Error submitting post. Please try again.");
    console.log(err);
} finally {
    setLoading(false);
}

};

const handleImageUploaded = (img, previewUrl) => {
setImage(img);
setPreview(previewUrl);
};

return (
<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
<h2 className="text-xl font-bold mb-4">Report Garbage</h2>
{error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
<form onSubmit={handleSubmit}>
<ImageUploader onImageUpload={handleImageUploaded} initialPreview={preview} />

<div className="mb-4">
<label className="block mb-2 font-semibold">Location:</label>
<input
type="text"
value={location}
readOnly
className="w-full border p-2 rounded mb-2"
/>
<button
type="button"
className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
onClick={fetchCurrentLocation}
>
Use Current Location
</button>
</div>

<textarea
className="w-full p-2 border rounded mt-3"
placeholder="Add an optional description..."
value={description}
onChange={(e) => setDescription(e.target.value)}
/>

<button
type="submit"
className={`w-full mt-4 py-2 rounded text-white ${
loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
}`}
disabled={loading}
>
{loading ? "Submitting..." : "Submit"}
</button>
</form>
</div>
);
};

export default PostForm;