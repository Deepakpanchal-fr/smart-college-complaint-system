
import  React, {useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
export default function ComplaintDetails() {
  const { id } = useParams(),
    [c, setC] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/complaints/${id}`)
      .then((r) => setC(r.data.complaint))
      .catch((e) => setError(e.response?.data?.message || "Not found"));
  }, [id]);
  if (error) return <div className="alert">{error}</div>;
  if (!c) return <div className="loading">Loading...</div>;
  return (
    <section>
      <Link to="/student/complaints">← Back</Link>
      <div className="detailGrid">
        <div className="card">
          <div className="rowBetween">
            <span className="muted">
              #{c._id.slice(-6)} · {c.category}
            </span>
            <StatusBadge status={c.status} />
          </div>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
          <div className="infoGrid">
            <Info t="Location" v={c.location} />
            <Info t="Priority" v={c.priority} />
            <Info t="Assigned to" v={c.assignedTo?.name || "Not assigned"} />
            <Info t="Department" v={c.department?.name || "Not assigned"} />
          </div>
          {c.resolutionNote && (
            <div className="success">
              <b>Resolution note:</b>
              <br />
              {c.resolutionNote}
            </div>
          )}
          {c.status === "Resolved" && (
            <Link className="btn" to={`/student/complaints/${c._id}/feedback`}>
              Give Feedback ⭐
            </Link>
          )}
        </div>
        <div className="card">
          <h3>Complaint Timeline</h3>
          <Timeline status={c.status} />
        </div>
      </div>
    </section>
  );
}
function Info({ t, v }) {
  return (
    <div>
      <span className="muted">{t}</span>
      <b>{v}</b>
    </div>
  );
}
function Timeline({ status }) {
  const s = ["Pending", "Assigned", "In Progress", "Resolved"],
    i = s.indexOf(status);
  return (
    <div className="timelineVertical">
      {s.map((x, n) => (
        <div className={n <= i ? "tDone" : ""} key={x}>
          <i></i>
          <span>
            <b>{x}</b>
            {n <= i && <small>Completed</small>}
          </span>
        </div>
      ))}
    </div>
  );
}
