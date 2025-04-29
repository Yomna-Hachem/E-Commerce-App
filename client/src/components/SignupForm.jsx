import React, { useState } from 'react';
import styles from '../styles/Authentication.module.css';

export default function SignupForm({ onSwitchForm }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    const signupData = {
      firstName,
      lastName,
      email,
      password,
    };
    console.log("email:")
    console.log(signupData.email)

    try {
      const response = await fetch('http://localhost:5001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Signup successful!');
        // You can redirect or change UI as needed
      } else {
        alert('Signup failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <form id="signup-form" className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-first-name" className={styles.label}>First Name</label>
        <input
          type="text"
          id="signup-first-name"
          className={styles.input}
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-last-name" className={styles.label}>Last Name</label>
        <input
          type="text"
          id="signup-last-name"
          className={styles.input}
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-email" className={styles.label}>Email</label>
        <input
          type="email"
          id="signup-email"
          className={styles.input}
          placeholder="name@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-password" className={styles.label}>Password</label>
        <input
          type="password"
          id="signup-password"
          className={styles.input}
          minLength={8}
          maxLength={20}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-confirm" className={styles.label}>Confirm Password</label>
        <input
          type="password"
          id="signup-confirm"
          className={styles.input}
          minLength={8}
          maxLength={20}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <button type="submit" className={styles.actionBtn}>Sign Up</button>
      <div className={styles.switchText}>
        Already have an account?{' '}
        <span className={styles.link} onClick={onSwitchForm}>Login</span>
      </div>
    </form>
  );
}
