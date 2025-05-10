import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '', // Added phone field
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // useEffect(() => {
  //   async function validate(){
  //     try {
  //       const response = await axios.get("http://localhost:6500/isAuthenticated",{ withCredentials: true });
  //       console.log(response.data);
        
  //       if (response.data.success) {
  //         navigate("/weather");
  //       }
  //     } catch   (error) {
  //       console.error("Error during authentication", error);
  //     }
  //   };
  
  //   validate();
  // }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    console.log('Form Data:', formData); 
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
        fullname: formData?.username,
        email: formData?.email,
        mobile: formData?.phone, // Include phone in the request
        password: formData?.password
      }, { withCredentials: true });
      alert('Registration successful!');
      setFormData({
        username: '',
        email: '',
        phone: '', // Reset phone field
        password: '',
        confirmPassword: ''
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error); 
      alert(error.response?.data?.message || 'Error during registration. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Join the Atmos family and stay one step ahead of the weather! 🌞</h2>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number" // Added phone number field
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login</span></p>
    </div>
  );
}

export default RegisterForm;