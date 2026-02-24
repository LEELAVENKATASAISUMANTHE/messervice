import { pool } from "../db/db.js";

export const fetchstudent = async (criteria) => {
    try {
        const queryText = `
            SELECT * FROM students
            WHERE batch_year = $1
              AND tenth_percent >= $2
              AND twelfth_percent >= $3
              AND ug_cgpa >= $4
              AND branch = ANY($5)
        `;
        // Use array for allowedBranches and pass as Postgres array
        return await pool.query(queryText, [
            criteria.eligibleBatchYear,
            criteria.tenthPercent,
            criteria.twelfthPercent,
            criteria.ugCgpa,
            criteria.allowedBranches
        ]);
    } catch (error) {
        console.error("Error fetching student:", error);
        throw error;
    }
};