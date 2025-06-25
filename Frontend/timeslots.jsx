// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { toast, ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // const TimeSlots = () => {
// //     const [timeslots, setTimeSlots] = useState([]);
// //     const [formData, setFormData] = useState({ StartTime: '', EndTime: '' });
// //     const [editMode, setEditMode] = useState(false);
// //     const [editId, setEditId] = useState(null);

// //     const fetchTimeSlots = async () => {
// //         try {
// //             const response = await axios.get('http://localhost:3000/api/timeslot');
// //             setTimeSlots(response.data);
// //         } catch (error) {
// //             console.error('Error fetching timeslots:', error);
// //             toast.error('Failed to fetch timeslots');
// //         }
// //     };

// //     useEffect(() => {
// //         fetchTimeSlots();
// //     }, []);

// //     const handleChange = (e) => {
// //         setFormData({ ...formData, [e.target.name]: e.target.value });
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             if (editMode) {
// //                 await axios.put(`http://localhost:3000/api/timeslot/${editId}`, formData);
// //                 toast.success('TimeSlot updated successfully');
// //             } else {
// //                 await axios.post('http://localhost:3000/api/timeslot', formData);
// //                 toast.success('TimeSlot created successfully');
// //             }
// //             setFormData({ StartTime: '', EndTime: '' });
// //             setEditMode(false);
// //             setEditId(null);
// //             fetchTimeSlots();
// //         } catch (error) {
// //             console.error('Error saving timeslot:', error);
// //             toast.error('Failed to save timeslot');
// //         }
// //     };

// //     const handleEdit = (timeslot) => {
// //         setFormData({ StartTime: timeslot.StartTime, EndTime: timeslot.EndTime });
// //         setEditMode(true);
// //         setEditId(timeslot.TimeSlotID);
// //     };

// //     const handleDelete = async (id) => {
// //         if (!window.confirm('Are you sure you want to delete this timeslot?')) return;

// //         try {
// //             await axios.delete(`http://localhost:3000/api/timeslot`);
// //             toast.success('TimeSlot deleted successfully');
// //             fetchTimeSlots();
// //         } catch (error) {
// //             console.error('Error deleting timeslot:', error);
// //             toast.error('Failed to delete timeslot');
// //         }
// //     };

// //     return (
// //         <div className="container py-5">
// //             <ToastContainer />
// //             <h2 className="mb-4 text-center">Manage TimeSlots</h2>

// //             <div className="card p-4 mb-5 shadow-sm">
// //                 <h5>{editMode ? 'Edit TimeSlot' : 'Create New TimeSlot'}</h5>
// //                 <form onSubmit={handleSubmit}>
// //                     <div className="mb-3">
// //                         <label className="form-label">Start Time</label>
// //                         <input
// //                             type="text"
// //                             name="StartTime"
// //                             className="form-control"
// //                             value={formData.StartTime}
// //                             onChange={handleChange}
// //                             placeholder="e.g., 09:00 AM"
// //                             required
// //                         />
// //                     </div>
// //                     <div className="mb-3">
// //                         <label className="form-label">End Time</label>
// //                         <input
// //                             type="text"
// //                             name="EndTime"
// //                             className="form-control"
// //                             value={formData.EndTime}
// //                             onChange={handleChange}
// //                             placeholder="e.g., 10:00 AM"
// //                             required
// //                         />
// //                     </div>
// //                     <button type="submit" className="btn btn-primary w-100">
// //                         {editMode ? 'Update TimeSlot' : 'Create TimeSlot'}
// //                     </button>
// //                 </form>
// //             </div>

// //             <div className="row">
// //                 {timeslots.length > 0 ? (
// //                     timeslots.map((slot) => (
// //                         <div className="col-md-4 mb-4" key={slot.TimeSlotID}>
// //                             <div className="card h-100 shadow-sm">
// //                                 <div className="card-body">
// //                                     <h5 className="card-title">{slot.StartTime} - {slot.EndTime}</h5>
// //                                     <div className="d-flex justify-content-between">
// //                                         <button
// //                                             className="btn btn-warning btn-sm"
// //                                             onClick={() => handleEdit(slot)}
// //                                         >
// //                                             Edit
// //                                         </button>
// //                                         <button
// //                                             className="btn btn-danger btn-sm"
// //                                             onClick={() => handleDelete(slot.TimeSlotID)}
// //                                         >
// //                                             Delete
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))
// //                 ) : (
// //                     <div className="text-center mt-4">No timeslots found.</div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default TimeSlots;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimeSlots = () => {
    const [timeslots, setTimeSlots] = useState([]);
    const [formData, setFormData] = useState({ StartTime: '', EndTime: '' });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/timeslot');
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
            toast.error('Failed to fetch timeslots');
        }
    };

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:3000/api/timeslot/${editId}`, formData);
                toast.success('TimeSlot updated successfully');
            } else {
                await axios.post('http://localhost:3000/api/timeslot', formData);
                toast.success('TimeSlot created successfully');
            }
            setFormData({ StartTime: '', EndTime: '' });
            setEditMode(false);
            setEditId(null);
            fetchTimeSlots();
        } catch (error) {
            console.error('Error saving timeslot:', error);
            toast.error('Failed to save timeslot');
        }
    };

    const handleEdit = (timeslot) => {
        setFormData({ StartTime: timeslot.StartTime, EndTime: timeslot.EndTime });
        setEditMode(true);
        setEditId(timeslot.TimeSlotID);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this timeslot?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/timeslot/${id}`);
            toast.success('TimeSlot deleted successfully');
            fetchTimeSlots();
        } catch (error) {
            console.error('Error deleting timeslot:', error);
            toast.error('Failed to delete timeslot');
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer />
            <h2 className="mb-4 text-center">Manage TimeSlots</h2>

            <div className="card p-4 mb-5 shadow-sm">
                <h5>{editMode ? 'Edit TimeSlot' : 'Create New TimeSlot'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <input
                            type="time"
                            name="StartTime"
                            className="form-control"
                            value={formData.StartTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <input
                            type="time"
                            name="EndTime"
                            className="form-control"
                            value={formData.EndTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {editMode ? 'Update TimeSlot' : 'Create TimeSlot'}
                    </button>
                </form>
            </div>

            <div className="row">
                {timeslots.length > 0 ? (
                    timeslots.map((slot) => (
                        <div className="col-md-4 mb-4" key={slot.TimeSlotID}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{slot.StartTime} - {slot.EndTime}</h5>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEdit(slot)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(slot.TimeSlotID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-4">No timeslots found.</div>
                )}
            </div>
        </div>
    );
};

export default TimeSlots;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const TimeSlots = () => {
//     const [timeslots, setTimeSlots] = useState([]);
//     const [formData, setFormData] = useState({ StartTime: '', EndTime: '' });
//     const [editMode, setEditMode] = useState(false);
//     const [editId, setEditId] = useState(null);

//     const fetchTimeSlots = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/api/timeslot');
//             setTimeSlots(response.data);
//         } catch (error) {
//             console.error('Error fetching timeslots:', error);
//             toast.error('Failed to fetch timeslots');
//         }
//     };

//     useEffect(() => {
//         fetchTimeSlots();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const convertTo24HourMinutes = (timeStr) => {
//         const [time, modifier] = timeStr.trim().split(' ');
//         let [hours, minutes] = time.split(':').map(Number);

//         if (modifier.toUpperCase() === 'PM' && hours !== 12) {
//             hours += 12;
//         }
//         if (modifier.toUpperCase() === 'AM' && hours === 12) {
//             hours = 0;
//         }
//         return hours * 60 + minutes;
//     };

//     const isEndTimeAfterStartTime = (start, end) => {
//         return convertTo24HourMinutes(end) > convertTo24HourMinutes(start);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!isEndTimeAfterStartTime(formData.StartTime, formData.EndTime)) {
//             toast.error('End Time must be after Start Time!');
//             return;
//         }
//         try {
//             const formattedData = {
//                 StartTime: formData.StartTime.trim().toUpperCase(),
//                 EndTime: formData.EndTime.trim().toUpperCase()
//             };

//             if (editMode) {
//                 await axios.put(`http://localhost:3000/api/timeslot/${editId}`, formattedData);
//                 toast.success('TimeSlot updated successfully');
//             } else {
//                 await axios.post('http://localhost:3000/api/timeslot', formattedData);
//                 toast.success('TimeSlot created successfully');
//             }
//             setFormData({ StartTime: '', EndTime: '' });
//             setEditMode(false);
//             setEditId(null);
//             fetchTimeSlots();
//         } catch (error) {
//             console.error('Error saving timeslot:', error);
//             toast.error('Failed to save timeslot');
//         }
//     };

//     const handleEdit = (timeslot) => {
//         setFormData({ StartTime: timeslot.StartTime, EndTime: timeslot.EndTime });
//         setEditMode(true);
//         setEditId(timeslot.TimeSlotID);
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this timeslot?')) return;

//         try {
//             await axios.delete(`http://localhost:3000/api/timeslot/${id}`);
//             toast.success('TimeSlot deleted successfully');
//             fetchTimeSlots();
//         } catch (error) {
//             console.error('Error deleting timeslot:', error);
//             toast.error('Failed to delete timeslot');
//         }
//     };

//     return (
//         <div className="container py-5">
//             <ToastContainer />
//             <h2 className="mb-4 text-center">Manage TimeSlots</h2>

//             <div className="card p-4 mb-5 shadow-sm">
//                 <h5>{editMode ? 'Edit TimeSlot' : 'Create New TimeSlot'}</h5>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="form-label">Start Time</label>
//                         <input
//                             type="text"
//                             name="StartTime"
//                             className="form-control"
//                             value={formData.StartTime}
//                             onChange={handleChange}
//                             placeholder="hh:mm AM/PM"
//                             pattern="^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$"
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label className="form-label">End Time</label>
//                         <input
//                             type="text"
//                             name="EndTime"
//                             className="form-control"
//                             value={formData.EndTime}
//                             onChange={handleChange}
//                             placeholder="hh:mm AM/PM"
//                             pattern="^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$"
//                             required
//                         />
//                     </div>
//                     <button type="submit" className="btn btn-primary w-100">
//                         {editMode ? 'Update TimeSlot' : 'Create TimeSlot'}
//                     </button>
//                 </form>
//             </div>

//             <div className="row">
//                 {timeslots.length > 0 ? (
//                     timeslots.map((slot) => (
//                         <div className="col-md-4 mb-4" key={slot.TimeSlotID}>
//                             <div className="card h-100 shadow-sm">
//                                 <div className="card-body">
//                                     <h5 className="card-title">{slot.StartTime} - {slot.EndTime}</h5>
//                                     <div className="d-flex justify-content-between">
//                                         <button
//                                             className="btn btn-warning btn-sm"
//                                             onClick={() => handleEdit(slot)}
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             className="btn btn-danger btn-sm"
//                                             onClick={() => handleDelete(slot.TimeSlotID)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="text-center mt-4">No timeslots found.</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TimeSlots;
