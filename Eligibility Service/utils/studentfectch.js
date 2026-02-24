import { pool } from "../db/db.js";

export const fetchstudent = async (criteria) => {
    try {
        const queryText = `
            SELECT s.*, sa.*
            FROM students s
            JOIN student_academics sa ON s.student_id = sa.student_id
            WHERE s.graduation_year = $1
              AND sa.tenth_percent >= $2
              AND sa.twelfth_percent >= $3
              AND sa.ug_cgpa >= $4
              AND s.branch = ANY($5)
        `;
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