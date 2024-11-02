import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const UploadVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [caption, setCaption] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('caption', caption);
        formData.append('userId', auth.userId); // Replace with actual user ID

        try {
            const response = await axiosPrivate.post('/api/uploadVideo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Video uploaded successfully:', response.data); // Log the response
            // Handle success (e.g., show a success message or refresh the video list)
        } catch (err) {
            console.error('Error uploading video:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="video/*" onChange={handleFileChange} required />
            <input
                type="text"
                placeholder="Enter caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <button type="submit">Upload Video</button>
        </form>
    );
};

export default UploadVideo; 