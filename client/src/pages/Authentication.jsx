import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import styles from '../styles/Authentication.module.css';

function AuthComponent() {
  const [currentForm, setCurrentForm] = useState('login');

  return (
    <div className={styles.authContainer}>
      <h2 id="form-title">
        {currentForm === 'login' ? 'Login' : 'Sign Up'} 
      </h2>

      {currentForm === 'login' ? (
        <LoginForm
          onSwitchForm={() => setCurrentForm('signup')}
          onForgotPassword={() => alert('Forgot password logic goes here')}
        />
      ) : (
        <SignupForm
          onSwitchForm={() => setCurrentForm('login')}
        />
      )}
    </div>

  );
}

export default AuthComponent;