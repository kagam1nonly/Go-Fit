// Sidebar.js
import React from 'react';
import { FcSettings } from 'react-icons/fc';
import avatar from './imgs/kagami.jpg';
import logo from './imgs/logo.jpg';
import './css/Sidebar.css';

const Sidebar = ({ onCategoryChange }) => {
  return (
    <div className="sidebar-container">
      <img src={logo} className="logo" alt="Logo" />
      <span className="gofit">GoFit</span>
      <div className="sidebar">
        <div className="info-avatar">
          <img src={avatar} alt="Avatar" className="avatar-icon" />
          <span className="info-name">Kagami</span>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li onClick={() => onCategoryChange('dashboard')}>Dashboard</li>
            <li onClick={() => onCategoryChange('workout')}>Workout</li>
            <li className="" onClick={() => onCategoryChange('login')}>Login</li>
            <li className="" onClick={() => onCategoryChange('signup')}>Signup</li>
            <li className="logout">
              Logout <FcSettings className="setting" />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;