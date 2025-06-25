const { sql, poolPromise } = require("../db");

// Create Membership
const createMembership = async (req, res) => {
    const { UserID, MembershipTypeID, StartDate, EndDate, PaymentStatusID } = req.body;

    if (!UserID || !MembershipTypeID || !StartDate || !EndDate || !PaymentStatusID) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('MembershipTypeID', sql.Int, MembershipTypeID)
            .input('StartDate', sql.Date, StartDate)
            .input('EndDate', sql.Date, EndDate)
            .input('PaymentStatusID', sql.Int, PaymentStatusID)
            .query(`
                INSERT INTO Memberships (UserID, MembershipTypeID, StartDate, EndDate, PaymentStatusID) 
                VALUES (@UserID, @MembershipTypeID, @StartDate, @EndDate, @PaymentStatusID);
                SELECT * FROM Memberships WHERE MembershipID = SCOPE_IDENTITY();
            `);

        res.status(201).json({ message: "Membership created successfully", membership: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating membership", error });
    }
};

// Get Membership by ID
const getMembershipById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Memberships WHERE MembershipID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Membership not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching membership", error });
    }
};

// Get Membership by User ID
const getMembershipByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query("SELECT * FROM Memberships WHERE UserID = @userId");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching memberships", error });
    }
};

// Get Memberships by Membership Type ID
const getMembershipByTypeId = async (req, res) => {
    const { typeId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('typeId', sql.Int, typeId)
            .query("SELECT * FROM Memberships WHERE MembershipTypeID = @typeId");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching memberships", error });
    }
};

// Get Memberships by Payment Status ID
const getMembershipByPaymentStatus = async (req, res) => {
    const { statusId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('statusId', sql.Int, statusId)
            .query("SELECT * FROM Memberships WHERE PaymentStatusID = @statusId");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching memberships", error });
    }
};

// Update Membership by ID
const updateMembership = async (req, res) => {
    const { id } = req.params;
    const { UserID, MembershipTypeID, StartDate, EndDate, PaymentStatusID } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('UserID', sql.Int, UserID)
            .input('MembershipTypeID', sql.Int, MembershipTypeID)
            .input('StartDate', sql.Date, StartDate)
            .input('EndDate', sql.Date, EndDate)
            .input('PaymentStatusID', sql.Int, PaymentStatusID)
            .query(`
                UPDATE Memberships 
                SET UserID = @UserID, MembershipTypeID = @MembershipTypeID, StartDate = @StartDate, EndDate = @EndDate, PaymentStatusID = @PaymentStatusID
                WHERE MembershipID = @id;
                SELECT * FROM Memberships WHERE MembershipID = @id;
            `);

        res.status(200).json({ message: "Membership updated", membership: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error updating membership", error });
    }
};

// Delete Membership by ID
const deleteMembership = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Memberships OUTPUT DELETED.* WHERE MembershipID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Membership not found" });
        }

        res.status(200).json({ message: "Membership deleted", membership: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting membership", error });
    }
};

module.exports = {
    createMembership,
    getMembershipById,
    getMembershipByUserId,
    getMembershipByTypeId,
    getMembershipByPaymentStatus,
    updateMembership,
    deleteMembership
};

