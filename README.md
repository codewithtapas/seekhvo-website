# Seekhvo AI Learning (`seekhvo.space`)

Production-ready EdTech & LMS platform built with **Next.js (App Router, TypeScript, Tailwind CSS, Three.js / React Three Fiber, GSAP ScrollTrigger, Framer Motion)** and **Django + Django REST Framework + PostgreSQL + Redis**.

---

## Architecture Overview

- `frontend/` — Next.js 15 App Router + TypeScript (strict mode) + procedural WebGL 3D concentric particle mandala & scroll-morphed neural cluster + Student/Instructor/Admin dashboards.
- `backend/` — Django 5.1 + DRF + SimpleJWT (refresh rotation & blacklist) + Argon2 password hashing + `drf-spectacular` OpenAPI/Swagger + ReportLab PDF & QR certificate generator + Payment Gateway Abstraction (`sandbox`, `razorpay`, `cashfree`) + S3/R2 storage support.
- `docker/` & `docker-compose.yml` — PostgreSQL 16, Redis 7, Django/Gunicorn, Next.js standalone server, and Nginx reverse proxy compatible with Cloudflare DNS/CDN.

---

## Local Development Setup

### 1. Environment Variables
Copy `.env.example` to `.env` in the repository root and customize secrets for production. By default in local development, `USE_SQLITE=True` and `PAYMENT_PROVIDER=sandbox` allow immediate testing without external keys.

### 2. Backend (Django + DRF)
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_seekhvo
python manage.py runserver 8000
```
- API Health: `http://localhost:8000/api/health/`
- Interactive Swagger API Docs: `http://localhost:8000/api/docs/`
- ReDoc API Docs: `http://localhost:8000/api/redoc/`

#### Development Test Accounts (seeded by `seed_seekhvo`)
- **Admin**: `admin@seekhvo.space` / `SeekhvoAdmin!2026`
- **Instructor**: `instructor@seekhvo.space` / `SeekhvoMentor!2026`
- **Student**: `student@seekhvo.space` / `SeekhvoStudent!2026`
- **Sample Certificate ID**: `SKV-2026-DEMO01`
- **Sample Dev Coupon**: `SEEKHVO10` (10% discount)

> **Note:** Change or remove seeded test accounts before deploying to production.

### 3. Frontend (Next.js)
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

---

## Automated Testing

### Backend Tests
```powershell
cd backend
.\.venv\Scripts\python.exe manage.py test apps.accounts
```

### Frontend Typecheck & Production Build
```powershell
cd frontend
npm run typecheck
npm run build
```

---

## Production Deployment (`seekhvo.space` + Cloudflare)

1. **Cloudflare DNS**:
   - Point `A` record `@` (`seekhvo.space`) and `CNAME` `www` to your server IP with **Proxied (Orange Cloud)** enabled.
   - Set SSL/TLS encryption mode to **Full (Strict)** (with Cloudflare Origin Certificate on Nginx or Caddy/Certbot).
   - Cache static Next.js assets (`/_next/static/*`); bypass cache for `/api/*` and `/dashboard/*`.
2. **Environment**:
   - Create `.env` from `.env.example` with:
     - `DJANGO_DEBUG=False`
     - Strong 50+ char `DJANGO_SECRET_KEY`
     - `USE_SQLITE=False` and strong `POSTGRES_PASSWORD`
     - `USE_S3_STORAGE=True` (Cloudflare R2 or AWS S3 credentials)
     - `PAYMENT_PROVIDER=razorpay` (or `cashfree`) with live keys & webhook secret
     - `EMAIL_PROVIDER=resend` or `smtp`
3. **Launch Stack**:
   ```bash
   docker compose up -d --build
   ```
4. **Verify**:
   - Visit `https://seekhvo.space` and `https://seekhvo.space/api/docs/`.

