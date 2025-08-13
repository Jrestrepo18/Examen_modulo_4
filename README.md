# Clinic CRUD (Node.js + PostgreSQL + Vanilla JS)

A simple full-stack clinic management app with authentication. It includes CRUD for patients, doctors, appointments (with joins to show patient/doctor names), and diagnosis, plus a small front-end in plain HTML/JS/Bootstrap.

## Table of contents

- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Project structure](#project-structure)  
- [Prerequisites](#prerequisites)  
- [Environment & configuration](#environment--configuration)  
- [Database setup](#database-setup)  
- [Running the app](#running-the-app)  
  - [Start the backend](#start-the-backend)  
  - [Open the frontend](#open-the-frontend)  
- [Authentication](#authentication)  
- [API reference](#api-reference)  
  - [Auth](#auth)  
  - [Patients](#patients)  
  - [Doctors](#doctors)  
  - [Appointments](#appointments)  
  - [Diagnosis](#diagnosis)  
- [Postman usage](#postman-usage)  
- [Front-end pages](#front-end-pages)  
- [Notes & tips](#notes--tips)  

---

## Features

- Register & login with hashed passwords (bcrypt) and JWT sessions  
- CRUD for:
  - Patients
  - Doctors
  - Appointments (lists include patient and doctor names)
  - Diagnosis (linked to an appointment)
- Clean front-end in plain HTML + Bootstrap, using `fetch` to talk to the API
- CORS enabled

## Tech stack

- **Backend:** Node.js, Express, `pg`, `bcrypt`, `jsonwebtoken`, CORS  
- **Database:** PostgreSQL  
- **Frontend:** HTML, CSS, Bootstrap 5, vanilla JS (no build step)

## Project structure

```
proyecto_db/
├─ back-end/
│  ├─ app.js                  # Express app (routes + DB)
│  └─ package.json
├─ front-end/
│  ├─ home.html               # Main UI (tabs)
│  ├─ login.html              # Auth: login
│  ├─ register.html           # Auth: register
│  ├─ createPatient.html
│  ├─ createDoctor.html
│  ├─ createAppointment.html
│  ├─ createDiagnosis.html
│  ├─ css/
│  │  └─ style.css
│  └─ js/
│     ├─ config.js            # APP_URL base
│     ├─ auth.js              # login/register logic
│     ├─ scriptsPatients.js
│     ├─ scriptsDoctors.js
│     ├─ scriptsAppointments.js
│     └─ scriptsDiagnosis.js
└─ data/
   └─ db.sql                  # SQL schema & seed (edit to your needs)
```

## Prerequisites

- Node.js 18+  
- PostgreSQL 13+  
- (Optional) A static server / VS Code Live Server to open the front-end

## Environment & configuration

The backend currently uses hardcoded DB credentials in `back-end/app.js`. You *should* move these to environment variables for production:

- `PGUSER`
- `PGHOST`
- `PGDATABASE`
- `PGPASSWORD`
- `PGPORT`
- `JWT_SECRET` (defaults to `super-secretito-cambia-esto`, change it!)

In `front-end/js/config.js`, set your API base:

```js
// front-end/js/config.js
const APP_URL = 'http://localhost:3000';
```

## Database setup

1. Create your PostgreSQL database:

```sql
CREATE DATABASE clinicdb;
```

2. Run the SQL script (adjust file path):

```bash
psql -U <your_user> -d clinicdb -f data/db.sql
```

> The script creates tables for `users`, `patients`, `doctors`, `appointments`, and `diagnosis`.  
> If you see an error like “syntax error near …” check for stray characters or comments in `db.sql` and run sections step-by-step.

3. Update DB credentials in `back-end/app.js` or via env vars.

## Running the app

### Start the backend

```bash
cd back-end
npm install
node app.js
# Server running at http://localhost:3000
```

### Open the frontend

Open the HTML files directly with a static server (recommended):

- Use VS Code Live Server, or
- Any static file server from `front-end/`:

```bash
# example with http-server (npm i -g http-server)
cd front-end
http-server -p 5500
# then open http://127.0.0.1:5500/front-end/home.html
```

## Authentication

- JWT-based
- Passwords stored hashed with `bcrypt`
- Token returned on login; store it in `localStorage` and send it as `Authorization: Bearer <token>` for protected endpoints (if you add middleware).

**Routes:**
- `POST /auth/register` – create account
- `POST /auth/login` – get token

Front-end code in `front-end/js/auth.js` already sends/uses the token.

## API reference

Base URL: `http://localhost:3000`

### Auth

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
**200 OK**
```
{ "message": "User registered" }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```
**200 OK**
```
{ "token": "<JWT>", "user": { "id": 1, "email": "john@example.com" } }
```

> Send `Authorization: Bearer <JWT>` if you add protected routes with the `authRequired` middleware.

---

### Patients

#### List
```
GET /patients
```
**200 OK**
```
{ "rows": [ { "id": 1, "name": "...", "email": "...", "phone": "...", "city": "..." }, ... ] }
```

#### Get by id
```
GET /patients/:id
```
**200 OK**
```
[ { "id": 1, "name": "...", "email": "...", "phone": "...", "city": "..." } ]
```

#### Create
```
POST /patients
Content-Type: application/json

{ "name": "Alice", "email": "a@ex.com", "phone": "123", "city": "Lima" }
```
**201 Created**
```
{ "id": 42, "name": "...", "email": "...", "phone": "...", "city": "..." }
```

#### Update
```
PUT /patients/:id
Content-Type: application/json

{ "name": "Alice 2", "email": "a2@ex.com", "phone": "999", "city": "Cusco" }
```
**200 OK**
```
{ "message": "Paciente actualizado" }
```

#### Delete
```
DELETE /patients/:id
```
**200 OK**
```
{ "mensaje": "Paciente eliminado" }
```

---

### Doctors

Same pattern as patients.

- `GET /doctors`
- `GET /doctors/:id`
- `POST /doctors` – `{ "name": "...", "specialty": "..." }`
- `PUT /doctors/:id`
- `DELETE /doctors/:id`

---

### Appointments

#### List (joined with names)
```
GET /appointments
```
**200 OK**
```
[
  {
    "id": 7,
    "appointment_datetime": "2025-02-14 09:00:00",
    "patient_name": "Alice",
    "doctor_name": "Dr. Bob",
    "status": "Programada",
    "payment_method": "Efectivo",
    "location": "Room 2"
  },
  ...
]
```

#### Get by id
```
GET /appointments/:id
```
**200 OK**
```
[ { "id": 7, "location": "...", "appointment_datetime": "...", "status": "...", "payment_method": "...", "doctor_id": 3, "patient_id": 1 } ]
```

#### Create
```
POST /appointments
Content-Type: application/json

{
  "location": "Room 2",
  "appointment_datetime": "2025-02-14 09:00:00",
  "status": "Programada",
  "payment_method": "Efectivo",
  "doctor_id": 3,
  "patient_id": 1
}
```

#### Update
```
PUT /appointments/:id
Content-Type: application/json

{
  "location": "Room 5",
  "appointment_datetime": "2025-02-14 10:00:00",
  "status": "Reprogramada",
  "payment_method": "Tarjeta",
  "doctor_id": 4,
  "patient_id": 1
}
```

#### Delete
```
DELETE /appointments/:id
```

---

### Diagnosis

Each diagnosis belongs to an appointment (`appointment_id`).

#### List (joined)
```
GET /diagnosis
```
**200 OK**
```
[
  {
    "id": 10,
    "appointment_id": 7,
    "diagnosis": "Flu",
    "treatment": "Rest",
    "appointment_datetime": "2025-02-14 09:00:00",
    "patient_name": "Alice",
    "doctor_name": "Dr. Bob"
  },
  ...
]
```

#### Get by id
```
GET /diagnosis/:id
```
**200 OK**
```
[ { "id": 10, "appointment_id": 7, "diagnosis": "...", "treatment": "..." } ]
```

#### Create
```
POST /diagnosis
Content-Type: application/json

{
  "appointment_id": 7,
  "diagnosis": "Flu",
  "treatment": "Rest"
}
```

#### Update
```
PUT /diagnosis/:id
Content-Type: application/json

{
  "appointment_id": 8,
  "diagnosis": "Cold",
  "treatment": "Hydration"
}
```

#### Delete
```
DELETE /diagnosis/:id
```

## Postman usage

1. Create a new **Environment** with:
   - `baseUrl` = `http://localhost:3000`
   - `token` = *(set after login)*

2. Create a **Pre-request Script** (optional) to auto-insert the token:
   ```js
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

3. Typical flow:
   - `POST {{baseUrl}}/auth/register`
   - `POST {{baseUrl}}/auth/login` → copy `"token"` to env var `token`
   - CRUD requests:
     - `GET {{baseUrl}}/patients`
     - `POST {{baseUrl}}/patients` (etc.)
     - Same for doctors, appointments, diagnosis

4. Sample cURL:
   ```bash
   curl -X POST {{baseUrl}}/patients      -H "Content-Type: application/json"      -H "Authorization: Bearer {{token}}"      -d '{"name":"Alice","email":"a@ex.com","phone":"123","city":"Lima"}'
   ```

## Front-end pages

- `home.html` – lists and modals for editing Patients, Doctors, Appointments, Diagnosis  
- `createPatient.html`, `createDoctor.html`, `createAppointment.html`, `createDiagnosis.html` – simple create forms  
- `login.html` & `register.html` – auth UI (see `front-end/js/auth.js`)  

Front-end uses:
- `front-end/js/config.js` for `APP_URL`
- `front-end/js/scripts*.js` files for each module

## Notes & tips

- If you see **MIME type** or **404** errors when loading `js/…` files, check the script path and that you’re serving files from the correct folder (not opening the HTML via `file:///`).
- For `datetime-local` inputs, the frontend converts to `"YYYY-MM-DD HH:mm:ss"` for PostgreSQL.  
- If your `GET /patients/:id` returns an **array**, access `[0]` in the UI (already handled in your scripts).
- **CORS** is enabled in the backend; change allowed origins if deploying.
- Always change `JWT_SECRET` in production.
