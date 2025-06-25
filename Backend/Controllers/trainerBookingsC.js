const { sql, poolPromise } = require("../db");

// Create Trainer Booking
const createTrainerBooking = async (req, res) => {
    const { TrainerID, UserID, TimeSlotID, BookingStatus } = req.body;

    if (!TrainerID || !UserID || !TimeSlotID || !BookingStatus) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("TrainerID", sql.Int, TrainerID)
            .input("UserID", sql.Int, UserID)
            .input("TimeSlotID", sql.Int, TimeSlotID)
            .input("BookingStatus", sql.VarChar(50), BookingStatus)
            .query(`
                INSERT INTO TrainerBookings (TrainerID, UserID, TimeSlotID, BookingStatus)
                VALUES (@TrainerID, @UserID, @TimeSlotID, @BookingStatus);
                SELECT * FROM TrainerBookings WHERE BookingID = SCOPE_IDENTITY();
            `);

        res.status(201).json({ message: "Booking created", booking: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error });
    }
};

// Get Booking by ID
const getTrainerBookingById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("id", sql.Int, id)
            .query("SELECT * FROM TrainerBookings WHERE BookingID = @id");

        if (result.recordset.length === 0)
            return res.status(404).json({ message: "Booking not found" });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
};

// Get Bookings by UserID
const getBookingsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("userId", sql.Int, userId)
            .query("SELECT * FROM TrainerBookings WHERE UserID = @userId");

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Get Bookings by TrainerID
const getBookingsByTrainerId = async (req, res) => {
    const { trainerId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("trainerId", sql.Int, trainerId)
            .query("SELECT * FROM TrainerBookings WHERE TrainerID = @trainerId");

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Get Bookings by TimeSlotID
const getBookingsByTimeSlotId = async (req, res) => {
    const { timeSlotId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("timeSlotId", sql.Int, timeSlotId)
            .query("SELECT * FROM TrainerBookings WHERE TimeSlotID = @timeSlotId");

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Update Booking by BookingID
const updateTrainerBooking = async (req, res) => {
    const { id } = req.params;
    const { TrainerID, UserID, TimeSlotID, BookingStatus } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("TrainerID", sql.Int, TrainerID)
            .input("UserID", sql.Int, UserID)
            .input("TimeSlotID", sql.Int, TimeSlotID)
            .input("BookingStatus", sql.VarChar(50), BookingStatus)
            .query(`
                UPDATE TrainerBookings
                SET TrainerID = @TrainerID, UserID = @UserID,
                    TimeSlotID = @TimeSlotID, BookingStatus = @BookingStatus
                WHERE BookingID = @id;
                SELECT * FROM TrainerBookings WHERE BookingID = @id;
            `);

        if (result.recordset.length === 0)
            return res.status(404).json({ message: "Booking not found" });

        res.status(200).json({ message: "Booking updated", booking: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking", error });
    }
};

// Delete Booking by ID
const deleteTrainerBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("id", sql.Int, id)
            .query("DELETE FROM TrainerBookings OUTPUT DELETED.* WHERE BookingID = @id");

        if (result.recordset.length === 0)
            return res.status(404).json({ message: "Booking not found" });

        res.status(200).json({ message: "Booking deleted", deletedBooking: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error });
    }
};

module.exports = {
    createTrainerBooking,
    getTrainerBookingById,
    getBookingsByUserId,
    getBookingsByTrainerId,
    getBookingsByTimeSlotId,
    updateTrainerBooking,
    deleteTrainerBooking
}