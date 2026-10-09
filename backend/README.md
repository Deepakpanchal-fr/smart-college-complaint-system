# Smart College Complaint Management System — Backend

## Setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and fill all required values.

## Run
```bash
npm run dev
```

## Create first admin
```bash
npm run seed:admin
```

## Main APIs
Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
Student: `POST /api/complaints`, `GET /api/complaints/my`
Staff: `GET /api/complaints/staff`, `PUT /api/complaints/:id/status`
Admin: `GET /api/admin/dashboard`, `GET /api/complaints/admin/all`, `PUT /api/complaints/:id/assign`, `POST /api/admin/staff`
Departments: `GET/POST /api/admin/departments`, `PUT/DELETE /api/admin/departments/:id`
Feedback: `POST /api/feedback/:complaintId`
Notifications: `GET /api/notifications`

Protected requests use:
`Authorization: Bearer <JWT>`

Public registration always creates a student. Staff is created by admin; admin is created by `seed:admin`.

Complaint attachments: JPG/PNG/WEBP/PDF, max 5MB. Local uploads are fine for development; use cloud storage for production.
