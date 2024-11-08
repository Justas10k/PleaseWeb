import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ShowImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageIdToReplace, setImageIdToReplace] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axiosPrivate.get('/images');
                console.log(response.data)
                setImages(response.data);
            } catch (err) {
                setError('Error fetching images');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [axiosPrivate]); // Include axiosPrivate in the dependency array

    const handleDelete = async (id) => {
        try {
            await axiosPrivate.delete(`/images/${id}`); // Call the delete endpoint
            setImages(images.filter(image => image._id !== id)); // Update state to remove the deleted image
        } catch (err) {
            console.error('Error deleting image:', err);
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
        formData.append('image', selectedFile);

        try {
            await axiosPrivate.put(`/images/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImages(images.map(image => (image._id === id ? { ...image, name: selectedFile.name } : image)));
            setSelectedFile(null);
            setImageIdToReplace(null);
        } catch (err) {
            console.error('Error replacing image:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Uploaded Images</h1>
            <div className="image-gallery">
                {images.map((image) => (
                    <div key={image._id} className="image-item">
                        <img className="show-images-picture" src={image.imageUrl} alt={image.caption} />
                        <p>{image.caption}</p>
                        <button className="show-images-picture-delete" onClick={() => handleDelete(image._id)}>Delete</button>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={() => { setImageIdToReplace(image._id); handleReplace(image._id); }}>Replace</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowImages; 