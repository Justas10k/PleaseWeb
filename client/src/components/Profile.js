import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import UploadImage from "./UploadImage";
import ShowImages from "./ShowImages";
import UploadVideo from "./UploadVideo";
import ShowVideos from "./ShowVideos";
import AddProfilePicture from "./AddProfilePicture";

const Profile = () => {

    const [profile, setProfile] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProfile = async () => {
            try {
                const response = await axiosPrivate.get('/users/profile', {
                    signal: controller.signal
                });
                isMounted && setProfile(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        };

        getProfile();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, navigate, location]);

    return (
        <section>
            <h1>Profile</h1>
            <br />
            {profile ? (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>id:</strong> {profile._id}</p> {/* Displaying the user ID */}
                    
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
            <p>Profile picture : </p>
            <h1>add a profile picture</h1>
            <AddProfilePicture/>

            <h1>currect user picture</h1>


            <h1>images</h1>
            <UploadImage/>
            <ShowImages />
            <h1>VIDEO</h1>
            <UploadVideo/>
            <ShowVideos/>
            
        </section>
    );
};

export default Profile;
