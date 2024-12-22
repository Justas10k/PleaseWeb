import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import defaultPicture from '../img/shortlog.png';

const ShowProfilePicture = () => {
    const [profilePicture, setProfilePicture] = useState(defaultPicture);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const response = await axiosPrivate.get(`/images/profilePicture/${auth.userId}`); // Fetch the profile picture
                setProfilePicture(response.data.profilePicture || defaultPicture); // Set to default if not available
            } catch (error) {
                setProfilePicture(defaultPicture); // Set to default on error
            }
        };

        fetchProfilePicture();
    }, [auth.userId, axiosPrivate]);

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

export default ShowProfilePicture; 