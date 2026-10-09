import React ,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
export default function AdminDashboard() {
  const [d, setD] = useState(null);
  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setD(r.data));
  }, []);
  if (!d) return <div className="loading">Loading dashboard...</div>;
  const t = d.totals;
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">ADMIN CONSOLE</span>
          <h1>College overview</h1>
          <p>Monitor complaints, teams and resolution performance.</p>
        </div>
        <div className="actions">
          <Link className="btn outline" to="/admin/users">
            Users
          </Link>
          <Link className="btn" to="/admin/complaints">
            Manage Complaints
          </Link>
        </div>
      </div>
      <div className="stats">
        <Stat n={t.total} t="Total" />
        <Stat n={t.pending} t="Pending" />
        <Stat n={t.inProgress} t="In Progress" />
        <Stat n={t.resolved} t="Resolved" />
      </div>
      <div className="dashboardGrid">
        <div className="card">
          <h2>Complaints by category</h2>
          {d.categoryStats.map((x) => (
            <div className="barRow" key={x._id}>
              <span>{x._id}</span>
              <div>
                <i
                  style={{
                    width: `${Math.min(100, (x.count / Math.max(1, t.total)) * 100)}%`,
                  }}
                ></i>
              </div>
              <b>{x.count}</b>
            </div>
          ))}
        </div>
        <div className="card quick">
          <h2>Management</h2>
          <Link to="/admin/complaints">📋 Manage complaints</Link>
          <Link to="/admin/users">👥 Manage users & staff</Link>
          <Link to="/admin/departments">🏢 Manage departments</Link>
        </div>
      </div>
    </>
  );
}
function Stat({ n, t }) {
  return (
    <div className="stat">
      <div>
        <b>{n}</b>
        <span>{t}</span>
      </div>
    </div>
  );
}
