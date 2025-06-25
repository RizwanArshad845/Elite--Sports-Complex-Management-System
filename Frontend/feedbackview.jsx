import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedbackView = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/feedback');
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            toast.error('Failed to fetch feedbacks');
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div className="container py-5">
            <ToastContainer />
            <h2 className="mb-4 text-center">User Feedbacks</h2>

            <div className="row">
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <div className="col-md-4 mb-4" key={feedback.FeedbackID}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Rating: {feedback.Rating}/5</h5>
                                    <p className="card-text">"{feedback.Content}"</p>
                                    <small className="text-muted">
                                        Given by: {feedback.Username}<br />
                                        Date: {new Date(feedback.FeedbackDate).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-4">No feedbacks found.</div>
                )}
            </div>
        </div>
    );
};

export default FeedbackView;
