import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../images/avatar15.jpg";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [currentpassword, setcurrentpassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");

  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer${token}` } }
      );
      setAvatar(response?.data.avatar);
    } catch (error) {
      console.log(error);
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
              <img
                src={`${process.env.REACT_APP_BASE_URL}/uploads/${avatar}`}
                alt=""
              />
            </div>

            {/* from update avatar */}

            <form action="" className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png,jpg,jpeg"
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

          {/* form to update  user details  */}

          <form action="" className="form profile_form">
            <p className="form_error-message">This is an error message</p>

            <input
              type="text"
              placeholder="Full Name"
              id=""
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter Your email"
              id=""
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              placeholder="current password"
              id=""
              value={currentpassword}
              onChange={(e) => setcurrentpassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              id=""
              value={newpassword}
              onChange={(e) => setnewpassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="confirm new  password"
              id=""
              value={confirmNewPassword}
              onChange={(e) => setconfirmNewPassword(e.target.value)}
            />

            <button type="submit" className="btn primary">
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
