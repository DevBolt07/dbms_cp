
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
db.getConnection()
    .then(connection => {
        console.log('Successfully connected to the database.');
        connection.release();
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });

// == API Routes ==

// -- Admin Routes --
app.get('/api/admin/pending-companies', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM companies WHERE status = 'Pending'");
        res.json(rows);
    } catch (error) {
        console.error('Error fetching pending companies:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.post('/api/admin/companies/:id/approve', async (req, res) => {
    const companyId = req.params.id;
    try {
        const [result] = await db.query("UPDATE companies SET status = 'Approved' WHERE id = ?", [companyId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: `Company ${companyId} approved.` });
    } catch (error) {
        console.error(`Error approving company ${companyId}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/admin/companies/:id/reject', async (req, res) => {
    const companyId = req.params.id;
    try {
        const [result] = await db.query("UPDATE companies SET status = 'Rejected' WHERE id = ?", [companyId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: `Company ${companyId} rejected.` });
    } catch (error) {
        console.error(`Error rejecting company ${companyId}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// -- Company Routes --
app.get('/api/company/:id/stats', async (req, res) => {
    const companyId = req.params.id;
    try {
        const [internshipsResult] = await db.query('SELECT COUNT(*) as totalInternships FROM internships WHERE company_id = ?', [companyId]);
        const [applicationsResult] = await db.query(`
            SELECT COUNT(*) as totalApplications FROM applications WHERE internship_id IN (SELECT id FROM internships WHERE company_id = ?)
        `, [companyId]);
        res.json({
            totalInternships: internshipsResult[0].totalInternships || 0,
            totalApplications: applicationsResult[0].totalApplications || 0,
        });
    } catch (error) {
        console.error(`Error fetching stats for company ${companyId}:`, error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.get('/api/company/:id/applications', async (req, res) => {
    const companyId = req.params.id;
    try {
        const [applications] = await db.query(`
            SELECT a.id, s.name as student_name, i.title as internship_title, a.status 
            FROM applications a JOIN students s ON a.student_id = s.id JOIN internships i ON a.internship_id = i.id 
            WHERE i.company_id = ? ORDER BY a.applied_date DESC LIMIT 10
        `, [companyId]);
        res.json(applications);
    } catch (error) {
        console.error(`Error fetching applications for company ${companyId}:`, error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// -- Student Routes --
app.get('/api/student/:id/profile', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [student] = await db.query('SELECT name FROM students WHERE id = ?', [studentId]);
        if (student.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(student[0]);
    } catch (error) {
        console.error(`Error fetching profile for student ${studentId}:`, error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.get('/api/student/:id/applications', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [applications] = await db.query(`
            SELECT a.id, c.company_name, i.title as internship_title, a.status, a.applied_date
            FROM applications a JOIN internships i ON a.internship_id = i.id JOIN companies c ON i.company_id = c.id
            WHERE a.student_id = ? ORDER BY a.applied_date DESC
        `, [studentId]);
        res.json(applications);
    } catch (error) {
        console.error(`Error fetching applications for student ${studentId}:`, error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// -- General Internship Routes --
app.get('/api/internships/recommended', async (req, res) => {
    try {
        const [internships] = await db.query(`
            SELECT i.id, i.title, i.location, c.company_name 
            FROM internships i JOIN companies c ON i.company_id = c.id
            WHERE i.status = 'Open' ORDER BY i.posted_date DESC LIMIT 5
        `);
        res.json(internships);
    } catch (error) {
        console.error('Error fetching recommended internships:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});


app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running and connected!' });
});

// Serve static files
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
