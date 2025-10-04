const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// === MySQL Connection ===
const db = mysql.createConnection({
  host: "localhost",       
  user: "root",   
  password: "654321", 
  database: "luct_reporting",
  port: 3306               
});

db.connect((err) => {
  if (err) return console.log("DB connection error:", err);
  console.log("Connected to MySQL database");
});

// === Lecturer Reports Routes ===

// Add new report
app.post("/api/reports", (req, res) => {
  const r = req.body;
  const query = `INSERT INTO lecturer_reports 
  (facultyName, className, weekOfReporting, dateOfLecture, courseName, courseCode, lecturerName, actualPresent, totalRegistered, venue, scheduledTime, topic, learningOutcomes, recommendations)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    r.facultyName, r.className, r.weekOfReporting, r.dateOfLecture,
    r.courseName, r.courseCode, r.lecturerName, r.actualPresent,
    r.totalRegistered, r.venue, r.scheduledTime, r.topic, r.learningOutcomes, r.recommendations
  ];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Report added", id: result.insertId });
  });
});

// Get all reports
app.get("/api/reports", (req, res) => {
  db.query("SELECT * FROM lecturer_reports ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete report
app.delete("/api/reports/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM lecturer_reports WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Report deleted" });
  });
});

// === Student Routes ===

// Create students table if not exists
db.query(
  `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    course VARCHAR(255)
  )`
);

// Register new student
app.post("/api/students", (req, res) => {
  const { name, email, course } = req.body;
  const query = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
  db.query(query, [name, email, course], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student registered", id: result.insertId });
  });
});

// Get all students
app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
