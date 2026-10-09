import React, { useEffect, useState } from "react";
import api from "../services/api";
export default function Notifications() {
  const [data, setData] = useState([]);
  const load = () =>
    api.get("/notifications").then((r) => setData(r.data.notifications));
  useEffect(()=>{load()}, []);
  const read = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };
  const all = async () => {
    await api.patch("/notifications/read-all");
    load();
  };
  return (
    <>
      <div className="pageHead">
        <div>
          <span className="eyebrow">NOTIFICATIONS</span>
          <h1>Updates</h1>
        </div>
        <button className="btn outline" onClick={all}>
          Mark all read
        </button>
      </div>
      <div className="notificationList">
        {data.map((n) => (
          <div
            className={`notification card ${!n.isRead ? "unread" : ""}`}
            key={n._id}
          >
            <div className="notifIcon">🔔</div>
            <div>
              <b>{n.title}</b>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
            {!n.isRead && (
              <button className="btn small outline" onClick={() => read(n._id)}>
                Mark read
              </button>
            )}
          </div>
        ))}
        {!data.length && <div className="empty">You're all caught up.</div>}
      </div>
    </>
  );
}
