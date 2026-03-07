# TPC Management Backend - API Documentation

## 10 Advanced Features Implemented

---

## FEATURE 1 — Job Listing API with Filters

**Endpoint:** `GET /api/jobs`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| location | string | Filter by location |
| salary | number | Filter by minimum salary |
| search | string | Search by job title |
| companyId | number | Filter by company |
| jobType | string | Filter by job type |
| isActive | boolean | Filter by active status |

**Example Request:**
```bash
GET /api/jobs?page=1&limit=10&location=Delhi&salary=50000&search=software
```

**Example Response:**
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Software Engineer",
      "description": "...",
      "salary": "60000",
      "location": "Delhi",
      "company": {
        "id": 1,
        "name": "Tech Corp",
        "isVerified": true
      },
      "_count": {
        "applications": 5
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## FEATURE 2 — Student Dashboard API

**Endpoint:** `GET /api/dashboard/student`

**Headers:**
```
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "profile": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "branch": "Computer Science",
    "batch": 2024,
    "resumePath": "/uploads/resumes/resume.pdf"
  },
  "applications": {
    "total": 10,
    "statuses": {
      "applied": 5,
      "shortlisted": 3,
      "rejected": 2
    }
  },
  "recentApplications": [
    {
      "id": 1,
      "status": "APPLIED",
      "job": {
        "title": "Software Engineer",
        "company": { "name": "Tech Corp" }
      }
    }
  ],
  "recentJobs": [...]
}
```

---

## FEATURE 3 — Company Dashboard API

**Endpoint:** `GET /api/dashboard/company`

**Headers:**
```
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "profile": {
    "id": 2,
    "name": "Tech Corp",
    "isVerified": true
  },
  "jobs": {
    "total": 5,
    "details": [
      {
        "id": 1,
        "title": "Software Engineer",
        "_count": { "applications": 10 }
      }
    ]
  },
  "applications": {
    "total": 50,
    "statuses": {
      "applied": 30,
      "shortlisted": 15,
      "rejected": 5
    }
  },
  "recentApplications": [...]
}
```

---

## FEATURE 4 — Admin Dashboard

**Endpoint:** `GET /api/dashboard/admin`

**Headers:**
```
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "statistics": {
    "totalStudents": 100,
    "totalCompanies": 20,
    "totalJobs": 50,
    "totalApplications": 200,
    "verifiedCompanies": 15,
    "unverifiedCompanies": 5
  },
  "applicationStatuses": {
    "applied": 100,
    "shortlisted": 50,
    "rejected": 50
  },
  "recentStudents": [...],
  "recentCompanies": [...],
  "recentJobs": [...]
}
```

---

## FEATURE 5 — Resume Upload

**Endpoint:** `POST /api/users/upload-resume`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| resume | file | Resume file (PDF, DOC, DOCX) |

**Example Response:**
```json
{
  "message": "Resume uploaded successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "resumePath": "/uploads/resumes/resume-1-1234567890.pdf"
  },
  "file": {
    "originalName": "my_resume.pdf",
    "filename": "resume-1-1234567890.pdf",
    "size": 1024000,
    "path": "/uploads/resumes/resume-1-1234567890.pdf"
  }
}
```

---

## FEATURE 6 — Shortlist Candidate

**Endpoint:** `PATCH /api/applications/:id/status`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "SHORTLISTED"
}
```

**Valid Status Values:** `APPLIED`, `SHORTLISTED`, `REJECTED`

**Example Response:**
```json
{
  "message": "Application shortlisted successfully",
  "application": {
    "id": 1,
    "status": "SHORTLISTED",
    "student": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "job": {
      "id": 1,
      "title": "Software Engineer",
      "company": { "name": "Tech Corp" }
    }
  }
}
```

---

## FEATURE 7 — Company Verification (Admin)

**Endpoint:** `PATCH /api/admin/verify-company/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "message": "Company verified successfully",
  "company": {
    "id": 2,
    "name": "Tech Corp",
    "email": "tech@corp.com",
    "role": "COMPANY",
    "isVerified": true
  }
}
```

**Other Admin Endpoints:**
- `GET /api/admin/unverified-companies` - List unverified companies
- `GET /api/admin/verified-companies` - List verified companies
- `PATCH /api/admin/unverify-company/:id` - Revoke verification

---

## FEATURE 8 — Pagination

All listing APIs support pagination:

| Parameter | Default | Description |
|-----------|---------|-------------|
| page | 1 | Current page number |
| limit | 10 | Items per page |

**Pagination Response Format:**
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## FEATURE 9 — Logging System

Winston logger configured in `src/utils/logger.js`

**Log Files:**
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

**Logged Events:**
- API requests
- Errors
- Server events

---

## FEATURE 10 — Rate Limiting

**Rate Limits Applied:**

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 15 minutes |
| Register | 3 requests | 1 hour |
| Job Apply | 10 requests | 1 hour |
| Job Post | 10 requests | 24 hours |
| General API | 100 requests | 15 minutes |

**Rate Limited Response (429):**
```json
{
  "error": "Too many login attempts from this IP, please try again after 15 minutes"
}
```

---

## Required NPM Packages

```json
{
  "express-rate-limit": "^7.0.0",
  "multer": "^1.4.5-lts.1",
  "winston": "^3.10.0"
}
```

---

## Database Schema Updates

**New Fields Added:**

1. **User Model:**
   - `resumePath` (String, optional) - Path to uploaded resume
   - `isVerified` (Boolean, default: false) - Company verification status

2. **Job Model:**
   - `requirements` (String, optional)
   - `jobType` (String, optional)
   - `isActive` (Boolean, default: true)
   - `deadline` (DateTime, optional)

3. **Application Model:**
   - `resumeUrl` (String, optional)
   - `coverLetter` (String, optional)
   - `appliedAt` (DateTime)

---

## Setup Instructions

1. **Install Dependencies:**
```bash
npm install
```

2. **Generate Prisma Client:**
```bash
npx prisma generate
```

3. **Run Migrations:**
```bash
npx prisma migrate dev
```

4. **Start Server:**
```bash
npm run dev
```

---

## All API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get profile
- `PUT /api/users/me` - Update profile
- `POST /api/users/upload-resume` - Upload resume
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (company)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/my/jobs` - Get company's jobs

### Applications
- `POST /api/applications/jobs/:jobId/apply` - Apply for job
- `GET /api/applications/my` - Get my applications
- `GET /api/applications/jobs/:jobId` - Get applications for job
- `PATCH /api/applications/:id/status` - Update status (shortlist/reject)

### Dashboard
- `GET /api/dashboard/student` - Student dashboard
- `GET /api/dashboard/company` - Company dashboard
- `GET /api/dashboard/admin` - Admin dashboard

### Admin
- `PATCH /api/admin/verify-company/:id` - Verify company
- `GET /api/admin/unverified-companies` - List unverified

