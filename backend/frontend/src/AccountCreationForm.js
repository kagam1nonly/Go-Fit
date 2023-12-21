import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap'; 
import './css/AccountCreationForm.css';
import axios from 'axios';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});
const AccountCreationForm = (e) => {

    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistrationToggle] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function update_form_btn() {
        if (registrationToggle) {
          document.getElementById("form_btn").innerHTML = "Register";
          setRegistrationToggle(false);
        } else {
          document.getElementById("form_btn").innerHTML = "Log in";
          setRegistrationToggle(true);
        }
      }
    
      function submitRegistration(e) {
        e.preventDefault();
        client.post("/api/register", {
          email: email,
          username: username,
          password: password
        }).then(function(res) {
          alert("Registration successful!");
          console.log("Registration successful:", res.data);
          
        }).catch(function(error) {
          // Handle registration errors if needed
          console.error("Registration failed:", error);
        });
      }

      return (
        <div className="signup-card">
          <h2>Create Account</h2>
          <Form onSubmit={submitRegistration}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      );
    };

export default AccountCreationForm;
