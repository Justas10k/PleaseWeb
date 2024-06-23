import React from "react";


function Sidebar() {
  return (
    <div className="sidebar">
      <div className="profile-section">
        <img src="/path/to/profile-image.jpg" alt="Profile" className="profile-image" />
        <h2>Justas Stankevicius</h2>
        <p>Front-end Developer</p>
      </div>
      <div className="connections">
        <a href="#">Grow your network</a>
      </div>
      <div className="saved-items">
        <p>Saved items</p>
      </div>
      <div className="recent">
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
      <div className="events">
        <h3>Events</h3>
        <a href="#">Discover more</a>
      </div>
    </div>
  );
}

export default Sidebar;
