// Exercise.js
import React, { useState, useEffect, useCallback } from 'react';
import deadliftImage from './imgs/deadlift.gif';
import pushupImage from './imgs/pushup.gif';
import jumpingjackImage from './imgs/jumping-jack.gif';
import overheadpressImage from './imgs/overhead-press.gif';
import squatImage from './imgs/squat.gif';
import benchpressImage from './imgs/benchpress.gif';
import axios from 'axios';
import './css/Exercise.css';

const Exercise = () => {

  const [user, setUser] = useState({});
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    repetitions: '',
    weight: '',
  });

  const [exercisePreviews, setExercisePreviews] = useState([]); 

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Authentication Token:', token);

      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      setUser(response.data.users);  
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser([]);  
    }
  }, []);

  const fetchExercises = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (token && user) {
      try {
        const response = await axios.get(`http://localhost:8000/api/workout-exercises/?user=${user.id}`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    } else {
      console.warn('Authentication token or user data is missing.');
    }
  }, [user]);

  const fetchExercisePreviews = useCallback(async () => {
    const token = localStorage.getItem('authToken');
  
    try {
      const response = await axios.get('http://localhost:8000/api/exercises/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setExercisePreviews(response.data);
    } catch (error) {
      console.error('Error fetching exercise previews:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchUser();
    const token = localStorage.getItem('authToken');
  
    if (token) {
      try {
        const response = await axios.post('http://localhost:8000/api/workout-exercises/', {
          user: user.id,
          exercise: formData.exercise,
          sets: formData.sets,
          repetitions: formData.repetitions,
          weight: formData.weight,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
  
        if (response.status === 201) {
          alert('Exercise created successfully');
          console.log('Exercise created successfully');
          fetchExercises();
          setFormData({
            sets: '',
            repetitions: '',
            weight: '',
            exercise: '',
          });
        }
      } catch (error) {
        console.error('Error creating exercise:', error);
        console.log('Detailed error response:', error.response.data);
      }
    } else {
      console.warn('Authentication token is missing.');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchExercises();
    fetchExercisePreviews();  
  }, [fetchUser, fetchExercises, fetchExercisePreviews]);

  return (
    <div className="exercise-container">
      <div className='exercise'>
        <h1>Exercise</h1>
        <form onSubmit={handleSubmit}>
          <label className="exercise-label">
            Exercise:
            <select className="exercise-dropdown" name="exercise" value={formData.exercise} onChange={handleInputChange}>
              <option value="">Select an exercise</option>
              {exercisePreviews.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
              ))}
            </select>
          </label>
          <label>
            Sets:
            <input type="number" name="sets" value={formData.sets} onChange={handleInputChange} />
          </label>
          <label>
            Repetitions:
            <input type="number" name="repetitions" value={formData.repetitions} onChange={handleInputChange} />
          </label>
          <label>
            Weight:
            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} />
          </label>
          <button type="submit">Add Exercise</button>
        </form>
      </div>

      <div className="middle-container">
        <img src={deadliftImage} alt="Deadlift" />
        <img src={pushupImage} alt="Pushup" />
        <img src={jumpingjackImage} alt="Jumping Jack" />
        <img src={overheadpressImage} alt="Overhead Press" />
        <img src={squatImage} alt="Squat" />
        <img src={benchpressImage} alt="Bench Press" />
      </div>

      <div className='exercise-list'>
        <h1>Exercise List</h1>
        {exercises.map((exercise) => (
          <div key={exercise.id} className='exercise-item'>
            <p><strong>Exercise:</strong> {exercise.exercise}</p>
            <p><strong>Sets:</strong> {exercise.sets}</p>
            <p><strong>Repetitions:</strong> {exercise.repetitions}</p>
            <p><strong>Weight:</strong> {exercise.weight}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get the CSRF token


// Helper function to get the CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default Exercise;
