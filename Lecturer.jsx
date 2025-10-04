import React, { useState, useEffect } from "react";
import "../styles/lecturer.css";

function Lecturer() {
  const initialReport = {
    facultyName: "Faculty of Information Communication Technology",
    className: "",
    weekOfReporting: "",
    dateOfLecture: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    actualPresent: "",
    totalRegistered: "",
    venue: "",
    scheduledTime: "",
    topic: "",
    learningOutcomes: "",
    recommendations: "",
  };

  const [report, setReport] = useState(initialReport);
  const [reports, setReports] = useState([]);
  const [totalRegistered, setTotalRegistered] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api/reports"; // backend URL

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report.courseName || !report.lecturerName || !report.dateOfLecture) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...report, totalRegistered }),
      });

      if (res.ok) {
        setMessage("✅ Report saved successfully!");
        setReport(initialReport);
        fetchReports(); // refresh list
      } else {
        const data = await res.json();
        setMessage("❌ " + (data.error || "Failed to save report"));
      }
    } catch (err) {
      setMessage("❌ Server error: " + err.message);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  return (
    <div className="card p-3">
      <h4>Lecturer Reporting Form</h4>
      <form onSubmit={handleSubmit} className="row g-2">
        <div className="col-md-6">
          <label className="form-label">Faculty Name</label>
          <input
            className="form-control"
            name="facultyName"
            value={report.facultyName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Class Name</label>
          <input
            className="form-control"
            name="className"
            value={report.className}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Week of Reporting</label>
          <input
            className="form-control"
            name="weekOfReporting"
            value={report.weekOfReporting}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Date of Lecture</label>
          <input
            type="date"
            className="form-control"
            name="dateOfLecture"
            value={report.dateOfLecture}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Course Name</label>
          <input
            className="form-control"
            name="courseName"
            value={report.courseName}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Course Code</label>
          <input
            className="form-control"
            name="courseCode"
            value={report.courseCode}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Lecturer’s Name</label>
          <input
            className="form-control"
            name="lecturerName"
            value={report.lecturerName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Actual Students Present</label>
          <input
            type="number"
            className="form-control"
            name="actualPresent"
            value={report.actualPresent}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Total Registered Students</label>
          <input
            className="form-control"
            value={totalRegistered}
            onChange={(e) => setTotalRegistered(e.target.value)}
          />
          <small className="text-muted">Saved once and reused</small>
        </div>

        <div className="col-md-4">
          <label className="form-label">Venue</label>
          <input
            className="form-control"
            name="venue"
            value={report.venue}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Scheduled Lecture Time</label>
          <input
            className="form-control"
            name="scheduledTime"
            value={report.scheduledTime}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Topic Taught</label>
          <input
            className="form-control"
            name="topic"
            value={report.topic}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Learning Outcomes</label>
          <textarea
            className="form-control"
            name="learningOutcomes"
            value={report.learningOutcomes}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Lecturer’s Recommendations</label>
          <textarea
            className="form-control"
            name="recommendations"
            value={report.recommendations}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-2">
          <button className="btn btn-success">Save Report</button>
          <span className="ms-3 text-success">{message}</span>
        </div>
      </form>

      <hr />
      <h5>Submitted Reports</h5>
      {reports.length === 0 ? (
        <p className="text-muted">No reports submitted yet.</p>
      ) : (
        <ul className="list-group">
          {reports.map((r) => (
            <li key={r.id} className="list-group-item">
              <strong>{r.courseName}</strong> — {r.dateOfLecture}
              <br />
              <span className="text-muted">{r.topic}</span>
              <button
                className="btn btn-sm btn-danger float-end"
                onClick={() => deleteReport(r.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Lecturer;
