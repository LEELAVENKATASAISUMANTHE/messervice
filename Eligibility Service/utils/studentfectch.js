import { pool } from "../db/db.js";

export const fetchstudent = async (criteria) => {
    try {
        const queryText = `
            SELECT s.student_id, s.first_name, s.middle_name, s.last_name, s.full_name, s.gender, s.dob, s.email, s.alt_email, s.college_email, s.mobile
            FROM students s
            JOIN student_academics sa ON s.student_id = sa.student_id
            WHERE s.graduation_year = $1
              AND sa.tenth_percent >= $2
              AND sa.twelfth_percent >= $3
              AND sa.ug_cgpa >= $4
              AND s.branch = ANY($5)
        `;
        const result = await pool.query(queryText, [
            criteria.eligibleBatchYear,
            criteria.tenthPercent,
            criteria.twelfthPercent,
            criteria.ugCgpa,
            criteria.allowedBranches
        ]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching student:", error);
        throw error;
    }
};

export const fetchApplicationDeadline = async (jobId) => {
    try {
        const queryText = `
            SELECT application_deadline
            FROM jobs
            WHERE job_id = $1
            LIMIT 1
        `;
        const result = await pool.query(queryText, [jobId]);
        return result.rows[0]?.application_deadline ?? null;
    } catch (error) {
        console.error("Error fetching application deadline:", error);
        throw error;
    }
};
