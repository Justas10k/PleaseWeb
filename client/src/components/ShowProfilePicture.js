import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const ShowProfilePicture = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const response = await axiosPrivate.get(`/images/profilePicture/${auth.userId}`); // Fetch the profile picture
                setProfilePicture(response.data.profilePicture);// Set the profile picture URL
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture();
    }, [auth.userId, axiosPrivate]);

    return (
        <div>
            {profilePicture ? (
                <img src={profilePicture} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            ) : (
                <p>No profile picture available</p>
            )}
        </div>
    );
};

export default ShowProfilePicture; 