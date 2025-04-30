import React, { useState } from 'react';
import styles from '../styles/Authentication.module.css';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';



function LoginForm({ onSwitchForm }) {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const { setUserDetails } = useUserContext(); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    const loginData = {
      username,
      password,
    };

    try {
      // Send POST request to the backend authentication route  
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      
      const data = await response.json();

      if (data.success) {
        // Assuming the response returns user data (name, id, etc.)
        setUserDetails({ 
          user_id: data.user.user_id, 
          first_name: data.user.first_name, 
          last_name: data.user.last_name,
          email: data.user.email,
          role: data.user.role,
          profile_picture: data.user.profile_picture,
        });
      } else {
        // Handle login failure (e.g., show an error message)
        console.error('Login failed');
      }

      console.log(response.ok);
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        setErrorMessage(''); // clear error if it existed
        navigate('/'); // ✅ Redirect to homepage
        // You can redirect the user or update the UI as needed
      } else {
        console.log("hi")
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
    
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="login-email" className={styles.label}>Username or Email</label>
        <input
          type="text"
          className={styles.input}
          id="login-email"
          value={username} // Bound to state
          onChange={(e) => setUsername(e.target.value)} // Update state on change
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="login-password" className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          id="login-password"
          value={password} // Bound to state
          onChange={(e) => setPassword(e.target.value)} // Update state on change
          required
        />
      </div>


      <button type="submit" className={styles.actionBtn}>Login</button>

      <div className={styles.switchLink}>
        Don't have an account?{' '}
        <span className={styles.link} onClick={onSwitchForm}>Sign Up</span>
      </div>
    </form>
  );
}

export default LoginForm