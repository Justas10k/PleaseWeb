import React, { useState } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate"; // Import useAxiosPrivate

const UploadImage = () => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const axiosPrivate = useAxiosPrivate(); // Initialize axiosPrivate

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);
        formData.append('caption', caption);

        try {
            const response = await axiosPrivate.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
                },
            });
            const data = response.data;
            console.log(data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} required />
            <input
                type="text"
                placeholder="Enter caption"
                value={caption}
                onChange={handleCaptionChange}
            />
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default UploadImage;
