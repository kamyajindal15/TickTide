import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector } from 'react-redux';
const SignUp = () => {
    const history = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    if (isLoggedIn === true) {
        history("/");
    }

    const [Data, setData] = useState({ username: "", email: "", password: "" });
    const change = (e) => {
        const { name, value } = e.target;
        setData({ ...Data, [name]: value });
    };
    const submit = async () => {
        try {
            if (Data.username === "" || Data.email === "" || Data.password === "") {
                alert("All fields are required!");
            }
            else {
                const response = await axios.post("http://localhost:1000/api/v1/sign-up", Data);
                setData({ username: "", email: "", password: "" })
                alert(response.data.message);
                history("/login");
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    return (
        <div className='h-[98vh] flex items-center justify-center'>
            <div className='p-4 w-2/6 rounded bg-gray-800'>
                <div className='text-white text-2xl font-semibold'>Sign Up</div>

                <input type="username"
                    placeholder='username'
                    className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
                    name='username'
                    value={Data.username}
                    onChange={change}
                />

                <input type='email'
                    placeholder='email'
                    className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
                    name='email'
                    value={Data.email}
                    onChange={change}
                />

                <input type='password'
                    placeholder='password'
                    className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
                    name='password'
                    value={Data.password}
                    onChange={change}
                />

                <div className='w-full flex items-center justify-between'>
                    <button className='bg-blue-400 text-xl font-semibold text-black px-3 py-2 rounded' onClick={submit}>SignUp</button>
                    <Link className='text-white hover:text-gray-400' to='/login'>Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};
export default SignUp;