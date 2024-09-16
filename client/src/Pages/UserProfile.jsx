import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Avatar from "../images/avatar15.jpg";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false); // reset the avatar change state

    try {
      const postData = new FormData();
      postData.set("avatar", avatar); // Make sure avatar is correctly set as a file

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: { 
            Authorization: `Bearer ${token}` // Ensure there is a space between Bearer and the token
          },
        }
      );

      // Update the avatar state with the filename or path returned from the server
      setAvatar(response?.data.avatar); 
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My posts
        </Link>

        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              {/* Ensure the image URL is correctly constructed */}
              <img
                src={ avatar ? `${process.env.REACT_APP_BASE_URL}/uploads/${avatar} `: ''} 
                alt="User Avatar"
              />
            </div>

            {/* Form for updating the avatar */}
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])} // Handle file input correctly
                accept="image/png, image/jpg, image/jpeg" // Correct format for accepted file types
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>

            {isAvatarTouched && (
              <button
                className="profile_avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>

          <h1>{currentUser.name}</h1>

          {/* Form to update user details */}
          <form className="form profile_form">
            {/* <p className="form_error-message">This is an error message</p> */}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <button type="submit" className="btn primary">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
