import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  
  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `https://mern-blog-kappa-one.vercel.app/users/register`,
        userData
      );
  
      if (response && response.data) {
        const newUser = response.data;
        console.log(newUser);
        navigate('/');
      } else {
        setError("Couldn't register. Please try again");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't register. Please try again");
    }
  };
  
  






  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>

        <form className="form register_form" onSubmit={registerUser}>
          {error && (
            <p className="form_error-message">
              {error}
            </p>
          )}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
          />
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
          <input
            type="password"
            placeholder="Confirm Your Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />

          <button type="submit" className="btn primary">
            Register
          </button>
        </form>

        <small>
          Already have an account? <Link to="/login">Sign in </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
