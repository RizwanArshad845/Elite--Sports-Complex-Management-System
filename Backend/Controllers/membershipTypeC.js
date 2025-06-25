const { sql, poolPromise } = require("../db");

// Create Membership Type
const createMembershipType = async (req, res) => {
    const { TypeName, Price } = req.body;

    if (!TypeName || Price === undefined) {
        return res.status(400).json({ message: "TypeName and Price are required." });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("TypeName", sql.VarChar(50), TypeName)
            .input("Price", sql.Int, Price)   // <-- Price is Int here now
            .query(`
                INSERT INTO MembershipTypes (TypeName, Price)
                VALUES (@TypeName, @Price);
                SELECT * FROM MembershipTypes WHERE MembershipTypeID = SCOPE_IDENTITY();
            `);

        res.status(201).json({ message: "Membership Type created", membershipType: result.recordset[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating membership type", error });
    }
};

// Get Membership Type by Name
const getMembershipTypeByName = async (req, res) => {
    const { typeName } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('typeName', sql.VarChar(50), typeName)
            .query("SELECT * FROM MembershipTypes WHERE TypeName = @typeName");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Membership type not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching membership type by name:", error);
        res.status(500).json({ message: "Error fetching membership type", error });
    }
};

// Get Membership Type by ID
const getMembershipTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM MembershipTypes WHERE MembershipTypeID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Membership Type not found" });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching membership type", error });
    }
};

module.exports = { 
    createMembershipType,
    getMembershipTypeById,
    getMembershipTypeByName,
};
