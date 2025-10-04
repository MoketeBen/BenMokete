import React, { useState, useEffect } from "react";


function PRL() {
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    courseCode: "",
  });

  const API_REPORTS = "http://localhost:5000/api/reports";
  const API_FEEDBACK = "http://localhost:5000/api/prl-feedback";
  const API_COURSES = "http://localhost:5000/api/courses";

  // Fetch reports, feedbacks, courses
  const fetchData = async () => {
    try {
      // reports
      const resReports = await fetch(API_REPORTS);
      const dataReports = await resReports.json();
      setReports(dataReports);

      // feedback
      const savedFeedbacks = localStorage.getItem("feedbacks");
      if (savedFeedbacks) {
        setFeedbacks(JSON.parse(savedFeedbacks));
      } else {
        const resFeedback = await fetch(API_FEEDBACK);
        const dataFeedback = await resFeedback.json();
        const feedbackMap = {};
        dataFeedback.forEach((f) => {
          feedbackMap[f.reportId] = f.feedback;
        });
        setFeedbacks(feedbackMap);
      }

      // courses
      const resCourses = await fetch(API_COURSES);
      const dataCourses = await resCourses.json();
      setCourses(dataCourses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFeedbackChange = (id, value) => {
    setFeedbacks((prev) => ({ ...prev, [id]: value }));
  };

  //  Save feedback to API + localStorage
  const saveFeedback = async (id) => {
    try {
      // 1. Save to API if available
      await fetch(`${API_FEEDBACK}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: feedbacks[id] }),
      });

      // 2. Always save to localStorage
      localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
      alert("Feedback saved and shared with Programme Leader!");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle add new course
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const addCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.courseName || !newCourse.courseCode) {
      alert("Please fill all course fields");
      return;
    }
    try {
      const res = await fetch(API_COURSES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      if (res.ok) {
        alert("Course added successfully");
        setNewCourse({ courseName: "", courseCode: "" });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card p-3">
      <h4>Principal Lecturer Dashboard</h4>
      <p className="text-muted">Manage courses, view reports and provide feedback</p>

      {/* Add Course Section */}
      <div className="mb-4">
        <h5>+Add New Course</h5>
        <form className="row g-2" onSubmit={addCourse}>
          <div className="col-md-5">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              className="form-control"
              value={newCourse.courseName}
              onChange={handleCourseChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code"
              className="form-control"
              value={newCourse.courseCode}
              onChange={handleCourseChange}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-success w-100">Add Course</button>
          </div>
        </form>
      </div>

      {/* List of Courses */}
      <div className="mb-4">
        <h5>Current Courses</h5>
        {courses.length === 0 ? (
          <p className="text-muted">No courses yet.</p>
        ) : (
          <ul className="list-group">
            {courses.map((c) => (
              <li key={c.id} className="list-group-item">
                {c.courseName} ({c.courseCode})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reports + Feedback */}
      <h5>Lecturer Reports</h5>
      {reports.length === 0 ? (
        <p className="text-danger">
          No reports found. Ask lecturers to submit reports first.
        </p>
      ) : (
        <ul className="list-group">
          {reports.map((report) => (
            <li key={report.id} className="list-group-item">
              <h6>
                {report.courseName} ({report.courseCode})
              </h6>
              <p>
                <strong>Lecturer:</strong> {report.lecturerName}
              </p>
              <p>
                <strong>Date:</strong> {report.dateOfLecture}
              </p>
              <p>
                <strong>Topic:</strong> {report.topic}
              </p>
              <p>
                <strong>Students Present:</strong> {report.actualPresent}/
                {report.totalRegistered}
              </p>

              <textarea
                className="form-control"
                placeholder="Enter feedback..."
                value={feedbacks[report.id] || ""}
                onChange={(e) =>
                  handleFeedbackChange(report.id, e.target.value)
                }
              ></textarea>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={() => saveFeedback(report.id)}
              >
                Save Feedback
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PRL;
