import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ShowVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoIdToReplace, setVideoIdToReplace] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axiosPrivate.get('/api/videos'); // Fetch videos from the backend
                setVideos(response.data); // Set the videos in state
            } catch (err) {
                setError('Error fetching videos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [axiosPrivate]);

    const handleDelete = async (id) => {
        try {
            await axiosPrivate.delete(`/api/videos/${id}`); // Call the delete endpoint
            setVideos(videos.filter(video => video._id !== id)); // Update state to remove the deleted video
        } catch (err) {
            console.error('Error deleting video:', err);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleReplace = async (id) => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            await axiosPrivate.put(`/api/videos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setVideos(videos.map(video => (video._id === id ? { ...video, name: selectedFile.name } : video)));
            setSelectedFile(null);
            setVideoIdToReplace(null);
        } catch (err) {
            console.error('Error replacing video:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Uploaded Videos</h1>
            <div className="video-gallery">
                {videos.map((video) => (
                    <div key={video._id} className="video-item">
                        <video controls width="600">
                            <source src={video.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <p>{video.caption}</p>
                        <button className="video-delete" onClick={() => handleDelete(video._id)}>Delete</button>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={() => { setVideoIdToReplace(video._id); handleReplace(video._id); }}>Replace</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowVideos; 