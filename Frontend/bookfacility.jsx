import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const BookFacility = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [slots, setSlots] = useState([]);
    const [formData, setFormData] = useState({ FacilityID: '', TimeSlotID: '' });

    useEffect(() => {
        axios.get('http://localhost:3000/api/facilities')
            .then(res => setFacilities(res.data))
            .catch(() => toast.error('Failed to load facilities'));

        axios.get('http://localhost:3000/api/timeslot')
            .then(res => setSlots(res.data))
            .catch(() => toast.error('Failed to load time slots'));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/bookings', {
                UserID: parseInt(id),
                FacilityID: parseInt(formData.FacilityID),
                TimeSlotID: parseInt(formData.TimeSlotID),
                BookingStatus: 'Pending'
            });
            toast.success("Facility booked!");
            setTimeout(() => navigate(`/user/facilities/${id}`), 1500);
        } catch (err) {
            console.error(err);
            toast.error("Booking failed.");
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h2 className="mb-4">Book New Facility</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Facility</label>
                    <select className="form-select" name="FacilityID" onChange={handleChange} required>
                        <option value="">-- Select Facility --</option>
                        {facilities.map(f => (
                            <option key={f.FacilityID} value={f.FacilityID}>
                                {f.FacilityName} ({f.FacilityType})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Time Slot</label>
                    <select className="form-select" name="TimeSlotID" onChange={handleChange} required>
                        <option value="">-- Select Time Slot --</option>
                        {slots.map(s => (
                            <option key={s.TimeSlotID} value={s.TimeSlotID}>
                                {s.StartTime} - {s.EndTime}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success w-100">Confirm Booking</button>
            </form>
        </div>
    );
};

export default BookFacility;
