  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';

  const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
    // useEffect(() => {
    //   const validate = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:8080/signin",{ withCredentials: true });
    //       console.log(response.data);
          
    //       if (response.data.success) {
    //         navigate("/weather");
    //       }
    //     } catch (error) {
    //       console.error("Error during authentication", error);
    //     }
    //   };
    
    //   validate();
    // }, []); 
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   console.log(formData.email, formData.password)
    //   try {
    //     const response = await axios.post('http://localhost:8080/users/signin', {email:formData?.email,password:formData?.password},{withCredentials:true});
    //     console.log(response)
    //     alert(response.data.message);
    //     if(response.data.success)
    //     {
    //       navigate("/weather")
    //     }
    
    //   } catch (error) {
    //     console.error('Error during login:', error);
    //     console.error('Error response:', error.response);
    //     setError(error.response?.data?.message || 'Login failed');
    //   }
    // };
    useEffect(() => {
      // Helper function to read a cookie by name
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
  
      const token = getCookie("token");
      if (token) {
        // ✅ Token found, redirect to weather page
        navigate("/weather");
      } 
    }, [navigate]);
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/signin`,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );
    
        console.log('Login successful:', response);
    
        // Extract token from response
        const [status, token] = response.data.split('::');
        if (status === '200' && token) {
          // ✅ Set the token in a cookie (expires in 7 days)
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    
          // ✅ Navigate to another page
          navigate("/weather");
        }
    
      } catch (error) {
        console.error('Error during login:', error);
        setError(error.response?.data?.message || 'Login failed');
      }
    };
    

    return (
      <div className="login-container">
        <h2>Welcome back to Atmos! Hope you’re staying warm (or cool)! 😎❄️</h2>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <span className="link" onClick={() => navigate('/register')}>Register</span></p>
        <p>Forgot your password? <span className="link" onClick={() => navigate('/forgot-password')}>Reset Password</span></p>
      </div>
    );
  };

  export default LoginForm;