import  React, { useEffect, useState } from "react";
import api from "../../services/api";
export default function ManageUsers() {
  const [data, setData] = useState([]),
    [deps, setDeps] = useState([]),
    [open, setOpen] = useState(false),
    [f, setF] = useState({ name: "", email: "", password: "", department: "" });
  const load = () =>
    Promise.all([api.get("/admin/users"), api.get("/admin/departments")]).then(
      ([u, d]) => {
        setData(u.data.users);
        setDeps(d.data.departments);
      },
    );
useEffect(()=>{load()}, []);
  const create = async (e) => {
    e.preventDefault();
    await api.post("/admin/staff", f);
    setOpen(false);
    setF({ name: "", email: "", password: "", department: "" });
    load();
  };
  const toggle = async (id) => {
    await api.patch(`/admin/users/${id}/toggle`);
    load();
  };
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">ADMIN • USERS</span>
          <h1>Users & staff</h1>
        </div>
        <button className="btn" onClick={() => setOpen(true)}>
          + Add Staff
        </button>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
                <td>{u.department?.name || "—"}</td>
                <td>{u.isActive ? "Active" : "Inactive"}</td>
                <td>
                  {u.role !== "admin" && (
                    <button
                      className="btn small outline"
                      onClick={() => toggle(u._id)}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="modal">
          <form className="modalBox" onSubmit={create}>
            <button
              type="button"
              className="close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <h2>Create staff</h2>
            <label>
              Name
              <input
                required
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </label>
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
              />
            </label>
            <label>
              Department
              <select
                value={f.department}
                onChange={(e) => setF({ ...f, department: e.target.value })}
              >
                <option value="">Select</option>
                {deps.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn full">Create Staff</button>
          </form>
        </div>
      )}
    </>
  );
}
