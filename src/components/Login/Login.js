
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from '../Services/authServices';
 
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      onLogin();
      navigate('/menu');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome to CE Monitoring Dashboard</h2>
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" placeholder="Username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required className="login-input"
          />

          <input type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
} 
export default Login;
/*

import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');   // default value
  const [password, setPassword] = useState('1234');    // default value

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onLogin();
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome to CE Monitoring Dashboard</h2>
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
*/