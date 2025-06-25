const { sql, poolPromise } = require("../db");

// Create Payment Status
const createPaymentStatus = async (req, res) => {
    const { StatusName } = req.body;

    if (!StatusName) {
        return res.status(400).json({ message: "StatusName is required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('StatusName', sql.VarChar(50), StatusName)
            .query(`
                INSERT INTO PaymentStatuses (StatusName)
                VALUES (@StatusName);
                SELECT * FROM PaymentStatuses WHERE PaymentStatusID = SCOPE_IDENTITY();
            `);

        res.status(201).json({
            message: "Payment status created successfully",
            paymentStatus: result.recordset[0]
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating payment status", error });
    }
};

// Get Payment Status by ID
const getPaymentStatusById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM PaymentStatuses WHERE PaymentStatusID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Payment status not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching payment status", error });
    }
};

// Get Payment Status by Name
const getPaymentStatusByName = async (req, res) => {
    const { name } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.VarChar(50), name)
            .query("SELECT * FROM PaymentStatuses WHERE StatusName = @name");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Payment status not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching payment status", error });
    }
};

module.exports = {
    createPaymentStatus,
    getPaymentStatusById,
    getPaymentStatusByName,
};
