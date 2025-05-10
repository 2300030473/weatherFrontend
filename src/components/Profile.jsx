import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // useEffect(() => {
  //   async function profile() {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, { withCredentials: true });
  //       setName(response.data.user.username);
  //       setEmail(response.data.user.email);
  //     } catch (error) {
  //       console.error("Error fetching profile data:", error);
  //     }
  //   }

  //   profile();
  // }, []);

  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/logout`, { withCredentials: true });
  //     if (response.data.success) {
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.log("Error in logout:", error);
  //   }
  // };
  const handleLogout = () => {
    // Clear the token cookie by setting it to expire in the past
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Navigate to login page
    navigate("/login");
  };

  const handleBack = () => {
    navigate('/weather');
  };

  useEffect(() => {
    async function getDetails() {
      try {
        // Retrieve the token from cookies
        const token = getCookie('token');
        console.log(token)
        // Make sure the token exists before proceeding
        if (token) {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/getDetails`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true,
          });
          console.log(response.data.success);

          setName(response.data.fullname);
          setEmail(response.data.email);
          console.log(response.data.fullname);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    getDetails();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  // Function to get token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  return (
    <div className="weather-page">
      <div className="profile-card">
        <h1>Welcome, {name}!</h1>
        <p>Email: {email}</p>
        <button onClick={handleLogout} className="back-button">Logout</button>
        <button onClick={handleBack} className="back-button">Back to Weather</button>
      </div>
    </div>
  );
}

export default Profile;
