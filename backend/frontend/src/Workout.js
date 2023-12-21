import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './css/Workout.css';
import timer from './imgs/time-tracking.png';

const Workout = () => {
  const [users, setUsers] = useState({});
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    durationMinutes: '',
  });

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Authentication Token:', token);

      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      setUsers(response.data.users);  // Update this line
    } catch (error) {
      console.error('Error fetching user:', error);
      setUsers([]);  // Set users to an empty array if there's an error
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - Name: ${name}, Value: ${value}`);
    setFormData({ ...formData, [name]: value });
};

const fetchWorkouts = useCallback(async () => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/workouts/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  } else {
    console.warn('Authentication token is missing.');
  }
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await fetchUser();

    // Check if formData has an "id" to determine if it's an update
    const isUpdate = formData.id !== undefined;

    const response = await axios({
      method: isUpdate ? 'PUT' : 'POST',
      url: isUpdate ? `http://localhost:8000/api/workouts/${formData.id}/` : 'http://localhost:8000/api/workouts/',
      data: {
        user: users.id,
        date: formData.date,
        duration_minutes: Number(formData.durationMinutes),
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    if (response.status === 201 || response.status === 200) {
      console.log(`Workout ${isUpdate ? 'updated' : 'created'} successfully`);
      fetchWorkouts();
      setFormData({
        date: '',
        durationMinutes: '',
      });

      // Close the modal after creating/updating the workout
      setIsModalOpen(false);
    }
  } catch (error) {
    console.error(`Error ${formData.id ? 'updating' : 'creating'} workout:`, error);
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  }
};



const [isModalOpen, setIsModalOpen] = useState(false);

  // Step 2: Create a modal with a form to edit workout details
  const Modal = () => (
    <div className="modal">
      <h2>Edit Workout</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );

  const handleEditWorkout = (workoutId) => {
    // Find the workout with the given ID
    const workoutToEdit = workouts.find((workout) => workout.id === workoutId);
  
    // Set the form data with the workout details, including the ID
    setFormData({
      id: workoutToEdit.id,
      date: workoutToEdit.date,
      durationMinutes: workoutToEdit.duration_minutes,
    });
    setIsModalOpen(true);
  };

  const handleDeleteExercise = async (workoutId) => {
    try {
      await axios.delete(`http://localhost:8000/api/workouts/${workoutId}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
  
      console.log(`Workout with ID ${workoutId} deleted successfully`);
      fetchWorkouts();
    } catch (error) {
      console.error(`Error deleting workout with ID ${workoutId}:`, error);
    }
  };


useEffect(() => {
  fetchUser();
  fetchWorkouts();
}, [fetchUser, fetchWorkouts]);

if (!users || users.length === 0) {
  console.log('No user data available.');
  return null;
}
  // Log the current user and workouts
  console.log('Current User:', users);
  console.log('Current Workouts:', workouts);

  return (
    <div className="workout-container">
    <div className='workout'>
      <h1 className="section-title">Track workout</h1>
      <img src={timer} alt="Tracker" />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="durationMinutes">Duration (minutes):</label>
          <input
            type="number"
            id="durationMinutes"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">Add Workout</button>
      </form>
    </div>
      
      <div className='workout-list'>
      <h1>Tracked Workout</h1>
            {workouts.map((workout) => (
              <li className='li' key={workout.id}>
                <strong>Date:</strong> {workout.date}, <strong>Duration:</strong> {workout.duration_minutes} minutes
                <div className="workout-buttons">
                <button onClick={() => handleEditWorkout(workout.id)}>Edit</button>
                <button onClick={() => handleDeleteExercise(workout.id)}>Delete</button>
                </div>
              </li>
            ))}           
      </div>
      {isModalOpen && <Modal />}
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
