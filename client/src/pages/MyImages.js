import React, { useState, useEffect } from "react";
import axios from "axios";

const MyImages = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/images/my-images", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setImages(response.data.images);
            } catch (error) {
                console.error("❌ Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <h2>📷 My Uploaded Images</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {images.length === 0 ? (
                    <p>No images uploaded yet.</p>
                ) : (
                    images.map((img, index) => (
                        <div key={index} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
                            <img src={img.imageUrl} alt="Uploaded" style={{ width: "100%", borderRadius: "8px" }} />
                            <p><strong>📍 Location:</strong> {img.location}</p>
                            <p><strong>🗑️ Garbage Probability:</strong> {img.garbageProbability.toFixed(2)}%</p>
                            {img.description && <p><strong>📝 Description:</strong> {img.description}</p>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyImages;
