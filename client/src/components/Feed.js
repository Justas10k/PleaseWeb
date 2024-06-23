import React from "react";


function Feed() {
  return (
    <div className="feed">
      <div className="job-search-section">
        <h2>Prepare for your job search</h2>
        <p>Add your work experience and skills to show your strengths to recruiters.</p>
        <button>Update profile</button>
      </div>
      <div className="post-section">
        <div className="post-input">
          <img src="/path/to/profile-image.jpg" alt="Profile" className="post-profile-image" />
          <input type="text" placeholder="Start a post, try writing with AI" />
        </div>
        <div className="post-options">
          <button>Media</button>
          <button>Event</button>
          <button>Write article</button>
        </div>
      </div>
      <div className="removed-post-notification">
        <p>Post removed from your feed</p>
        <button>Undo</button>
        <div className="feedback-options">
          <button>Not interested in this topic</button>
          <button>Not interested in Noir's posts</button>
          <button>Not appropriate for LinkedIn</button>
        </div>
      </div>
    </div>
  );
}

export default Feed;
