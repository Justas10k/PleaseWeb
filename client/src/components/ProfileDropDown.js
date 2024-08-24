import '../styles/ProfileDropDown.css';
import logo from '../img/shortlog.png';
import { useNavigate, Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const ProfileDropDown = ({ isProfileOpen }) => {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/linkpage');
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`profile-dropdown-menu ${isProfileOpen ? 'open' : ''}`}
      onClick={handleDropdownClick}
    >
      <div className="profile-dropdown-info">
        <img className="profile-dropdown-picture" src={logo} alt="Profile" />
        <div className="profile-dropdown-details">
          <p className="profile-dropdown-name">Justas Stankevicius</p>
        </div>
      </div>
      <Link className="profile-dropdown-view-profile" to="/Profile">
        View Profile
      </Link>
      <div className="profile-dropdown-menu-section">
        <p>Account</p>
        <a href="#">Try Premium for €0</a>
        <a href="#">Settings & Privacy</a>
        <a href="#">Help</a>
        <a href="#">Language</a>
      </div>
      <div className="profile-dropdown-menu-section">
        <p>Manage</p>
        <a href="#">Posts & Activity</a>
        <a href="#">Job Posting Account</a>
      </div>
      <button className="profile-dropdown-signout-button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

export default ProfileDropDown;
