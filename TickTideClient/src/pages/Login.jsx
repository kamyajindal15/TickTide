import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authActions } from '../store/auth';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const [Data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    navigate("/"); // Redirect to home if already logged in
  }

  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (Data.username === "" || Data.password === "") {
        alert("All fields are required!");
      } else {
        const response = await axios.post("http://localhost:1000/api/v1/login", Data);
        setData({ username: "", password: "" });
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.username);
        localStorage.setItem("email", response.data.email);
        dispatch(authActions.login());
        navigate("/"); // Redirect to home after login
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className='h-[98vh] flex items-center justify-center'>
      <div className='p-4 w-2/6 rounded bg-gray-800'>
        <div className='text-white text-2xl font-semibold'>Login</div>
        <input type="text"
          placeholder='Username'
          className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
          name='username'
          value={Data.username}
          onChange={change}
        />
        <input type='password'
          placeholder='Password'
          className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
          name='password'
          value={Data.password}
          onChange={change}
        />
        <div className='w-full flex items-center justify-between'>
          <button className='bg-blue-400 text-xl font-semibold text-black px-3 py-2 rounded' onClick={submit}>Login</button>
          <Link className='text-white hover:text-gray-400' to='/signUp'>Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
