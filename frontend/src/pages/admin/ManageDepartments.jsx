import React, { useEffect, useState } from "react";
import api from "../../services/api";
export default function ManageDepartments() {
  const [data, setData] = useState([]),
    [name, setName] = useState(""),
    [description, setDescription] = useState("");
  const load = () =>
    api.get("/admin/departments").then((r) => setData(r.data.departments));
  useEffect(()=>{load()}, []);
  const add = async (e) => {
    e.preventDefault();
    await api.post("/admin/departments", { name, description });
    setName("");
    setDescription("");
    load();
  };
  const del = async (id) => {
    if (confirm("Delete this department?")) {
      await api.delete(`/admin/departments/${id}`);
      load();
    }
  };
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">ADMIN • DEPARTMENTS</span>
          <h1>Departments</h1>
        </div>
      </div>
      <div className="two">
        <form className="card form" onSubmit={add}>
          <h2>Add department</h2>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Maintenance"
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button className="btn">Add Department</button>
        </form>
        <div className="grid one">
          {data.map((d) => (
            <div className="card rowBetween" key={d._id}>
              <div>
                <h3>{d.name}</h3>
                <p>{d.description || "No description"}</p>
              </div>
              <button className="btn danger" onClick={() => del(d._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
