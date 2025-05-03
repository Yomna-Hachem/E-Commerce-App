import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext'; // Adjust path as needed
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const { user, setUserDetails } = useUserContext();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
    };

    setUserDetails(updatedUser);
    alert('Your details have been saved successfully.');
    setIsEditing(false);
  };

  const handlePasswordUpdate = () => {
    if (user.password !== passwordFormData.oldPassword) {
      setError('Incorrect old password');
      console.log()
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const updatedUser = {
      ...user,
      password: passwordFormData.newPassword,
    };

    setUserDetails(updatedUser);
    alert('Password updated successfully.');
    setPasswordFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setIsPasswordUpdating(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      <img
        src={user?.profile_picture}
        alt="Profile"
        className={styles.profilePicture}
      />

      <div className={styles.profileDetails}>
        {!isEditing ? (
          <>
            <p><strong>First Name:</strong> {user?.first_name}</p>
            <p><strong>Last Name:</strong> {user?.last_name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <button className={styles.formButton} onClick={() => setIsEditing(true)}>Edit Information</button>
            <button className={styles.formButton} onClick={() => alert('Redirect to My Orders page')}>My Orders</button>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label>First Name:
                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>Last Name:
                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>Email:
                <input name="email" value={formData.email} onChange={handleChange} type="email" />
              </label>
            </div>
            <button className={styles.formButton} onClick={handleSave}>Save Details</button>
            <button className={styles.formButton} onClick={handleCancel}>Cancel</button>

            <hr />

            {!isPasswordUpdating ? (
              <button className={styles.formButton} onClick={() => setIsPasswordUpdating(true)}>Update Password</button>
            ) : (
              <div className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label>Old Password:
                    <input name="oldPassword" value={passwordFormData.oldPassword} onChange={handlePasswordChange} type="password" />
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>New Password:
                    <input name="newPassword" value={passwordFormData.newPassword} onChange={handlePasswordChange} type="password" />
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>Confirm New Password:
                    <input name="confirmPassword" value={passwordFormData.confirmPassword} onChange={handlePasswordChange} type="password" />
                  </label>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button className={styles.formButton} onClick={handlePasswordUpdate}>Save Password</button>
                <button className={styles.formButton} onClick={() => {
                  setIsPasswordUpdating(false);
                  setPasswordFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                  setError('');
                }}>Cancel</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
