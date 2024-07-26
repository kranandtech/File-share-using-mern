import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import useLogin from '../hooks/useLogin';
import './loginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useLogin();

  const handleSubmit = () => {
    const validation = true; 
    if (validation) {
      login({ email, password });
      console.log('login successful');
    } else {
      alert('Validation Failed'); 
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to Your Account</h2>
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
        <button onClick={handleSubmit}>Login</button>
        <Link to="/signup" className="signup-link">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};

export default LoginPage;
