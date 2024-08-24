import React from 'react';
import '../styles/ProfileSection.css';
import logo from '../img/shortlog.png';
import background from '../img/gimme2.jpg';

function ProfileSection() {
  return (
    <div className="profile-section-card">
      <div className="profile-section-header">
        <img className="profile-section-cover" src={background} alt="Cover" />
        <img className="profile-section-picture" src={logo} alt="Profile" />
      </div>
      <div className="profile-section-body">
        <h2>Name</h2>
        <p className="profile-section-quote">I'd love to change the world, but they won't give me the source code.</p>
        <div className="profile-section-stats">
          <div>
            <strong>256</strong> <span>Post</span>
          </div>
          <div>
            <strong>2.5K</strong> <span>Followers</span>
          </div>
          <div>
            <strong>365</strong> <span>Following</span>
          </div>
        </div>
      </div>
      <div className="profile-section-footer">
        <ul className="profile-section-menu">
          <li><a href="#"><img src="icon-feed-url" alt="Feed" /> Feed</a></li>
          <li><a href="#"><img src="icon-connections-url" alt="Connections" /> Connections</a></li>
          <li><a href="#"><img src="icon-news-url" alt="Latest News" /> Latest News</a></li>
          <li><a href="#"><img src="icon-events-url" alt="Events" /> Events</a></li>
          <li><a href="#"><img src="icon-groups-url" alt="Groups" /> Groups</a></li>
          <li><a href="#"><img src="icon-notifications-url" alt="Notifications" /> Notifications</a></li>
          <li><a href="#"><img src="icon-settings-url" alt="Settings" /> Settings</a></li>
        </ul>
        <a href="#" className="profile-section-view-profile">View Profile</a>
      </div>
    </div>
  );
}

export default ProfileSection;
