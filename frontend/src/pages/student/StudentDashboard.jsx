import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
export default function StudentDashboard() {
  const { user } = useAuth(),
    [data, setData] = useState([]);
  useEffect(() => {
    api
      .get("/complaints/my")
      .then((r) => setData(r.data.complaints))
      .catch(() => {});
  }, []);
  const count = (s) => data.filter((x) => x.status === s).length;
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">STUDENT PORTAL</span>
          <h1>Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p>Track and manage your college complaints.</p>
        </div>
        <Link className="btn" to="/student/create">
          + New Complaint
        </Link>
      </div>
      <div className="stats">
        <Stat n={data.length} t="Total Complaints" icon="📋" />
        <Stat n={count("Pending")} t="Pending" icon="⏳" />
        <Stat n={count("In Progress")} t="In Progress" icon="🔧" />
        <Stat n={count("Resolved")} t="Resolved" icon="✅" />
      </div>
      <div className="sectionHead">
        <h2>Recent Complaints</h2>
        <Link to="/student/complaints">View all →</Link>
      </div>
      {data.length ? (
        <div className="grid">
          {data.slice(0, 4).map((c) => (
            <div className="card" key={c._id}>
              <div className="rowBetween">
                <span className="muted">{c.category}</span>
                <StatusBadge status={c.status} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.location}</p>
              <Link to={`/student/complaints/${c._id}`}>View details →</Link>
            </div>
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </>
  );
}
function Stat({ n, t, icon }) {
  return (
    <div className="stat">
      <div className="statIcon">{icon}</div>
      <div>
        <b>{n}</b>
        <span>{t}</span>
      </div>
    </div>
  );
}
function Empty() {
  return (
    <div className="empty">
      No complaints yet.{" "}
      <Link to="/student/create">Create your first complaint →</Link>
    </div>
  );
}
