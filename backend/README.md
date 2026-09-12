# MediKiosk Backend

Express + Mongoose API for the MediKiosk hospital clinical-intake platform.
Works with MongoDB when available, otherwise falls back to an in-memory demo store.

## Run

```bash
npm install
npm run dev     # http://localhost:5000
```

## Demo staff logins

| Staff ID | Password | Role |
|---|---|---|
| DOC-104 | doctor123 | doctor |
| NUR-88421 | nurse123 | nurse |
| ADM-01 | admin123 | admin |

## Endpoints

- `GET /api/health`
- `POST /api/login` { staffId, password }
- `GET/POST /api/patients`
- `GET/POST /api/tokens`, `PATCH /api/tokens/:id`
- `GET/POST /api/intakes`
- `GET/POST /api/documents`
- `GET/POST /api/consultations`
- `GET/POST /api/alerts`, `PATCH /api/alerts/:id`
- `GET /api/kiosks`, `GET /api/staff`, `GET /api/analytics`
