import React, { useState, useEffect } from "react";

function PL() {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [courses, setCourses] = useState([
    "Diploma in Information Technology",
    "Diploma in Business Information Technology",
    "BSc Degree in Business Information Technology"
  ]);
  const [newCourse, setNewCourse] = useState("");

  const API_REPORTS = "http://localhost:5000/api/reports";
  const API_FEEDBACK = "http://localhost:5000/api/prl-feedback";

  // Fetch reports and feedbacks
  const fetchData = async () => {
    try {
      const resReports = await fetch(API_REPORTS);
      const dataReports = await resReports.json();
      setReports(dataReports);

      const resFeedback = await fetch(API_FEEDBACK);
      const dataFeedback = await resFeedback.json();
      const feedbackMap = {};
      dataFeedback.forEach((f) => {
        feedbackMap[f.reportId] = f.feedback;
      });
      setFeedbacks(feedbackMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCourse = () => {
    if (newCourse.trim() === "") return;
    setCourses([...courses, newCourse]);
    setNewCourse("");
  };

  const removeCourse = (course) => {
    setCourses(courses.filter((c) => c !== course));
  };

  return (
    <div className="card p-3">
      <h4>Program Leader Dashboard</h4>
      <p className="text-muted">Manage courses and view reports with PRL feedback</p>

      <hr />
      <h5>Manage Courses</h5>
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="New course name"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
        />
        <button className="btn btn-success" onClick={addCourse}>
          Add
        </button>
      </div>
      <ul className="list-group mb-4">
        {courses.map((c, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            {c}
            <button className="btn btn-sm btn-danger" onClick={() => removeCourse(c)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <hr />
      <h5>Reports with Feedback</h5>
      {reports.length === 0 ? (
        <p className="text-danger"> No reports found yet.</p>
      ) : (
        <ul className="list-group">
          {reports.map((report) => (
            <li key={report.id} className="list-group-item">
              <strong>{report.courseName}</strong> ({report.courseCode})<br />
              Lecturer: {report.lecturerName} | Date: {report.dateOfLecture}<br />
              Topic: {report.topic}<br />
              Students: {report.actualPresent}/{report.totalRegistered}<br />
              <span className="text-muted">PRL Feedback: </span>
              <em>{feedbacks[report.id] || "No feedback yet"}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PL;
