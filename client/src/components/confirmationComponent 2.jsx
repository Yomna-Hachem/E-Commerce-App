import React from 'react';
import styles from '../styles/Alert.module.css'; 

const ConfirmationComponent = ({ message, show, onYes, onNo }) => {
  if (!show) return null;

  return (
    <div className={styles.alertBackdrop}>
      <div className={styles.alertBox}>
        <div className={styles.alertMessage}>{message}</div>
        <div className={styles.buttonGroup}>
          <button className={styles.alertButton} onClick={onYes}>Yes</button>
          <button className={styles.alertButton} onClick={onNo}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationComponent;
