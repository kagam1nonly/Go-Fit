import React, { useState } from 'react';
import './css/AccountCreationForm.css';
import axios from 'axios';

const AccountCreationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        weight: '',
        height: '',
        bmi: '',
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
            const response = await axios.post('http://localhost:8000/api/account_form/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 201) {
                console.log('Form submitted successfully');
                // Reset form data and clear errors on successful submission
                setFormData({
                    name: '',
                    email: '',
                    weight: '',
                    height: '',
                    bmi: '',
                    password: '',
                });
                setError(null);
            } else {
                const data = response.data;
                console.error('Form submission failed:', data.errors);
                // Display errors in a user-friendly manner
                setError(data.errors);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Log the detailed error information
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };
      
    

    return (
        <div className="form-container">
    <div className="header-container">
        <h1>Sign-up</h1>
    </div>
    <form onSubmit={handleSubmit} className="form-grid">
    
    <div className="form-box">
    <label>
        Name:
        <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            required
        />
        {error && error.name && (
            <span className="error-message">{error.name.join(', ')}</span>
        )}
    </label>
</div>

<div className="form-box">
    <label>
        Email:
        <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
        />
    </label>
</div>
        <div className="form-box">
            <label>
                Weight:
                <input type="text" name="weight" placeholder="Enter your weight" value={formData.weight} onChange={handleInputChange} required/>
            </label>
        </div>
        <div className="form-box">
            <label>
                Height:
                <input type="text" name="height" placeholder="Enter your height" value={formData.height} onChange={handleInputChange} required/>
            </label>
        </div>
        <div className="form-box">
            <label>
                BMI:
                <input type="text" name="bmi" placeholder="Enter your BMI" value={formData.bmi} onChange={handleInputChange} required/>
            </label>
        </div>
        <div className="form-box">
            <label>
                Password:
                <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} required/>
            </label>
        </div>
        
        <button type="submit" className='submit-btn'>
        submit
        </button>
    </form>
</div>



    );
};

export default AccountCreationForm;
