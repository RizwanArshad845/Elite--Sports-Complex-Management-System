const { sql, poolPromise } = require("../db.js");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

// Create User
const createUser = async (req, res) => {
    const { Username, UserPassword, Email, PhoneNumber, DOB, RegistrationDate } = req.body;

    if (!Username || !UserPassword || !Email || !PhoneNumber || !DOB || !RegistrationDate) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("Username", sql.VarChar(50), Username)
            .input("UserPassword", sql.VarChar(255), UserPassword)
            .input("Email", sql.VarChar(100), Email)
            .input("PhoneNumber", sql.VarChar(15), PhoneNumber)
            .input("DOB", sql.Date, DOB)
            .input("RegistrationDate", sql.Date, RegistrationDate)
            .query(`
                INSERT INTO Users (Username, UserPassword, Email, PhoneNumber, DOB, RegistrationDate) 
                VALUES (@Username, @UserPassword, @Email, @PhoneNumber, @DOB, @RegistrationDate)
                SELECT * FROM Users WHERE UserID = SCOPE_IDENTITY()
            `);

        res.status(201).json({ message: "User created successfully", user: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

const registerUserWithMembership = async (req, res) => {
    const { Username, UserPassword, Email, PhoneNumber, DOB, RegistrationDate, MembershipTypeName } = req.body;

    if (!Username || !UserPassword || !Email || !PhoneNumber || !DOB || !RegistrationDate || !MembershipTypeName) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;

        // 1. Insert user
        const userResult = await pool.request()
            .input("Username", sql.VarChar(50), Username)
            .input("UserPassword", sql.VarChar(255), UserPassword)
            .input("Email", sql.VarChar(100), Email)
            .input("PhoneNumber", sql.VarChar(15), PhoneNumber)
            .input("DOB", sql.Date, DOB)
            .input("RegistrationDate", sql.Date, RegistrationDate)
            .query(`
                INSERT INTO Users (Username, UserPassword, Email, PhoneNumber, DOB, RegistrationDate)
                OUTPUT INSERTED.*
                VALUES (@Username, @UserPassword, @Email, @PhoneNumber, @DOB, @RegistrationDate)
            `);

        const newUser = userResult.recordset[0];
        const userID = newUser.UserID;

        //Get MembershipTypeID and Price
        const membershipTypeResult = await pool.request()
            .input("TypeName", sql.VarChar(50), MembershipTypeName)
            .query(`SELECT MembershipTypeID, Price FROM MembershipTypes WHERE TypeName = @TypeName`);

        if (membershipTypeResult.recordset.length === 0) {
            return res.status(400).json({ message: "Invalid membership type selected" });
        }

        const { MembershipTypeID, Price } = membershipTypeResult.recordset[0];

        // 3. Insert Membership (Assume start today, 1 month validity)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const membershipResult = await pool.request()
            .input("UserID", sql.Int, userID)
            .input("MembershipTypeID", sql.Int, MembershipTypeID)
            .input("StartDate", sql.Date, startDate)
            .input("EndDate", sql.Date, endDate)
            .input("PaymentStatusID", sql.Int, 2) // 2 = Pending (assumed)
            .query(`
                INSERT INTO Memberships (UserID, MembershipTypeID, StartDate, EndDate, PaymentStatusID)
                OUTPUT INSERTED.MembershipID
                VALUES (@UserID, @MembershipTypeID, @StartDate, @EndDate, @PaymentStatusID)
            `);

        const membershipID = membershipResult.recordset[0].MembershipID;

        // 4. Insert Payment with status PENDING
        await pool.request()
            .input("MembershipID", sql.Int, membershipID)
            .input("UserID", sql.Int, userID)
            .input("Amount", sql.Int, Price)
            .input("PaymentDate", sql.Date, new Date())
            .input("PaymentType", sql.VarChar(50), "Card") // or "Cash"
            .input("PaymentStatusID", sql.Int, 2) // 2 = Pending
            .query(`
                INSERT INTO Payments (MembershipID, UserID, Amount, PaymentDate, PaymentType, PaymentStatusID)
                VALUES (@MembershipID, @UserID, @Amount, @PaymentDate, @PaymentType, @PaymentStatusID)
            `);

        res.status(201).json({ message: "User registered with membership and payment", user: newUser });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};


// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Users");
        res.status(200).json({ success: true, users: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("id", sql.Int, id).query("SELECT * FROM Users WHERE UserID = @id");

        if (result.recordset.length === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Get User by Username
const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request().input("username", sql.VarChar, username).query("SELECT * FROM Users WHERE Username = @username");

        if (result.recordset.length === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Update User
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { Username, UserPassword, Email, PhoneNumber, DOB, RegistrationDate } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("Username", sql.VarChar(50), Username)
            .input("UserPassword", sql.VarChar(255), UserPassword)
            .input("Email", sql.VarChar(100), Email)
            .input("PhoneNumber", sql.VarChar(15), PhoneNumber)
            .input("DOB", sql.Date, DOB)
            .input("RegistrationDate", sql.Date, RegistrationDate)
            .query(`
                UPDATE Users 
                SET Username = @Username, UserPassword = @UserPassword, Email = @Email, 
                    PhoneNumber = @PhoneNumber, DOB = @DOB, RegistrationDate = @RegistrationDate
                WHERE UserID = @id
                SELECT * FROM Users WHERE UserID = @id
            `);

        if (result.recordset.length === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User updated", user: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                DELETE FROM Users 
                OUTPUT DELETED.* 
                WHERE UserID = @id
            `);

        if (result.recordset.length === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted", user: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
//view of trainer and users
const getTrainersForUser = async (req, res) => {
    const userID = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("UserID", sql.Int, userID)
            .query("SELECT * FROM trainers_of_users WHERE UserID = @UserID");

        res.status(200).json({ trainers: result.recordset });
    } catch (error) {
        console.error("Error in getTrainersForUser:", error);
        res.status(500).json({ message: "Failed to fetch user trainers", error: error.message });
    }
};
const getFacilitiesForUser = async (req, res) => {
    const userID = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("UserID", sql.Int, userID)
            .query("SELECT * FROM facilities_of_users WHERE UserID = @UserID");

        res.status(200).json({ facilities: result.recordset });
    } catch (error) {
        console.error("Error in getFacilitiesForUser:", error);
        res.status(500).json({ message: "Failed to fetch user facilities", error: error.message });
    }
};

//view of user feedbak
const getFeedbackForUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT FeedbackID, Content, Rating, FeedbackDate FROM feedback_of_users WHERE UserID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No feedback found for this user" });
        }

        res.status(200).json({ feedback: result.recordset });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's feedback", error });
    }
};
//view of user payments
const getPaymentsForUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT PaymentID, Amount, PaymentDate, PaymentType, PaymentStatus
                FROM user_payments_view
                WHERE UserID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No payments found for this user" });
        }

        res.status(200).json({ payments: result.recordset });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's payments", error });
    }
};

//view of user membership
const getMembershipForUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT MembershipID, MembershipType, StartDate, EndDate
                FROM user_membership_view
                WHERE UserID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No membership found for this user" });
        }

        res.status(200).json({ membership: result.recordset });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's membership", error });
    }
};

const loginUser = async (req, res) => {
    const { Username, UserPassword } = req.body;

    if (!Username || !UserPassword) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("Username", sql.VarChar, Username)
            .query("SELECT * FROM Users WHERE Username = @Username");

        const user = result.recordset[0];

        if (!user || user.UserPassword !== UserPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT
        const token = jwt.sign({ userId: user.UserID, username: user.Username }, SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

module.exports = { createUser, registerUserWithMembership,getAllUsers,getUserById, getUserByUsername, getTrainersForUser,getFacilitiesForUser,getFeedbackForUser, getPaymentsForUser, getMembershipForUser, updateUser, deleteUser,loginUser };