// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const UserCrud = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState({
//         UserID: null,
//         Username: '',
//         UserPassword: '',
//         Email: '',
//         PhoneNumber: '',
//         DOB: '',
//         RegistrationDate: ''
//     });
//     const [editing, setEditing] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const API_URL = "http://localhost:3000/api/users";
//     // const API_URL = "/api/users";
//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(API_URL);
//             console.log("API Response:", response.data);
            
//             if (response.data.success && Array.isArray(response.data.users)) {
//                 setUsers(response.data.users);
//                 setUserId(response.data.users.UserID);
//             } else {
//                 throw new Error("Invalid data format");
//             }
//         } catch (error) {
//             console.error("Fetch Error:", {
//                 message: error.message,
//                 response: error.response?.data,
//                 status: error.response?.status
//             });
//             toast.error("Failed to load users");
//             setUsers([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUser({ ...user, [name]: value });
//     };

//     const resetForm = () => {
//         setUser({
//             UserID: null,
//             Username: '',
//             UserPassword: '',
//             Email: '',
//             PhoneNumber: '',
//             DOB: '',
//             RegistrationDate: ''
//         });
//         setEditing(false);
//         setUserId(null);
//     };

//     const saveUser = async (e) => {
//         e.preventDefault();
//         try {
//             if (editing) {
//                 await axios.put(`${API_URL}/${userId}`, user);
//                 toast.success("User updated successfully");
//             } else {
//                 await axios.post(API_URL, user);
//                 toast.success("User created successfully");
//             }
//             resetForm();
//             fetchUsers();
//         } catch (error) {
//             console.error("Error saving user", error);
//             toast.error("Failed to save user");
//         }
//     };

//     const editUser = async (userID) => {
//         try {
//             const response = await axios.get(`${API_URL}/${userID}`);
//             const userData = response.data;
            
//             // Format dates for input fields
//             const formatDate = (dateString) => 
//                 dateString ? dateString.split('T')[0] : '';
                
//             setUser({
//                 ...userData,
//                 DOB: formatDate(userData.DOB),
//                 RegistrationDate: formatDate(userData.RegistrationDate)
//             });
            
//             setEditing(true);
//             setUserId(userID);
//         } catch (error) {
//             console.error("Error fetching user details", error);
//             toast.error("Failed to load user details");
//         }
//     };

//     const deleteUser = async (userID) => {
//         try {
//             await axios.delete(`${API_URL}/${userID}`);
//             toast.success("User deleted successfully");
//             fetchUsers();
//         } catch (error) {
//             console.error("Error deleting user", error);
//             toast.error("Failed to delete user");
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h1>User CRUD</h1>
//             <ToastContainer />

//             {/* User Form */}
//             <div className="card mb-4">
//                 <div className="card-header">
//                     {editing ? "Edit User" : "Add User"}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={saveUser}>
//                         <div className="row mb-3">
//                             <div className="col-md-6">
//                                 <label className="form-label">Username</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="Username"
//                                     value={user.Username || ''}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="form-label">Password</label>
//                                 <input
//                                     type="password"
//                                     className="form-control"
//                                     name="UserPassword"
//                                     value={user.UserPassword || ''}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="row mb-3">
//                             <div className="col-md-6">
//                                 <label className="form-label">Email</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     name="Email"
//                                     value={user.Email || ''}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="form-label">Phone Number</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="PhoneNumber"
//                                     value={user.PhoneNumber || ''}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>
//                         <div className="row mb-3">
//                             <div className="col-md-6">
//                                 <label className="form-label">Date of Birth</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     name="DOB"
//                                     value={user.DOB || ''}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="form-label">Registration Date</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     name="RegistrationDate"
//                                     value={user.RegistrationDate || ''}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>
//                         <div className="d-flex gap-2">
//                             <button type="submit" className="btn btn-primary">
//                                 {editing ? "Update" : "Save"}
//                             </button>
//                             <button type="button" className="btn btn-secondary" onClick={resetForm}>
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* User Table */}
//             <div className="card">
//                 <div className="card-header">
//                     Users List
//                 </div>
//                 <div className="card-body">
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Username</th>
//                                 <th>Password</th>
//                                 <th>Email</th>
//                                 <th>Phone Number</th>
//                                 <th>DOB</th>
//                                 <th>Registration Date</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="8" className="text-center">Loading...</td>
//                                 </tr>
//                             ) : users.length > 0 ? (
//                                 users.map((user) => (
//                                     <tr key={user.UserID}>
//                                         <td>{user.UserID}</td>
//                                         <td>{user.Username}</td>
//                                         <td>{user.UserPassword}</td>
//                                         <td>{user.Email}</td>
//                                         <td>{user.PhoneNumber}</td>
//                                         <td>{user.DOB ? user.DOB.split('T')[0] : ''}</td>
//                                         <td>{user.RegistrationDate ? user.RegistrationDate.split('T')[0] : ''}</td>
//                                         <td>
//                                             <button
//                                                 className="btn btn-warning me-2"
//                                                 onClick={() => editUser(user.UserID)}
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 className="btn btn-danger"
//                                                 onClick={() => deleteUser(user.UserID)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" className="text-center">No users found</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserCrud;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserCrud = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/users/${id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => 
        user.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5">
            <ToastContainer />
            <h2 className="mb-4 text-center">Manage Users</h2>

            <div className="mb-4 d-flex justify-content-center">
                <input
                    type="text"
                    placeholder="Search by username"
                    className="form-control w-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div className="col-md-4 mb-4" key={user.UserID}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{user.Username}</h5>
                                    <p className="card-text">
                                        <strong>Email:</strong> {user.Email}<br />
                                        <strong>Phone:</strong> {user.PhoneNumber}<br />
                                        <strong>DOB:</strong> {new Date(user.DOB).toLocaleDateString()}
                                    </p>
                                    <button
                                        className="btn btn-danger btn-sm w-100"
                                        onClick={() => handleDelete(user.UserID)}
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-4">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default UserCrud;
