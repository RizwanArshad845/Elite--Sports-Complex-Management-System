const sql = require('mssql');
const { poolPromise } = require('../db');

// Create a new booking
const createBooking = async (req, res) => {
    const { FacilityID, UserID, TimeSlotID, BookingStatus, BookingDate } = req.body;
    
    if (!FacilityID || !UserID || !TimeSlotID || !BookingStatus) {
        return res.status(400).json({ message: "FacilityID, UserID, TimeSlotID, and BookingStatus are required." });
    }
    
    try {
        const pool = await poolPromise;
        
        // Set today's date if BookingDate is not provided
        const bookingDateToUse = BookingDate ? new Date(BookingDate) : new Date();

        const result = await pool.request()
            .input("FacilityID", sql.Int, FacilityID)
            .input("UserID", sql.Int, UserID)
            .input("TimeSlotID", sql.Int, TimeSlotID)
            .input("BookingStatus", sql.VarChar(50), BookingStatus)
            .input("BookingDate", sql.Date, bookingDateToUse)
            .query(`
                INSERT INTO Bookings (FacilityID, UserID, TimeSlotID, BookingStatus, BookingDate) 
                OUTPUT INSERTED.* 
                VALUES (@FacilityID, @UserID, @TimeSlotID, @BookingStatus, @BookingDate)
            `);
            
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error creating booking", error: err.message });
    }
};
const cancelBooking = async (req, res) => {
    const bookingID = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("BookingStatus", sql.VarChar(50), "Cancelled")
            .input("BookingID", sql.Int, bookingID)
            .query(`
                UPDATE Bookings
                SET BookingStatus = @BookingStatus
                OUTPUT INSERTED.*
                WHERE BookingID = @BookingID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.status(200).json({ message: "Booking cancelled successfully", booking: result.recordset[0] });
    } catch (err) {
        console.error("Cancel booking error:", err);
        res.status(500).json({ message: "Error cancelling booking", error: err.message });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT * FROM Bookings WHERE BookingID = @id");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching booking", error: err.message });
    }
};

// Get bookings by facility ID
const getBookingsByFacilityId = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("facilityID", sql.Int, req.params.facilityID)
            .query("SELECT * FROM Bookings WHERE FacilityID = @facilityID");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No bookings found for this facility" });
        }
        
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

// Get bookings by user ID
const getBookingsByUserId = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userID", sql.Int, req.params.userID)
            .query("SELECT * FROM Bookings WHERE UserID = @userID");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }
        
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

// Get bookings by timeslot ID
const getBookingsByTimeSlotId = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("timeSlotID", sql.Int, req.params.timeSlotID)
            .query("SELECT * FROM Bookings WHERE TimeSlotID = @timeSlotID");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No bookings found for this timeslot" });
        }
        
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

// Update booking status by ID
const updateBooking = async (req, res) => {
    const { BookingStatus } = req.body;
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .input("BookingStatus", sql.VarChar(50), BookingStatus)
            .query(`
                UPDATE Bookings 
                SET BookingStatus = @BookingStatus 
                OUTPUT INSERTED.* 
                WHERE BookingID = @id
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error updating booking", error: err.message });
    }
};

// Delete booking by ID
const deleteBooking = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM Bookings OUTPUT DELETED.* WHERE BookingID = @id");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json({ 
            message: "Booking deleted successfully", 
            booking: result.recordset[0] 
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting booking", error: err.message });
    }
};

module.exports = {
    createBooking,
    cancelBooking,
    getBookingById,
    getBookingsByFacilityId,
    getBookingsByUserId,
    getBookingsByTimeSlotId,
    updateBooking,
    deleteBooking
};
