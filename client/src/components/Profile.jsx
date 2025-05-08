import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../context/UserContext'; // Adjust path as needed
import styles from '../styles/Profile.module.css';
import Alert from './AlertComponent'; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, setUserDetails } = useUserContext();
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({firstName: '', lastName: '',email: '',});
  const [passwordFormData, setPasswordFormData] = useState({oldPassword: '', newPassword: '', confirmPassword: '',});
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name ,
        lastName: user.last_name ,
        email: user.email,
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
    const { firstName, lastName, email } = formData;
  
    // Validate the input fields
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setAlertMessage('All fields must be filled out.');
      setShowAlert(true);
      return;
    }
  
    // Call the API to update the user info
    fetch('http://localhost:5001/auth/updateUserInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
      }),
      credentials: 'include',
    })
      .then((response) => {

        if (response.ok){
          console.log("response OKKKKKK")
          setUserDetails((prev) => ({
            ...prev,
            first_name: firstName,
            last_name: lastName,
            email: email,
          }));
          setAlertMessage('Your details have been saved successfully.');
          setShowAlert(true);
          setIsEditing(false);
        }

        // If the response is not ok, throw an error
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Failed to update profile');
          });
        }

      })
      .catch((error) => {
        // If there's an error, show the error message
        setAlertMessage("error: " + error.message);
        setShowAlert(true);
      });
  };
  

  const handlePasswordUpdate = () => {

    if (!passwordFormData.oldPassword.trim() || !passwordFormData.newPassword.trim() || !passwordFormData.confirmPassword.trim()) {
      setAlertMessage('All fields must be filled out.');
      setShowAlert(true);
      return;
    }
  
    // Check password length
    if (passwordFormData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    // Validate current password
    if (user.password !== passwordFormData.oldPassword) {
      setAlertMessage('Incorrect current password.');
      setShowAlert(true);
      return;
    }
  
    // Validate new password match
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
  
    // Send API request to update the password
    fetch('http://localhost:5001/auth/updateUserPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setUserDetails((prev) => ({
            ...prev,
            password: passwordFormData.newPassword,
          }));
  
          setAlertMessage('Password updated successfully.');
          setShowAlert(true);
  
          // Reset password form fields
          setPasswordFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
  
          setError('');
          setIsPasswordUpdating(false);
        } else {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Failed to update password');
          });
        }
      })
      .catch((error) => {
        setAlertMessage('Error: ' + error.message);
        setShowAlert(true);
      });
  };
  
  const handleCancel = () => {
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
    });
    setIsEditing(false);
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!file.type.match('image.*')) {
      setAlertMessage('Please upload an image file');
      setShowAlert(true);
      return;
    }
  
    const imgFormData = new FormData();
    imgFormData.append('image', file);
  
    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: imgFormData,
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const data = await response.json();
      console.log(data)
      console.log('uploading')
      console.log(data.imagePath)
      
      // Use either the full user object from backend OR merge the path
      if (data.user) {
        setUserDetails(data.user); // Use complete user object from backend
      } 
      
  
      setAlertMessage('Profile picture updated successfully!');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error uploading image: ' + error.message);
      setShowAlert(true);
    }
  };

const handleImageClick = () => {
  if (isEditing) {
    fileInputRef.current.click();
  }
};


  
  return (
    <>
    <Alert
      message={alertMessage}
      show={showAlert}
      onClose={() => setShowAlert(false)}
    />
          <div className={styles.profileContainer}>
        <div
          className={styles.profilePictureContainer}
          onMouseEnter={() => isEditing && setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleImageClick}
        >
          <img
            src={user?.profile_picture || '/default-profile.png'}
            alt="Profile"
            className={styles.profilePicture}
          />
          {isEditing && isHovering && (
            <div className={styles.profilePictureOverlay}>
              <span>Change Photo</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

      <div className={styles.profileDetails}>
        {!isEditing ? (
          <>
            <p><strong>First Name:</strong> {user?.first_name}</p>
            <p><strong>Last Name:</strong> {user?.last_name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <button className={styles.formButton} onClick={() => setIsEditing(true)}>Edit Information</button>
            <button className={styles.formButton} onClick={() => navigate('/myOrderPage')}>My Orders</button>
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
    </>
  );
};

export default Profile;