import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
export default function CreateComplaint() {
  const nav = useNavigate(),
    [deps, setDeps] = useState([]),
    [error, setError] = useState(""),
    [f, setF] = useState({
      title: "",
      description: "",
      category: "Electrical",
      location: "",
      priority: "Medium",
      department: "",
    });
  useEffect(() => {
    api
      .get("/departments")
      .then((r) => setDeps(r.data.departments))
      .catch(() => {});
  }, []);
  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => v && fd.append(k, v));
    const file = e.target.attachment.files[0];
    if (file) fd.append("attachment", file);
    try {
      const r = await api.post("/complaints", fd);
      nav(`/student/complaints/${r.data.complaint._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create complaint");
    }
  };
  return (
    <section className="formPage">
      <div className="pageHead">
        <div>
          <span className="eyebrow">NEW COMPLAINT</span>
          <h1>Report an issue</h1>
          <p>Give enough detail so the right team can resolve it quickly.</p>
        </div>
      </div>
      <form className="form card" onSubmit={submit}>
        {error && <div className="alert">{error}</div>}
        <div className="two">
          <label>
            Title
            <input
              name="title"
              onChange={change}
              required
              placeholder="e.g. Fan not working"
            />
          </label>
          <label>
            Category
            <select name="category" value={f.category} onChange={change}>
              {[
                "Electrical",
                "Plumbing",
                "Cleanliness",
                "Internet/WiFi",
                "Hostel",
                "Classroom",
                "Library",
                "Transport",
                "Security",
                "Other",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            onChange={change}
            required
            placeholder="Describe the issue..."
          />
        </label>
        <div className="two">
          <label>
            Location
            <input
              name="location"
              onChange={change}
              required
              placeholder="Room / Building / Hostel"
            />
          </label>
          <label>
            Priority
            <select name="priority" value={f.priority} onChange={change}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>
        </div>
        <label>
          Department (optional)
          <select name="department" value={f.department} onChange={change}>
            <option value="">Select department</option>
        
            {deps.map((d) => (
              <option value={d._id} key={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Attachment{" "}
          <input
            name="attachment"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
          />
        </label>
        <button className="btn">Submit Complaint →</button>
      </form>
    </section>
  );
}
