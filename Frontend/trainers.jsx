import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Trainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [formData, setFormData] = useState({ Name: '', Specialization: '' });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchTrainers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/trainers');
            setTrainers(response.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
            toast.error('Failed to fetch trainers');
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:3000/api/trainers/${editId}`, formData);
                toast.success('Trainer updated successfully');
            } else {
                await axios.post('http://localhost:3000/api/trainers', formData);
                toast.success('Trainer created successfully');
            }
            setFormData({ Name: '', Specialization: '' });
            setEditMode(false);
            setEditId(null);
            fetchTrainers();
        } catch (error) {
            console.error('Error saving trainer:', error);
            toast.error('Failed to save trainer');
        }
    };

    const handleEdit = (trainer) => {
        setFormData({ Name: trainer.Name, Specialization: trainer.Specialization });
        setEditMode(true);
        setEditId(trainer.TrainerID);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trainer?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/trainers`);
            toast.success('Trainer deleted successfully');
            fetchTrainers();
        } catch (error) {
            console.error('Error deleting trainer:', error);
            toast.error('Failed to delete trainer');
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer />
            <h2 className="mb-4 text-center">Manage Trainers</h2>

            <div className="card p-4 mb-5 shadow-sm">
                <h5>{editMode ? 'Edit Trainer' : 'Register New Trainer'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Trainer Name</label>
                        <input
                            type="text"
                            name="Name"
                            className="form-control"
                            value={formData.Name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Specialization</label>
                        <input
                            type="text"
                            name="Specialization"
                            className="form-control"
                            value={formData.Specialization}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {editMode ? 'Update Trainer' : 'Create Trainer'}
                    </button>
                </form>
            </div>

            <div className="row">
                {trainers.length > 0 ? (
                    trainers.map((trainer) => (
                        <div className="col-md-4 mb-4" key={trainer.TrainerID}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{trainer.Name}</h5>
                                    <p className="card-text"><strong>Specialization:</strong> {trainer.Specialization}</p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEdit(trainer)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(trainer.TrainerID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-4">No trainers found.</div>
                )}
            </div>
        </div>
    );
};

export default Trainers;