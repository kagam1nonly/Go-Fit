import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './css/Workout.css';

const Workout = () => {
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    durationMinutes: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/account_form/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - Name: ${name}, Value: ${value}`);
    setFormData({ ...formData, [name]: value });
};

  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/workouts/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/workouts/',
        {
          user: users[0].id,
          date: formData.date,
          duration_minutes: Number(formData.durationMinutes),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );

      if (response.status === 201) {
        console.log('Workout created successfully');
        fetchWorkouts();
        setFormData({
          date: '',
          durationMinutes: '',
        });
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkouts();
  }, [fetchUsers, fetchWorkouts]);

  // Log the current user and workouts
  console.log('Current User:', users);
  console.log('Current Workouts:', workouts);

  return (
    <div className="workout-container">
      <div className='workout'>
        <h1>Workout</h1>
        {/* Your existing form logic */}
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </label>
          <label>
            Duration (minutes):
            <input
              type="number"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Add Workout</button>
        </form>
      </div>
      
      <div className='workout-list'>
      <h1>Workout List</h1>
            {workouts.map((workout) => (
              <li className='li' key={workout.id}>
                <strong>Date:</strong> {workout.date}, <strong>Duration:</strong> {workout.duration_minutes} minutes
              </li>
            ))}
      </div>
      
    </div>
  );
};

// Helper function to get the CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default Workout;
