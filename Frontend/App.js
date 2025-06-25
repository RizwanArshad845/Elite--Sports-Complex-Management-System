import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Home from './home';
import UserCrud from './usercrud';
import Facilities from './facilities';
import Trainers from './trainers.jsx';
import TimeSlots from './timeslots.jsx';
import FeedbackView from './feedbackview.jsx'
import Register from './register';
import UserFacilities from './userfacilities';
import UserTrainers from './usertrainers';
import UserProfile from './userprofile';
import BookFacility from './bookfacility';
import BookTrainer from './booktrainer';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin/users" element={<UserCrud />} />
                <Route path="/admin/facilities" element={<Facilities />} />
                <Route path="/admin/trainers" element={<Trainers />} />
                <Route path="/admin/timeslots" element={<TimeSlots />} />
                <Route path="/admin/feedback" element={<FeedbackView />} />
                <Route path="/user/register" element={<Register />} />
                <Route path="/user/facilities/:id" element={<UserFacilities />} />
                <Route path="/user/trainers/:id" element={<UserTrainers />} />
                <Route path="/user/profile/:id" element={<UserProfile />} />
                <Route path="/user/book-facility/:id" element={<BookFacility />} />
                <Route path="/user/book-trainer/:id" element={<BookTrainer />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
