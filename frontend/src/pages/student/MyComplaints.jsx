import React,{ useEffect, useState } from "react";
import api from "../../services/api";
import ComplaintCard from "../../components/ComplaintCard";
export default function MyComplaints() {
  const [data, setData] = useState([]);
  useEffect(() => {
    api.get("/complaints/my").then((r) => setData(r.data.complaints));
  }, []);
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">MY COMPLAINTS</span>
          <h1>Complaint history</h1>
        </div>
      </div>
      {data.length ? (
        <div className="grid">
          {data.map((c) => (
            <ComplaintCard c={c} key={c._id} />
          ))}
        </div>
      ) : (
        <div className="empty">No complaints found.</div>
      )}
    </>
  );
}
