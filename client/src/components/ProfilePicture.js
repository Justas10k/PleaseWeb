import React from 'react';

const ProfilePicture = ({ profilePictureUrl, altText = 'Profile Picture' }) => {
    return (
        <div>
            {profilePictureUrl ? (
                <img 
                    src={profilePictureUrl} 
                    alt={altText} 
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }} // Example styling
                />
            ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ccc' }}>
                    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        No Image
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProfilePicture; 