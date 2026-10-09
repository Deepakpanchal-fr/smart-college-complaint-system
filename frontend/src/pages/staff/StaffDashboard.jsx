import  React, { useEffect, useState } from "react";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
export default function StaffDashboard() {
  const [data, setData] = useState([]),
    [selected, setSelected] = useState(null),
    [status, setStatus] = useState("In Progress"),
    [note, setNote] = useState("");
  const load = () =>
    api.get("/complaints/staff").then((r) => setData(r.data.complaints))
  .catch((err) => {
    console.error(err);
    alert("Failed to load complaints.");
  });
  useEffect(()=>{load()}, []);
  const update = async () => {
    await api.put(`/complaints/${selected._id}/status`, {
      status,
      resolutionNote: note,
    });
    setSelected(null);
    setNote("");
    load();
  };
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">STAFF PORTAL</span>
          <h1>Assigned complaints</h1>
          <p>Work through issues assigned to your department.</p>
        </div>
      </div>
      <div className="stats">
        <Stat n={data.length} t="Assigned" />
        <Stat
          n={data.filter((x) => x.status === "In Progress").length}
          t="In Progress"
        />
        <Stat
          n={data.filter((x) => x.status === "Resolved").length}
          t="Resolved"
        />
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Complaint</th>
              <th>Student</th>
              <th>Priority</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c._id}>
                <td>
                  <b>{c.title}</b>
                  <small>{c.location}</small>
                </td>
                <td>{c.student?.name}</td>
                <td>{c.priority}</td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td>
                  <button className="btn small" onClick={() => setSelected(c)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="modal">
          <div className="modalBox">
            <button className="close" onClick={() => setSelected(null)}>
              ×
            </button>
            <h2>Update complaint</h2>
            <p>{selected.title}</p>
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["Assigned", "In Progress", "Resolved", "Rejected"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Resolution note
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <button className="btn" onClick={update}>
              Save update
            </button>
          </div>
        </div>
      )}
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
