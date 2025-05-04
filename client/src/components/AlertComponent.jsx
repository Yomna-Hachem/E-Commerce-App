import React from 'react';
import styles from '../styles/Alert.module.css'; // Import as styles

const AlertComponent = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div className={styles.alertBackdrop}>
      <div className={styles.alertBox}>
        <div className={styles.alertMessage}>{message}</div>
        <button className={styles.alertButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AlertComponent;