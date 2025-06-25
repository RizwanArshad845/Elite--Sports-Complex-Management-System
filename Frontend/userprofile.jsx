import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/users/${id}`)
            .then(res => setUser(res.data))
            .catch(err => {
                console.error(err);
                toast.error("Failed to load profile.");
            });
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3000/api/users/${id}`, user);
            toast.success("Profile updated");
            setEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile.");
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h2>User Profile</h2>
            <div className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input disabled={!editing} name="Username" value={user.Username || ''} className="form-control" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input disabled={!editing} name="Email" value={user.Email || ''} className="form-control" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input disabled={!editing} name="PhoneNumber" value={user.PhoneNumber || ''} className="form-control" onChange={handleChange} />
                </div>
                <div className="d-flex gap-2">
                    {!editing ? (
                        <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>
                    ) : (
                        <>
                            <button className="btn btn-success" onClick={handleSave}>Save</button>
                            <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
