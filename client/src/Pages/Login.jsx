import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.js";
import axios from 'axios';

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext); // Use useContext here

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // Login user
  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = response.data; 
      setCurrentUser(user);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign In</h2>

        <form className="form login_form" onSubmit={loginUser}>
          {error && <p className="form_error-message">{error}</p>}

          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>

        <small>
          Don't have an account?<Link to="/register">Sign up </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
