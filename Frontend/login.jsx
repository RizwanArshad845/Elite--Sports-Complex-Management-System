import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ Username: '', UserPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', credentials);
            const { token } = response.data;

            localStorage.setItem('authToken', token);
            toast.success('Login successful!');
            setTimeout(() => navigate('/home'), 1000);
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            toast.error('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <ToastContainer />
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Username"
                        value={credentials.Username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="UserPassword"
                        value={credentials.UserPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
