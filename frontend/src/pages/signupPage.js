import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import useSignup from '../hooks/useSignup';
import './signupPage.css'; // Import your CSS file

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useSignup();

  const handleSubmit = () => {
    const validation = true; // Replace with actual validation logic
    if (validation) {
      signup({ email, password });
      console.log('Signup successful');
    } else {
      alert('Validation Failed'); // Modify as needed
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create an Account</h2>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <button onClick={handleSubmit}>Sign Up</button>
        <Link to="/login" className="login-link">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default SignupPage;
