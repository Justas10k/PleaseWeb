import React from "react";
import "../styles/PageLayout.css";
import ProfileSection from "./ProfileSection";
import MainSection from "./MainSection";
import AddToFeedSection from "./AddToFeedSection";

function PageLayout() {
  return (
    <div className="full-page-container">
      <div className="page-left-side">
        <ProfileSection />
      </div>
      <div className="page-center-side">
        <MainSection />
      </div>
      <div className="page-right-side">
        <AddToFeedSection />
      </div>
    </div>
  );
}

export default PageLayout;
