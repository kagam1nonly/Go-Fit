import React, { useState } from 'react';
import './css/Login.css';

const LoginForm = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        setError(null);
        localStorage.setItem('authToken', authToken);
        props.onTokenChange(authToken); // Add this line
        alert('You are logged in!');
        window.location.reload();
        console.log('Authentication Token:', authToken);
      } else {
        const data = await response.json();
        console.error('Login failed:', data.error);
        setError(data.error);

        // Check for user/password doesn't exist error (500)
        if (response.status === 500) {
          console.error('User or password doesn\'t exist');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='login-card'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type='submit'>Login</button>
        {error && <span className='error-message'>{error}</span>}
      </form>
    </div>
  );
};

export default LoginForm;
