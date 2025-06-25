import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (err) {
            console.error('Token error', err);
            localStorage.removeItem('authToken');
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return <div className="container mt-5">Loading user data...</div>;

    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-primary">Welcome, {user.username}!</h2>
                <p className="text-muted">Your user ID is: {user.userId}</p>
            </div>

            <div className="row justify-content-center g-4">
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 text-center">
                        <div className="card-body">
                            <h5 className="card-title">My Profile</h5>
                            <p className="card-text">View and edit your personal profile.</p>
                            <button className="btn btn-outline-primary w-100" onClick={() => navigate(`/user/profile/${user.userId}`)}>Go to Profile</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 text-center">
                        <div className="card-body">
                            <h5 className="card-title">My Facilities</h5>
                            <p className="card-text">Check and manage your booked facilities.</p>
                            <button className="btn btn-outline-success w-100" onClick={() => navigate(`/user/facilities/${user.userId}`)}>View Facilities</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 text-center">
                        <div className="card-body">
                            <h5 className="card-title">My Trainers</h5>
                            <p className="card-text">See your assigned personal trainers.</p>
                            <button className="btn btn-outline-warning w-100" onClick={() => navigate(`/user/trainers/${user.userId}`)}>View Trainers</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-5">
                <button className="btn btn-secondary" onClick={() => {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;