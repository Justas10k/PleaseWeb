import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const AddProfilePicture = () => {
    const [file, setFile] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
 
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('userId', auth.userId); // Include userId in the request
 
        try {
            const response = await axiosPrivate.post('/images/profilePicture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data.message); // Show success message
        } catch (err) {
            console.error('Error uploading profile picture:', err);
            console.log('Error uploading profile picture');
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Profile Picture</button>
        </div>
    );
};

export default AddProfilePicture;