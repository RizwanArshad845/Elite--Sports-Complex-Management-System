const { sql, poolPromise } = require("../db");

// Create Feedback
const createFeedback = async (req, res) => {
    const { UserID, Content, Rating, FeedbackDate } = req.body;

    if (!UserID || !Content || !Rating || !FeedbackDate) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('Content', sql.VarChar(sql.MAX), Content)
            .input('Rating', sql.Int, Rating)
            .input('FeedbackDate', sql.Date, FeedbackDate)
            .query(`
                INSERT INTO Feedback (UserID, Content, Rating, FeedbackDate)
                VALUES (@UserID, @Content, @Rating, @FeedbackDate);
                SELECT * FROM Feedback WHERE FeedbackID = SCOPE_IDENTITY();
            `);

        res.status(201).json({ message: "Feedback created successfully", feedback: result.recordset[0] });
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ message: "Error creating feedback", error });
    }
};

// Get all Feedbacks
const getAllFeedbacks = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT F.FeedbackID, F.Content, F.Rating, F.FeedbackDate, F.UserID, U.Username
                FROM Feedback F
                INNER JOIN Users U ON F.UserID = U.UserID
                ORDER BY F.FeedbackDate DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Error fetching feedbacks", error });
    }
};

// Update Feedback
const updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { Content, Rating } = req.body;

    if (!Content || !Rating) {
        return res.status(400).json({ message: "Content and Rating are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('Content', sql.VarChar(sql.MAX), Content)
            .input('Rating', sql.Int, Rating)
            .query(`
                UPDATE Feedback
                SET Content = @Content, Rating = @Rating
                WHERE FeedbackID = @id;
                SELECT * FROM Feedback WHERE FeedbackID = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback updated successfully", feedback: result.recordset[0] });
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: "Error updating feedback", error });
    }
};

// Delete Feedback
const deleteFeedback = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Feedback OUTPUT DELETED.* WHERE FeedbackID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully", deletedFeedback: result.recordset[0] });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Error deleting feedback", error });
    }
};

// Get Feedbacks by User ID
const getFeedbacksByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query("SELECT * FROM Feedback WHERE UserID = @userId");

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching feedbacks by user:", error);
        res.status(500).json({ message: "Error fetching feedbacks", error });
    }
};

module.exports = {
    createFeedback,
    getAllFeedbacks,
    updateFeedback,
    deleteFeedback,
    getFeedbacksByUserId
};
