# MediKiosk — AI-Powered Clinical Intake & Hospital Platform (MERN)

Full MediKiosk website built from the UI screens in `Images/` (70 screens: patient kiosk flow, doctor portal, triage/nurse portal, admin/enterprise ops).
Stack: **React + Vite frontend** (normal CSS only) + **Express + Mongoose backend**. Works with MongoDB when available, otherwise falls back to an in-memory demo store.

## Structure

```
SIH Hackathon/
  Images/        # reference UI screens (code.html + screen.png per page) + clinical_direct/DESIGN.md
  frontend/      # React + Vite app — CSS lives ONLY in src/css/
    src/css/     # variables.css, base.css, components.css, kiosk.css, staff.css, responsive.css
    src/pages/   # Welcome, StaffLogin, checkin/*, history/*, documents/*, queue/*, exit/*, doctor/*, triage/*, admin/*
  backend/       # Express API (server.js + src/routes/api.js + models + in-memory fallback)
```

## Run

```bash
# backend — http://localhost:5000
cd backend
npm install
npm run dev

# frontend — http://localhost:5173 (proxies /api → :5000)
cd frontend
npm install
npm run dev
```

Frontend also works without the backend (mock data + localStorage fallback).

## Demo logins (Staff Login page)

| Staff ID | Password | Lands on |
|---|---|---|
| DOC-104 | doctor123 | Doctor dashboard |
| NUR-88421 | nurse123 | Triage dashboard |
| ADM-01 | admin123 | Admin dashboard |

## Patient kiosk flow

`/` Welcome → `/checkin/language` → `/checkin/accessibility` → `/checkin/identify` → `/checkin/abha-qr` | `/checkin/abha-mobile` | `/checkin/register` → `/checkin/confirm` → `/checkin/department` → `/checkin/token` → `/history/intro` → `/history/chief-complaint` → `/history/symptoms` → `/history/ai-followup` → `/history/details` → (`/history/red-flag` if red-flag keywords) → `/history/past-history` → `/history/review` → `/documents/intro` → `/documents/scanner` → `/documents/processing` → `/documents/review` → `/documents/abnormal` → `/documents/timeline` → `/documents/complete` → `/vitals` → `/queue/status` → `/queue/live` → `/queue/ready` → `/exit/completed` → `/exit/summary` → `/exit/prescription` → `/exit/followup` → `/exit/done`

## Staff flows

- Doctor: `/doctor/dashboard`, `/doctor/queue`, `/doctor/case/:id`, `/doctor/transcript/:id`, `/doctor/timeline/:id`, `/doctor/summary`, `/doctor/documents`, `/doctor/workspace`, `/doctor/complete`, `/doctor/review/:id`, `/doctor/alerts`
- Triage/Nurse: `/triage/dashboard`, `/triage/queue`, `/triage/assessment/:id`, `/triage/vitals/:id`, `/triage/priority/:id`, `/triage/summary/:id`, `/triage/handoff/:id`, `/triage/history`, `/triage/alerts`
- Admin: `/admin/dashboard`, `/admin/opd`, `/admin/kiosks`, `/admin/staff`, `/admin/analytics`, `/admin/audit`, `/admin/settings`, `/admin/alerts`

## Design system

Clinical Direct (`Images/clinical_direct/DESIGN.md`): Deep navy `#0A2540`, Trust blue `#0284C7`, slate surfaces, P1 `#DC2626` / P2 `#D97706` / P3 `#059669` triage badges, Plus Jakarta Sans + Inter, 64px kiosk touch targets, 44px staff targets, 12/8/4px radii. Fully responsive (kiosk → tablet → mobile) + print-friendly slips.
