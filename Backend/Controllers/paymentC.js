const { sql, poolPromise } = require("../db");

// Create Payment
const createPayment = async (req, res) => {
    const { MembershipID, UserID, Amount, PaymentDate, PaymentType, PaymentStatusID } = req.body;

    if (!Amount || !PaymentDate || !PaymentType) {
        return res.status(400).json({ success: false, message: "Amount, PaymentDate, and PaymentType are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MembershipID', sql.Int, MembershipID)
            .input('UserID', sql.Int, UserID)
            .input('Amount', sql.Int, Amount)
            .input('PaymentDate', sql.Date, PaymentDate)
            .input('PaymentType', sql.VarChar(50), PaymentType)
            .input('PaymentStatusID', sql.Int, PaymentStatusID)
            .query(`
                INSERT INTO Payments (MembershipID, UserID, Amount, PaymentDate, PaymentType, PaymentStatusID)
                VALUES (@MembershipID, @UserID, @Amount, @PaymentDate, @PaymentType, @PaymentStatusID);
                SELECT * FROM Payments WHERE PaymentID = SCOPE_IDENTITY();
            `);

        res.status(201).json({ message: "Payment created successfully", payment: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating payment", error });
    }
};

// Get Payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Payments WHERE PaymentID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching payment", error });
    }
};

// Get Payments by User ID
const getPaymentsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query("SELECT * FROM Payments WHERE UserID = @userId");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching payments", error });
    }
};

// Get Payments by Payment Method
const getPaymentsByMethod = async (req, res) => {
    const { method } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('method', sql.VarChar(50), method)
            .query("SELECT * FROM Payments WHERE PaymentType = @method");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching payments", error });
    }
};

// Update Payment
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { Amount, PaymentType, PaymentStatusID } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('Amount', sql.Int, Amount)
            .input('PaymentType', sql.VarChar(50), PaymentType)
            .input('PaymentStatusID', sql.Int, PaymentStatusID)
            .query(`
                UPDATE Payments 
                SET Amount = @Amount, PaymentType = @PaymentType, PaymentStatusID = @PaymentStatusID
                WHERE PaymentID = @id;
                SELECT * FROM Payments WHERE PaymentID = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ message: "Payment updated", payment: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error updating payment", error });
    }
};

// Hard Delete Payment
const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Payments OUTPUT DELETED.* WHERE PaymentID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ message: "Payment deleted", payment: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting payment", error });
    }
};

module.exports = {
    createPayment,
    getPaymentById,
    getPaymentsByUserId,
    getPaymentsByMethod,
    updatePayment,
    deletePayment
};