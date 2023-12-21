// App.js
import { useState, useEffect } from 'react';
import './css/App.css';
import Sidebar from './Sidebar';
import { MdNotStarted } from "react-icons/md";
import axios from 'axios';
import AccountCreationForm from './AccountCreationForm';
import LoginForm from './Login';
import Workout from './Workout';
import Exercise from './Exercise';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});


function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (authToken) {
      axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Token ${authToken}`
        }
      })
      .then(response => {
        console.log('User is authenticated', response.data);
        setCurrentUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });
    }
  }, [authToken]);

  const handleTokenChange = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setAuthToken(newToken);
  };

  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [selectedCategory, setSelectedCategory] = useState('dashboard');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
        <div className="app-container">
          <Sidebar currentUser={currentUser} authToken={authToken} onCategoryChange={handleCategoryChange} />
          <div className="dashboard-container" style={{ display: selectedCategory !== 'dashboard' ? 'block' : 'none' }}>
            {selectedCategory === 'dashboard' && (
              <div className="dashboard-card1">
                <h2>Start Tracking</h2>
                <MdNotStarted className="start" />
              </div>
            )}
            {selectedCategory === 'exercise' && (
              // Add your workout content here
              <div className="exercise-card">
                <Exercise />
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
                  <LoginForm onTokenChange={handleTokenChange} />
                </div>
            )}
            {selectedCategory === 'signup' && (
              <div className='signup-card'>
                <AccountCreationForm /> 
              </div>
            )}
          </div>
        </div>
      );
    }

  

export default App;
