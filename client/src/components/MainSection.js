
import "../styles/PageLayout.css";

function MainSection() {
  return (
    <div className="page-section page-main-section">
      <div className="job-search-section">
        <h2>Prepare for your job search</h2>
        <div className="progress-bar"><div className="progress"></div></div>
        <p>Add your work experience and skills to show your strengths to recruiters.</p>
        <button className="update-profile-button">Update profile</button>
      </div>
      <div className="post-section">
        <img className="profile-picture-small" src="profile-pic-url" alt="Profile" />
        <input className="post-input" type="text" placeholder="Start a post, try writing with AI" />
        <button>Media</button>
        <button>Event</button>
        <button>Write article</button>
      </div>
      <div className="feed-section">
        <div className="feed-header">
          <button>New posts</button>
          <select>
            <option>Most relevant first</option>
          </select>
        </div>
        <div className="removed-post-notification">
          Post removed from your feed
          <button>Undo</button>
          <div>
            Tell us more so we can adjust your feed.
            <button>Not interested in this topic</button>
            <button>Not interested in Noir's posts</button>
            <button>Not appropriate for LinkedIn</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainSection;
