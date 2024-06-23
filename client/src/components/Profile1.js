import React from "react";


function Profile() {
  return (
    <div className="profile">
      <div className="recommendations">
        <h3>Add to your feed</h3>
        <div className="recommendation">
          <img src="/path/to/recommendation-image.jpg" alt="Profile" />
          <div>
            <h4>Lex Fridman</h4>
            <p>Research Scientist, MIT</p>
            <button>+ Follow</button>
          </div>
        </div>
        <div className="recommendation">
          <img src="/path/to/recommendation-image.jpg" alt="Profile" />
          <div>
            <h4>Generative AI</h4>
            <p>Company • Computer Software</p>
            <button>+ Follow</button>
          </div>
        </div>
        <div className="recommendation">
          <img src="/path/to/recommendation-image.jpg" alt="Profile" />
          <div>
            <h4>JavaScript Mastery</h4>
            <p>Company • E-Learning</p>
            <button>+ Follow</button>
          </div>
        </div>
        <a href="#">View all recommendations</a>
      </div>
      <div className="footer">
        <a href="#">About</a>
        <a href="#">Accessibility</a>
        <a href="#">Help Center</a>
        <a href="#">Privacy & Terms</a>
        <a href="#">Ad Choices</a>
        <a href="#">Advertising</a>
        <a href="#">Business Services</a>
        <a href="#">Get the LinkedIn app</a>
        <a href="#">More</a>
        <p>LinkedIn Corporation © 2024</p>
      </div>
    </div>
  );
}

export default Profile;
