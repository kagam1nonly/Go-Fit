// Sidebar.js
import { IoSettingsOutline } from "react-icons/io5";
import { GiMuscleUp } from "react-icons/gi";
import { IoCreateOutline } from "react-icons/io5";
import { IoMdFitness } from "react-icons/io";
import { TbLogin2 } from "react-icons/tb";
import avatar from './imgs/user-avatar.png';
import logo from './imgs/logo.jpg';
import './css/Sidebar.css';
import axios from 'axios';

const Sidebar = ({ currentUser, onCategoryChange }) => {
  
  const username = currentUser && currentUser.users ? currentUser.users.username : 'Guest';
  console.log('Current user:', currentUser);

  const handleLogout = async () => {
    try {
      // Use window.confirm for logout confirmation
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      
      if (confirmLogout) {
        // Make a request to the logout endpoint
        await axios.post('http://localhost:8000/api/logout');
        localStorage.removeItem('authToken');
  
        alert('You are logged out!');
        window.location.reload();
      }
  
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="sidebar-container">
      <img src={logo} className="logo" alt="Logo" />
      <span className="gofit">GoFit</span>
      <div className="sidebar">
        <div className="info-avatar">
          <img src={avatar} alt="Avatar" className="avatar-icon" />
          <span className="info-name">{username}</span>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li onClick={() => onCategoryChange('exercise')}>
              Exercise <GiMuscleUp className="exercise-logo" />
            </li>
            <li onClick={() => onCategoryChange('workout')}>
              Workout <IoMdFitness className="workout-logo" /> 
            </li>
            <li className="" onClick={() => onCategoryChange('login')}>
              Login <TbLogin2 className="login"/>
            </li>
            <li className="" onClick={() => onCategoryChange('signup')}>
              Signup <IoCreateOutline className="signup" />
            </li>
            <li className="logout" onClick={handleLogout}>
              Logout <IoSettingsOutline className="setting" />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
