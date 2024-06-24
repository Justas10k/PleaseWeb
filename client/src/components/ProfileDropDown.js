import React from 'react';
import '../styles/ProfileDropDown.css';
import logo from '../img/shortlog.png';
import { useNavigate, Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const ProfileDropdown = ({ isProfileOpen }) => {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/linkpage');
  };

  const handleDropdownClick = (event) => {
    // Prevent click event from propagating to parent elements
    event.stopPropagation();
  };

  return (
    <div
      className={`profile-dropdown ${isProfileOpen ? 'open' : ''}`}
      onClick={handleDropdownClick}
    >
      <div className="profile-info">
        <img className="profile-picture-large" src={logo} alt="Profile" />
        <div className="profile-details">
          <p className="profile-name">Justas Stankevicius</p>
        </div>
      </div>
      <Link className="view-profile-link" to="/Profile">
        View Profile
      </Link>
      <div className="profile-menu">
        <p>Account</p>
        <a href="#">Try Premium for €0</a>
        <a href="#">Settings & Privacy</a>
        <a href="#">Help</a>
        <a href="#">Language</a>
      </div>
      <div className="profile-menu">
        <p>Manage</p>
        <a href="#">Posts & Activity</a>
        <a href="#">Job Posting Account</a>
      </div>
      <button className="sign-out-button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

export default ProfileDropdown;
