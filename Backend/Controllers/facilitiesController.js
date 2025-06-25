const sql = require("mssql");
const { poolPromise } = require("../db");

// Create Facility
const createFacility = async (req, res) => {
    const { FacilityName, FacilityType } = req.body;
    if (!FacilityName || !FacilityType) {
        return res.status(400).json({ message: "FacilityName and FacilityType are required." });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("FacilityName", sql.VarChar(100), FacilityName)
            .input("FacilityType", sql.VarChar(50), FacilityType)
            .query(`
                INSERT INTO Facilities (FacilityName, FacilityType)
                OUTPUT INSERTED.*
                VALUES (@FacilityName, @FacilityType)
            `);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error creating facility", error: err.message });
    }
};

// Get Facility by ID
const getFacilityById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("FacilityID", sql.Int, req.params.id)
            .query("SELECT * FROM Facilities WHERE FacilityID = @FacilityID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Facility not found" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching facility", error: err.message });
    }
};

// Get Facility by Name
const getFacilityByName = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("FacilityName", sql.VarChar(100), req.params.name)
            .query("SELECT * FROM Facilities WHERE FacilityName = @FacilityName");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Facility not found" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching facility", error: err.message });
    }
};

// Get Facilities by Type
const getFacilityByType = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("FacilityType", sql.VarChar(50), req.params.type)
            .query("SELECT * FROM Facilities WHERE FacilityType = @FacilityType");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error fetching facilities", error: err.message });
    }
};

// Update Facility
const updateFacility = async (req, res) => {
    const { FacilityName, FacilityType } = req.body;
    if (!FacilityName || !FacilityType) {
        return res.status(400).json({ message: "FacilityName and FacilityType are required." });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("FacilityID", sql.Int, req.params.id)
            .input("FacilityName", sql.VarChar(100), FacilityName)
            .input("FacilityType", sql.VarChar(50), FacilityType)
            .query(`
                UPDATE Facilities
                SET FacilityName = @FacilityName,
                    FacilityType = @FacilityType
                OUTPUT INSERTED.*
                WHERE FacilityID = @FacilityID
            `);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Facility not found" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error updating facility", error: err.message });
    }
};

// Delete Facility
const deleteFacility = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("FacilityID", sql.Int, req.params.id)
            .query("DELETE FROM Facilities OUTPUT DELETED.* WHERE FacilityID = @FacilityID");
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Facility not found" });
        }
        res.json({ message: "Facility deleted successfully", facility: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ message: "Error deleting facility", error: err.message });
    }
};

const getAllFacilities = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Facilities");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error fetching facilities", error: err.message });
    }
};

module.exports = {
    createFacility,
    getFacilityById,
    getFacilityByName,
    getFacilityByType,
    updateFacility,
    deleteFacility,
    getAllFacilities
};
