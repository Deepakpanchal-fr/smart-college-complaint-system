import React from "react";
import{ Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
export default function ComplaintCard({ c }) {
  return (
    <div className="card complaintCard">
      <div>
        <span className="muted">
          {c.category} · {c.priority}
        </span>
        <h3>{c.title}</h3>
        <p>
          {c.description?.slice(0, 120)}
          {c.description?.length > 120 ? "..." : ""}
        </p>
      </div>
      <div className="cardFoot">
        <StatusBadge status={c.status} />
        <Link className="btn outline" to={`/student/complaints/${c._id}`}>
          View
        </Link>
      </div>
    </div>
  );
}

