import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Student from "./components/Student";
import Lecturer from "./components/Lecturer";
import PRL from "./components/PRL";
import PL from "./components/PL";


import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h2 className="app-title">*LUCT REPORTING APPLICATION* </h2>
          <p1><marquee>----Examine Mokete LUCT system----year---2@25---</marquee></p1>
          <nav className="app-nav">
            <Link to="/" className="nav-link">Student</Link>
            <Link to="/lecturer" className="nav-link">Lecturer</Link>
            <Link to="/prl" className="nav-link">Principal Lecturer</Link>
            <Link to="/pl" className="nav-link">Program Leader</Link>
            
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Student />} />
            <Route path="/lecturer" element={<Lecturer />} />
            <Route path="/prl" element={<PRL />} />
            <Route path="/pl" element={<PL />} />
          </Routes>
        </main>

        <footer className="app-footer">
          © {new Date().getFullYear()} LUCT Reporting System | Faculty of ICT
        </footer>
      </div>
    </Router>
  );
}

export default App;
