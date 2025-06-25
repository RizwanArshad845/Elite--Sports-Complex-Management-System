import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [formData, setFormData] = useState({ FacilityName: '', FacilityType: '' });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchFacilities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/facilities');
            setFacilities(response.data);
        } catch (error) {
            console.error('Error fetching facilities:', error);
            toast.error('Failed to fetch facilities');
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:3000/api/facilities/${editId}`, formData);
                toast.success('Facility updated successfully');
            } else {
                await axios.post('http://localhost:3000/api/facilities', formData);
                toast.success('Facility created successfully');
            }
            setFormData({ FacilityName: '', FacilityType: '' });
            setEditMode(false);
            setEditId(null);
            fetchFacilities();
        } catch (error) {
            console.error('Error saving facility:', error);
            toast.error('Failed to save facility');
        }
    };

    const handleEdit = (facility) => {
        setFormData({ FacilityName: facility.FacilityName, FacilityType: facility.FacilityType });
        setEditMode(true);
        setEditId(facility.FacilityID);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this facility?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/facilities/${id}`);
            toast.success('Facility deleted successfully');
            fetchFacilities();
        } catch (error) {
            console.error('Error deleting facility:', error);
            toast.error('Failed to delete facility');
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer />
            <h2 className="mb-4 text-center">Manage Facilities</h2>

            <div className="card p-4 mb-5 shadow-sm">
                <h5>{editMode ? 'Edit Facility' : 'Register New Facility'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Facility Name</label>
                        <input
                            type="text"
                            name="FacilityName"
                            className="form-control"
                            value={formData.FacilityName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Facility Type</label>
                        <input
                            type="text"
                            name="FacilityType"
                            className="form-control"
                            value={formData.FacilityType}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {editMode ? 'Update Facility' : 'Create Facility'}
                    </button>
                </form>
            </div>

            <div className="row">
                {facilities.length > 0 ? (
                    facilities.map((facility) => (
                        <div className="col-md-4 mb-4" key={facility.FacilityID}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{facility.FacilityName}</h5>
                                    <p className="card-text"><strong>Type:</strong> {facility.FacilityType}</p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEdit(facility)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(facility.FacilityID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-4">No facilities found.</div>
                )}
            </div>
        </div>
    );
};

export default Facilities;
