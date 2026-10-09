import React,{ useEffect, useState } from "react";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
export default function ManageComplaints() {
  const [data, setData] = useState([]),
    [staff, setStaff] = useState([]),
    [sel, setSel] = useState(null),
    [staffId, setStaffId] = useState("");
  const load = () =>
    Promise.all([
      api.get("/complaints/admin/all?limit=100"),
      api.get("/admin/users?role=staff"),
    ]).then(([a, b]) => {
      setData(a.data.complaints);
      setStaff(b.data.users);
    });
  useEffect(() => {
    load();
  }, []);
  const assign = async () => {
    await api.put(`/complaints/${sel._id}/assign`, { staffId });
    setSel(null);
    load();
  };
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">ADMIN • COMPLAINTS</span>
          <h1>Manage complaints</h1>
        </div>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Complaint</th>
              <th>Student</th>
              <th>Category</th>
              <th>Status</th>
              <th>Assigned</th>
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
                <td>{c.category}</td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td>{c.assignedTo?.name || "—"}</td>
                <td>
                  <button
                    className="btn small"
                    onClick={() => {
                      setSel(c);
                      setStaffId(c.assignedTo?._id || "");
                    }}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <div className="modal">
          <div className="modalBox">
            <button className="close" onClick={() => setSel(null)}>
              ×
            </button>
            <h2>Assign complaint</h2>
            <p>{sel.title}</p>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option value={s._id} key={s._id}>
                  {s.name} — {s.department?.name || "No department"}
                </option>
              ))}
            </select>
            <button className="btn full" disabled={!staffId} onClick={assign}>
              Assign
            </button>
          </div>
        </div>
      )}
    </>
  );
}
