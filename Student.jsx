import React, { useState, useEffect } from "react";

function Student() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("student_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState(user ? "monitoring" : "login");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "Diploma in Information Technology",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("student_user", JSON.stringify(user));
    }
  }, [user]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill in all fields before...");
      return;
    }
    if (students.find((s) => s.email === form.email)) {
      setMessage("!!WOW! your!Email already registered");
      return;
    }
    const newStudent = { ...form, id: Date.now() };
    setStudents([...students, newStudent]);
    setForm({
      name: "",
      email: "",
      password: "",
      course: "Diploma in Information Technology",
    });
    setMessage("Registered successfully! Please login.");
    setView("login");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = students.find(
      (s) => s.email === loginForm.email && s.password === loginForm.password
    );
    if (found) {
      setUser(found);
      setView("monitoring");
      setMessage("");
    } else {
      setMessage("Invalid email or password");
    }
  };


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("student_user");

    setView("login");
  };

  const Monitoring = ({ student }) => (
    <div>
      <h3>Monitoring </h3>
      <p>Welcome, <strong>{student.name}, at Limkokwing University of Creative Technology </strong></p>
      <p>Email: {student.email},,,was accepted in the institution</p>
      <p>Course: {student.course}</p>

      <hr />
      <h5>All Registered Students</h5>
      {students.length === 0 ? (
        <p>No students yet.</p>
      ) : (
        <ul className="list-group">
          {students.map((s) => (
            <li key={s.id} className="list-group-item">
              <strong>{s.name}</strong> — {s.email} <br />
              <small>Course: {s.course}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const Rating = ({ student }) => {
    const [rate, setRate] = useState(null);
    return (
      <div>
        <h3>⭐ Rating</h3>
        <p>Hello {student.name}, please rate your experience:</p>
        {[1, 2, 3, 4, 5].map((r) => (
          <button
            key={r}
            onClick={() => setRate(r)}
            className="btn btn-outline-primary m-1"
          >
            {r}
          </button>
        ))}
        {rate && <p>You rated: {rate} ⭐</p>}
      </div>
    );
  };

  return (
    <div className="container p-3">
      <h2 className="mb-3">🎓 LUCT Student Portal</h2>

      {!user && view === "register" && (
        <form onSubmit={handleRegister} className="card p-3">
          <h4>Register</h4>
          <input
            name="name"
            placeholder="Name"
            className="form-control mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            name="course"
            className="form-select mb-2"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option>BSc Degree in Information Technology</option>
            <option>Diploma in Information Technology</option>
            <option>BSc Degree in Business Information Technology</option>
            <option>Diploma in Business Information Technology</option>
            <option>BSc Degree in Software Engineering</option>
            <option>Diploma in Software Engineering</option>
          </select>
          <button className="btn btn-success">Register</button>
          <p className="mt-2">
            Already have an account?{" "}
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setView("login")}
            >
              Login
            </button>
          </p>
        </form>
      )}

      {!user && view === "login" && (
        <form onSubmit={handleLogin} className="card p-3">
          <h4>Login</h4>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
          <button className="btn btn-primary">Login</button>
          <p className="mt-2">
            Don’t have an account?{" "}
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setView("register")}
            >
              Register
            </button>
          </p>
        </form>
      )}

      {user && (
        <div>
          <div className="mb-3">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setView("monitoring")}
            >
              Monitoring
            </button>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setView("rating")}
            >
              Rating
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {view === "monitoring" && <Monitoring student={user} />}
          {view === "rating" && <Rating student={user} />}
        </div>
      )}

      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
}

export default Student;
