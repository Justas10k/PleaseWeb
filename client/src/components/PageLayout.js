import React from 'react';
import "../styles/PageLayout.css";

function PageLayout() {
  return (
    <div className="full-page-container">
      <div className="page-section page-side-section">
        <div className="profile-section">
          <img className="profile-picture" src="profile-pic-url" alt="Profile" />
          <h2>Justas Stankevicius</h2>
          <p>Front-end developer</p>
          <button className="grow-network-button">Grow your network</button>
          <div className="premium-promo">Job search smarter with Premium <button>Try for €0</button></div>
          <div className="saved-items">Saved items</div>
          <div className="recent-activity">
            <h3>Recent</h3>
            <p>JavaScript</p>
            <p>Front End Developer Group</p>
          </div>
          <div className="groups">
            <h3>Groups</h3>
            <p>JavaScript</p>
            <p>Front End Developer Group</p>
            <a href="#">See all</a>
          </div>
          <div className="events">Events</div>
          <div className="followed-hashtags">Followed Hashtags</div>
        </div>
      </div>
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
      <div className="page-section page-side-section">
        <div className="add-to-feed-section">
          <h3>Add to your feed</h3>
          <div className="recommendation">
            <p>Lex Fridman</p>
            <p>Research Scientist, MIT</p>
            <button>Follow</button>
          </div>
          <div className="recommendation">
            <p>Generative AI</p>
            <p>Company · Computer Software</p>
            <button>Follow</button>
          </div>
          <div className="recommendation">
            <p>JavaScript Mastery</p>
            <p>Company · E-Learning</p>
            <button>Follow</button>
          </div>
          <a href="#">View all recommendations</a>
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
