const { sql, poolPromise } = require("../db");

// Create a Trainer
const createTrainer = async (req, res) => {
    const { Name, Specialization } = req.body;

    if (!Name || !Specialization) {
        return res.status(400).json({
            success: false,
            message: "Both fields (Name and Specialization) are required."
        });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Name', sql.VarChar(100), Name)
            .input('Specialization', sql.VarChar(100), Specialization)
            .query(`
                INSERT INTO Trainers (Name, Specialization) 
                VALUES (@Name, @Specialization);
                SELECT * FROM Trainers WHERE TrainerID = SCOPE_IDENTITY();
            `);

        res.status(201).json({
            message: "Trainer created successfully",
            trainer: result.recordset[0]
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating trainer", error });
    }
};

// Get Trainer by ID
const getTrainerById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Trainers WHERE TrainerID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching trainer", error });
    }
};

// Get Trainer by Name
const getTrainerByName = async (req, res) => {
    const { name } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .query("SELECT * FROM Trainers WHERE Name = @name");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching trainer", error });
    }
};

// Update Trainer
const updateTrainer = async (req, res) => {
    const { id } = req.params;
    const { Name, Specialization } = req.body;

    if (!Name || !Specialization) {
        return res.status(400).json({ message: "Both fields (Name and Specialization) are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('Name', sql.VarChar(100), Name)
            .input('Specialization', sql.VarChar(100), Specialization)
            .query(`
                UPDATE Trainers 
                SET Name = @Name, Specialization = @Specialization
                WHERE TrainerID = @id;
                SELECT * FROM Trainers WHERE TrainerID = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.status(200).json({ message: "Trainer updated", trainer: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error updating trainer", error });
    }
};

// Delete Trainer
const deleteTrainer = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM Trainers 
                OUTPUT DELETED.* 
                WHERE TrainerID = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.status(200).json({
            message: "Trainer deleted",
            trainer: result.recordset[0]
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting trainer", error });
    }
};

const getAllTrainers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Trainers");
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ message: "Error fetching trainers", error: error.message });
    }
};

module.exports = {
    createTrainer,
    getTrainerById,
    getTrainerByName,
    updateTrainer,
    deleteTrainer,
    getAllTrainers
};
