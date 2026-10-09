import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import CreateComplaint from "./pages/student/CreateComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import ComplaintDetails from "./pages/student/ComplaintDetails";
import Feedback from "./pages/student/Feedback";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDepartments from "./pages/admin/ManageDepartments";
import Notifications from "./pages/Notifications";
function RedirectByRole() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <Navigate
      to={
        user.role === "admin"
          ? "/admin"
          : user.role === "staff"
            ? "/staff"
            : "/student"
      }
      replace
    />
  );
}
export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/go" element={<RedirectByRole />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/create"
            element={
              <ProtectedRoute roles={["student"]}>
                <CreateComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complaints"
            element={
              <ProtectedRoute roles={["student"]}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complaints/:id"
            element={
              <ProtectedRoute roles={["student"]}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complaints/:id/feedback"
            element={
              <ProtectedRoute roles={["student"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={["staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["student", "staff", "admin"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
