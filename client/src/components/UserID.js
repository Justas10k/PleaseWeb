import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UserIDPost from "./UserIDPost";

const UserID = () => {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(`/users/${id}`);
                console.log('Response', response.data)
                setUserProfile(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getUser();
    }, [id, axiosPrivate]);

    return (
        <section>
            <h1>User Profile</h1>
            {userProfile ? (
                <div>
                    <p><strong>Username:</strong> {userProfile.username}</p>
                    <p><strong>id:</strong> {userProfile._id}</p>
                    {/* Add more user details as needed */}
                    <UserIDPost/>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    );
};

export default UserID;
