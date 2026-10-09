import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <div>
        <span className="eyebrow">SMART CAMPUS • COMPLAINT MANAGEMENT</span>
        <h1>
          Report it.
          <br />
          <span>Track it.</span>
          <br />
          Resolve it.
        </h1>
        <p>
          A modern digital platform for students, staff and administrators to
          report, manage and resolve college complaints transparently.
        </p>
        <div className="actions">
          <Link className="btn" to={user ? "/go" : "/register"}>
            {user ? "Open Dashboard" : "Get Started →"}
          </Link>
          <Link className="btn outline" to="/login">
            Sign in
          </Link>
        </div>
      </div>
      <div className="heroCard">
        <div className="miniTop">
          Complaint #1024 <span className="badge in-progress">In Progress</span>
        </div>
        <h3>Classroom projector not working</h3>
        <p>Room 204 · Electrical</p>
        <div className="timeline">
          <i className="done"></i>
          <i className="done"></i>
          <i className="active"></i>
          <i></i>
        </div>
        <div className="steps">
          <span>Submitted</span>
          <span>Assigned</span>
          <span>Working</span>
          <span>Resolved</span>
        </div>
      </div>
    </section>
  );
}
