// App.js
import React, { useState } from 'react';
import './css/App.css';
import Sidebar from './Sidebar';
import { MdNotStarted } from "react-icons/md";
import AccountCreationForm from './AccountCreationForm';
import LoginForm from './Login';
import Workout from './Workout';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('dashboard');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="app-container">
      <Sidebar onCategoryChange={handleCategoryChange} />
      <div className="dashboard-container">
        {selectedCategory === 'dashboard' && (
          <div className="dashboard-card1">
            <h2>Start Tracking</h2>
            <MdNotStarted className="start" />
          </div>
        )}
        {selectedCategory === 'workout' && (
          // Add your workout content here
          <div className="workout-card">
            <Workout />
          </div>
        )}
        {selectedCategory === 'login' && (
            <div className='login-card'>
              <LoginForm />
            </div>
        )}
        {selectedCategory === 'signup' && (
            <AccountCreationForm /> 
        )}
      </div>
    </div>
  );
}

export default App;
