import React, { useState } from 'react';
import styles from '../styles/Authentication.module.css';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Alert from './AlertComponent'; // Make sure the path is correct

function LoginForm({ onSwitchForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserDetails } = useUserContext();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Set user details in context
        setUserDetails({
          user_id: data.user.user_id,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          password: loginData.password,
          role: data.user.role,
          profile_picture: data.user.profile_picture,
        });

        localStorage.setItem('token', data.token);
        setErrorMessage('');
        navigate('/');
      } else {
        setAlertMessage('Login failed: ' + (data.message || 'Invalid credentials'));
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAlertMessage('An error occurred during login');
      setShowAlert(true);
    }
  };

  return (
    <>
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <form id="login-form" onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="login-email" className={styles.label}>Username or Email</label>
          <input
            type="text"
            className={styles.input}
            id="login-email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="login-password" className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.actionBtn}>Login</button>

        <div className={styles.switchLink}>
          Don't have an account?{' '}
          <span className={styles.link} onClick={onSwitchForm}>Sign Up</span>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
