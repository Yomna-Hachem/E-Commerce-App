import React from 'react';
import styles from '../styles/Authentication.module.css';

export default function SignupForm({ onSwitchForm }) {
  return (
    <form id="signup-form" className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-name" className={styles.label}>Full Name</label>
        <input type="text" id="signup-name" className={styles.input} required />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-email" className={styles.label}>Email</label>
        <input type="email" id="signup-email" className={styles.input} required />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-password" className={styles.label}>Password</label>
        <input type="password" id="signup-password" className={styles.input} required />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="signup-confirm" className={styles.label}>Confirm Password</label>
        <input type="password" id="signup-confirm" className={styles.input} required />
      </div>
      <button type="submit" className={styles.actionBtn}>Sign Up</button>
      <div className={styles.switchText}>
        Already have an account?{' '}
        <span className={styles.link} onClick={onSwitchForm}>Login</span>
      </div>
    </form>
  );
}
