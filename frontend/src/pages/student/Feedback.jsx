import  React,  { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
export default function Feedback() {
  const { id } = useParams(),
    nav = useNavigate(),
    [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/feedback/${id}`, { rating, comment });
      nav(`/student/complaints/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit feedback");
    }
  };
  return (
    <section className="formPage">
      <div className="form card narrow">
        <span className="eyebrow">FEEDBACK</span>
        <h1>How was your experience?</h1>
        <p>Your feedback helps improve campus services.</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={submit}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                className={n <= rating ? "selected" : ""}
                onClick={() => setRating(n)}
                key={n}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more (optional)"
          />
          <button className="btn full">Submit Feedback</button>
        </form>
      </div>
    </section>
  );
}
