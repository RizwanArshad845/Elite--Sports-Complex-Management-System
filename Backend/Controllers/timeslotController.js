const sql = require("mssql");
const { poolPromise } = require("../db");

// Create a new TimeSlot
const createTimeSlot = async (req, res) => {
    const { StartTime, EndTime } = req.body;
    if (!StartTime || !EndTime) {
        return res.status(400).json({ message: "StartTime and EndTime are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("StartTime", sql.VarChar(20), StartTime)
            .input("EndTime", sql.VarChar(20), EndTime)
            .query(`
                INSERT INTO TimeSlots (StartTime, EndTime)
                OUTPUT INSERTED.*
                VALUES (@StartTime, @EndTime)
            `);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        if (err.message.includes('UQ_TimeSlot')) {
            return res.status(400).json({ message: "Duplicate timeslot not allowed." });
        }
        res.status(500).json({ message: "Error creating time slot", error: err.message });
    }
};

// Get all TimeSlots
const getAllTimeSlots = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM TimeSlots ORDER BY StartTime");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error fetching time slots", error: err.message });
    }
};

// Get TimeSlot by ID
const getTimeSlotById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("TimeSlotID", sql.Int, req.params.id)
            .query("SELECT * FROM TimeSlots WHERE TimeSlotID = @TimeSlotID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Time slot not found" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching time slot", error: err.message });
    }
};

// Update a TimeSlot
const updateTimeSlot = async (req, res) => {
    const { StartTime, EndTime } = req.body;

    if (!StartTime || !EndTime) {
        return res.status(400).json({ message: "StartTime and EndTime are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("TimeSlotID", sql.Int, req.params.id)
            .input("StartTime", sql.VarChar(20), StartTime)
            .input("EndTime", sql.VarChar(20), EndTime)
            .query(`
                UPDATE TimeSlots
                SET StartTime = @StartTime,
                    EndTime = @EndTime
                OUTPUT INSERTED.*
                WHERE TimeSlotID = @TimeSlotID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Time slot not found" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        if (err.message.includes('UQ_TimeSlot')) {
            return res.status(400).json({ message: "Duplicate timeslot not allowed." });
        }
        res.status(500).json({ message: "Error updating time slot", error: err.message });
    }
};

// Delete a TimeSlot
const deleteTimeSlot = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("TimeSlotID", sql.Int, req.params.id)
            .query("DELETE FROM TimeSlots OUTPUT DELETED.* WHERE TimeSlotID = @TimeSlotID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Time slot not found" });
        }

        res.json({ message: "Time slot deleted successfully", timeslot: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ message: "Error deleting time slot", error: err.message });
    }
};

module.exports = {
    createTimeSlot,
    getAllTimeSlots,
    getTimeSlotById,
    updateTimeSlot,
    deleteTimeSlot
};
