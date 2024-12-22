import React, { useState, useEffect, useRef } from 'react';
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
import ProfileDropdown from './ProfileDropDown';
import ShowProfilePicture from './ShowProfilePicture'

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
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
              <a className='nav-link' href={item.link}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </li>
          ))}
          <div className="nav-item profile-item" ref={profileRef} onClick={toggleProfileMenu}>
          <ShowProfilePicture/>
            <a className='nav-link'>
              <span className="Me-arrow-container">
                Me
                <div className="profile-arrow"></div>
              </span>
            </a>
            <ProfileDropdown isProfileOpen={isProfileOpen} />
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
