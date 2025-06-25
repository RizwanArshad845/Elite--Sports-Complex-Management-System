import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();

    const membershipOptions = {
        Silver: 5000,
        Gold: 10000
    };

    const [formData, setFormData] = useState({
        Username: '',
        UserPassword: '',
        Email: '',
        PhoneNumber: '',
        DOB: '',
        RegistrationDate: new Date().toISOString().split('T')[0],
        MembershipTypeName: 'Silver'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/users/register', formData);
            toast.success('Registration successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            toast.error('Failed to register user.');
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h2 className="text-center mb-4">User Registration</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" name="Username" value={formData.Username} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" name="UserPassword" value={formData.UserPassword} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="Email" value={formData.Email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" name="DOB" value={formData.DOB} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Select Membership</label>
                    <select name="MembershipTypeName" className="form-select" value={formData.MembershipTypeName} onChange={handleChange}>
                        {Object.entries(membershipOptions).map(([type, price]) => (
                            <option key={type} value={type}>
                                {type} (PKR {price})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 text-muted">
                    Selected Plan Price: <strong>PKR {membershipOptions[formData.MembershipTypeName]}</strong>
                </div>

                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
        </div>
    );
};

export default Register;
