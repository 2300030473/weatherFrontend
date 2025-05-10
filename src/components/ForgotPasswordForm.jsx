import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:6500/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage(error.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      <p>Remembered your password? <span className="link" onClick={() => navigate('/login')}>Login</span></p>
    </div>
  );
}

export default ForgotPasswordForm;