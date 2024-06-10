import { Link } from "react-router-dom";
import Post from './Post';

const AllPosts = () => {
    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <Post />
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default AllPosts
