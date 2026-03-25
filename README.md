# CIS-4004 MERN Event Board

A full-stack MERN application for managing and viewing events, with an admin side for moderation and management.

---

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Docker)

---

## Project Structure

```
cis-4004-mern/
  client/        # React frontend
  server/        # Express backend
  docker-compose.yml
```

---

## Prerequisites

- Node.js (v18+ recommended)
- Docker Desktop (running)

---

## First-Time Setup

### 1. Clone the repo
```
git clone https://github.com/GabrielGimenoAlberti/CIS4004TermProject.git
cd CIS4004TermProject
```

### 2. Install dependencies
```
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Create the environment file
Copy the example file:

**Mac/Linux**
```
cp server/.env.example server/.env
```

**Windows PowerShell**
```
Copy-Item server/.env.example server/.env
```

### 4. Start MongoDB
```
docker compose up -d
```

Mongo will run at:
```
mongodb://127.0.0.1:27017/cis4004mern
```

---

## Running the App

From the root:

```
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  

---

## Testing the Backend

Open in browser:

```
http://localhost:5000
```

You should see:

```
{ "message": "API is running" }
```

---

## Common Issues

**MongoDB connection error (ECONNREFUSED)**
- Make sure Docker is running
- Run:
```
docker compose up -d
```

**Ports already in use**
- Check if something else is using 5000 or 5173
- Restart terminal or change ports

**Changes not updating**
```
npm run dev
```

---

## Notes

- Do not commit `.env` files
- Backend config goes in `server/.env`
- Frontend env (if used) goes in `client/.env` and must use `VITE_` prefix