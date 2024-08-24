import React from 'react';
import "../styles/PageLayout.css";

function AddToFeedSection() {
  return (
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
  );
}

export default AddToFeedSection;
