import React, { useState, useEffect } from 'react';
import {
  IconHome,
  IconNetwork,
  IconBriefcase,
  IconMessageCircle,
  IconBell,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import '../styles/Nav.css';
import SearchInput from './SearchInput';
import logo from '../img/shortlog.png';

const Nav = () => {
  const navlinks = [
    {
      name: 'Home',
      link: '#home',
      icon: <IconHome size={20} />,
    },
    {
      name: 'My Network',
      link: '#myNetwork',
      icon: <IconNetwork size={20} />,
    },
    {
      name: 'Jobs',
      link: '#jobs',
      icon: <IconBriefcase size={20} />,
    },
    {
      name: 'Messaging',
      link: '#messaging',
      icon: <IconMessageCircle size={20} />,
    },
    {
      name: 'Notifications',
      link: '#notifications',
      icon: <IconBell size={20} />,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={`${scrolled ? 'scrolled' : ''}`}>
        <div className="logo-search-container">
          <a href="#home" className="centered">
            <img className="logo" src={logo} alt="logo" />
          </a>
          <SearchInput />
        </div>
  
        <span className="d-none d-lg-flex centered">
          {navlinks.map((item) => (
            <li key={item.name} className="nav-item">
              <a href={item.link}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </li>
          ))}
          <div className="nav-item profile-item" onClick={toggleProfileMenu}>
            <img className="profile-picture" src={logo}  alt="Profile" />
            <a><span className='Me-arrow-container'>Me             <div className="profile-arrow"></div> </span></a>
{/* Upside-down triangle */}
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img className="profile-picture-large" src={logo} alt="Profile" />
                  <div className="profile-details">
                    <p className="profile-name">Justas Stankevicius</p>
                    <p className="profile-title">Front-end developer</p>
                  </div>
                  <button className="view-profile-btn">View Profile</button>
                </div>
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
                <a href="#" className="sign-out">Sign Out</a>
              </div>
            )}
          </div>
        </span>
  
        <div className="d-md-block d-lg-none">
          <IconMenu2
            className={`icon nav-icon ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
          />
        </div>
      </nav>
  
      <div className="d-lg-none">
        <div className={`mobile-nav ${isOpen ? 'active' : ''}`}>
          <div className="slide-links">
            <IconX
              className={`icon nav-icon X-icon ${isOpen ? 'open' : ''}`}
              width={30}
              height={30}
              onClick={toggleMenu}
            />
  
            <ul>
              {navlinks.map((item) => (
                <li key={item.name}>
                  <a className="togglelink" href={item.link}>
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
