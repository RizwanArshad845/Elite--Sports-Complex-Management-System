// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const UserTrainers = () => {
//     const { id } = useParams();
//     const [trainers, setTrainers] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         axios.get(`http://localhost:3000/api/users/${id}/trainers`)
//             .then(res => setTrainers(res.data.trainers))
//             .catch(err => {
//                 console.error(err);
//                 toast.error("Failed to load assigned trainers.");
//             });
//     }, [id]);

//     const handleCancel = async (trainerID) => {
//         try {
//             await axios.put(`http://localhost:3000/api/trainerbookings/cancel/${trainerID}`);
//             toast.success("Trainer booking cancelled!");
//             setTrainers(prev =>
//                 prev.map(t =>
//                     t.TrainerID === trainerID
//                         ? { ...t, BookingStatus: "Cancelled" }
//                         : t
//                 )
//             );
//         } catch (err) {
//             console.error("Cancellation error:", err);
//             toast.error("Failed to cancel trainer booking.");
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <ToastContainer />
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2 className="fw-bold text-primary">Your Booked Trainers</h2>
//                 <button
//                     className="btn btn-outline-primary"
//                     onClick={() => navigate(`/user/book-trainer/${id}`)}
//                 >
//                     + Book New Trainer
//                 </button>
//             </div>

//             {trainers.length > 0 ? (
//                 <div className="row">
//                     {trainers.map(t => (
//                         <div key={t.TrainerID} className="col-md-4">
//                             <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
//                                 <div className="card-body">
//                                     <h5 className="card-title text-dark fw-semibold">{t.Name}</h5>
//                                     <p className="mb-1"><strong>Specialization:</strong> {t.Specialization}</p>
//                                     <p className="mb-2">
//                                         <strong>Status:</strong>{' '}
//                                         <span className={
//                                             t.BookingStatus === 'Pending' ? 'text-warning' :
//                                             t.BookingStatus === 'Availed' ? 'text-success' :
//                                             'text-danger'
//                                         }>
//                                             {t.BookingStatus}
//                                         </span>
//                                     </p>
//                                     <button
//                                         className="btn btn-sm btn-outline-danger"
//                                         onClick={() => handleCancel(t.TrainerID)}
//                                         disabled={t.BookingStatus !== 'Pending'}
//                                     >
//                                         Cancel Booking
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="alert alert-info">No trainers booked.</div>
//             )}
//         </div>
//     );
// };

// export default UserTrainers;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserTrainers = () => {
    const { id } = useParams();
    const [trainers, setTrainers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/api/users/${id}/trainers`)
            .then(res => setTrainers(res.data.trainers))
            .catch(err => {
                console.error(err);
                toast.error("Failed to load assigned trainers.");
            });
    }, [id]);

    const handleCancel = async (trainerID) => {
        try {
            await axios.put(`http://localhost:3000/api/trainerbookings/cancel/${trainerID}`);
            toast.success("Trainer booking cancelled!");
            setTrainers(prev =>
                prev.map(t =>
                    t.TrainerID === trainerID
                        ? { ...t, BookingStatus: "Cancelled" }
                        : t
                )
            );
        } catch (err) {
            console.error("Cancellation error:", err);
            toast.error("Failed to cancel trainer booking.");
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">Your Booked Trainers</h2>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/user/book-trainer/${id}`)}
                >
                    + Book New Trainer
                </button>
            </div>

            {trainers.length > 0 ? (
                <div className="row">
                    {trainers.map(t => (
                        <div key={t.TrainerID} className="col-md-4">
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                                <div className="card-body">
                                    <h5 className="card-title text-dark fw-semibold">{t.Name}</h5>
                                    <p className="mb-1"><strong>Specialization:</strong> {t.Specialization}</p>
                                    <p className="mb-1"><strong>Time:</strong> {t.StartTime} - {t.EndTime}</p>
                                    <p className="mb-2">
                                        <strong>Status:</strong>{' '}
                                        <span className={
                                            t.BookingStatus === 'Pending' ? 'text-warning' :
                                            t.BookingStatus === 'Availed' ? 'text-success' :
                                            'text-danger'
                                        }>
                                            {t.BookingStatus}
                                        </span>
                                    </p>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleCancel(t.TrainerID)}
                                        disabled={t.BookingStatus !== 'Pending'}
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">No trainers booked.</div>
            )}
        </div>
    );
};

export default UserTrainers;
