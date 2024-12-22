import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import defaultPicture from '../img/shortlog.png';

const ShowProfilePictureById = ({ userId }) => { // Accept userId as a prop
    const [profilePicture, setProfilePicture] = useState(defaultPicture); // Set default picture initially
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchProfilePictureById = async () => {
            try {
                const response = await axiosPrivate.get(`/images/profilePicture/${userId}`); // Fetch the profile picture by user ID
                // Set profile picture to default if response is null
                setProfilePicture(response.data.profilePicture || defaultPicture);
            } catch (error) {
                setProfilePicture(defaultPicture); // Set to default on error
            }
        };

        fetchProfilePictureById();
    }, [userId, axiosPrivate]);

    return (
        <div>
            <img 
                src={profilePicture} 
                alt="Profile" 
                style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
            />
        </div>
    );
};

export default ShowProfilePictureById; 