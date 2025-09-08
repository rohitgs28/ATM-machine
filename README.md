# ATM Demo Web App

A simple ATM-style app with a Next.js frontend and a FastAPI backend. Users authenticate using **token + PIN**. After login, they can view balance, deposit, or withdraw. The UI highlights the card network after login. This app simulates a PCI-friendly flow by requiring token + PIN.

---

## Tech Stack

- **Frontend**: Next.js (React, TypeScript), Chakra UI, TanStack Query, Zustand, Jest, React Testing Library  
- **Backend**: FastAPI, SQLAlchemy, Pydantic v2, Uvicorn, Alembic, PyTest  
- **Database**: PostgreSQL  

---

## Seed Data – Cards

Use the following token and PIN pairs to log in:

| Customer | Network    | Token              | PIN  |
|----------|------------|--------------------|------|
| Alex     | visa       | `TOK_VISA_1111`    | 1234 |
| Sam      | mastercard | `TOK_MC_2222`      | 4321 |
| Tony     | maestro    | `TOK_MAESTRO_3333` | 3333 |
| Bruce    | star       | `TOK_STAR_4444`    | 4444 |
| Clark    | pulse      | `TOK_PULSE_5555`   | 5555 |
| Diana    | plus       | `TOK_PLUS_6666`    | 6666 |

---

## Prerequisites

- Python 3.12  
- Node.js 20+  
- PostgreSQL 16 running locally  

---

## Database Setup

Create a local Postgres role and database named **db_atm** with password **atm**.

### macOS or Linux
```bash
createuser atm --pwprompt        # enter password: atm
createdb -O atm db_atm

# Or with psql:
psql -U postgres -c "CREATE USER atm WITH PASSWORD 'atm';"
psql -U postgres -c "CREATE DATABASE db_atm OWNER atm;"
```

### Windows (psql as superuser)
```sql
CREATE USER atm WITH PASSWORD 'atm';
CREATE DATABASE db_atm OWNER atm;
```

---

## Backend Setup (FastAPI)

Edit `.env` and set:
```bash
DATABASE_URL=postgresql://atm:atm@localhost:5432/db_atm
```
or Make sure the shared.env file is there in the backedn folder.

Create a virtual environment and install dependencies:

**macOS or Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Windows (PowerShell)**
```powershell
python3 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Create tables, seed demo data, and run the API:
```bash
python3 -m app.db.seeds
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**API base**: [http://localhost:8000](http://localhost:8000)

### Endpoints
- **POST** `/auth/pin`  
  Body: `{"pin": "1234", "cardToken": "TOK_..."}` -> sets HttpOnly session cookie  
- **POST** `/auth/logout`  
- **GET** `/account/balance`  
- **POST** `/account/deposit`  
- **POST** `/account/withdraw`  
- **GET** `/transactions?limit=N`  

---

## Frontend Setup (Next.js)

Make sure the .env.local file is present in the folder.
```bash
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

Production build:
```bash
npm run build
npm run start
```

---

## Usage

1. On the first screen, enter a **token** from the seed table.  
2. Enter the matching **PIN**.  
3. After login, use **Menu, Balance, Deposit, Withdraw, or Exit**.  

---

## Sessions & Money

- Sessions are stored server-side and delivered via HttpOnly cookie.  
- Money is stored as `DECIMAL(12,2)` and displayed with proper currency formatting.  

---

## Tests

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## Use **Google Chrome**, **Mozilla Firefox**, or **Safari** for best experience.

## Note on PCI

This app simulates a PCI-friendly flow by requiring **token + PIN**.  
A token is an opaque identifier that stands in for a real card number (PAN).
