# CueBase.online

**CueBase** is a personal knowledge base with document Q&A: users upload PDFs, the backend parses them into chunks, generates embeddings with **Google Gemini**, and stores text **encrypted at rest**. The frontend authenticates with **JWTs in HttpOnly cookies** and chats with an AI in **strict mode (documents only)** or **search mode (documents first, general knowledge when helpful)**. Production-oriented config references **`cuebase.online`**.

## Repository layout

| Path | Description |
|------|-------------|
| **`frontend/`** | **Next.js 15** + React 19 (App Router under `app/`). Main user-facing app: auth, dashboard, upload & query, marketing/legal pages. |
| **`B2/`** | **Express 5** backend (TypeScript + JavaScript), **MongoDB (Mongoose)**, default port **8000**. User, team, document, and AI query APIs. |
| **`B1/`** | **Vite 7** + React 19 SPA with similar screens (`AuthView`, `DashboardView`, `UploadPage`, `QueryPage`, etc.). Alternate or legacy frontend. |
| **Root `package.json`** | Dev dependencies only (e.g. TypeScript types). **No workspace root scripts**; install and run each package separately. |

## Features

- **Accounts**: Sign up, sign in, sign out; email verification (`/auth/verify`); forgot password and token-based reset (links use `MAIN_WEBSITE`).
- **Documents**: Upload **PDF** (size/type enforced in routes); chunk, embed, encrypt, and persist; list and delete.
- **Q&A**: Retrieval over indexed documents + **Gemini** answers; **SSE streaming** supported (frontend `queryDocumentsStream` parses `data: ...` lines).
- **Teams**: Create/delete teams, invites, accept/decline (`teamRoutes`).
- **Hardening**: Helmet, CORS (localhost + `cuebase.online`), HPP, path-specific **rate limiting**; cookie `sameSite` / `secure` tied to `NODE_ENV`.

Product copy: `frontend/content/ProductFeatures.md`.

## Tech stack

- **`frontend`**: Next.js 15, React 19, Axios, `react-markdown`, Vercel Analytics.
- **`B1`**: Vite, React 19, ESLint.
- **`B2`**: Express 5, Mongoose, JWT, bcrypt, Multer, **pdf2json**, **@google/genai**, Resend, content encryption helpers, etc.

## Prerequisites

- **Node.js** (match dependency majors; LTS recommended).
- **MongoDB** (URI matches `MONGODB_URI` in `B2`).
- **Google Gemini** API keys used as `GEMINI_API_KEY` (embeddings) and `GEMINI_3_KEY` (generation/chat) in code.

## Backend environment variables (`B2`)

**Required at startup** (`B2/index.ts` exits if any are missing):

- `MONGODB_URI` — MongoDB connection string
- `JWT_STRING` — JWT signing secret
- `JWT_EXPIRES` — JWT expiry (e.g. `7d`)
- `JWT_COOKIE_EXPIRES` — Cookie lifetime in days (used in ms calculation)
- `GEMINI_API_KEY` — Embeddings (e.g. `gemini-embedding-001`)
- `GEMINI_3_KEY` — Chat / generation

**Also used by the codebase** (configure for full behavior):

- `CONTENT_ENCRYPTION_KEY` — Base64-encoded **32-byte** key for chunk encryption (`middlewares/cryptoContent.js`)
- `RESEND_API` — Resend API key for transactional email (`middlewares/email.ts`)
- `EMAIL_FROM` — From address (optional; default exists)
- `MAIN_WEBSITE` — Base URL for links in emails (verify, reset password, etc., `authController.js`)
- `NODE_ENV` — `production` enables `secure` cookies and `sameSite: 'none'` where coded

> Note: `B2/.env.example` may list older names (`MONGODB_URL`, `JWT_SECRET`). Treat **`index.ts` validation** as the source of truth unless you update the example file.

## Local development

### Backend (`B2`)

```bash
cd B2
npm install
# Create .env with the variables above
npm run dev
# http://localhost:8000 — root responds with "CueBase running"
```

Production-style run:

```bash
npm run build
npm start
```

Ensure the **`uploads/`** directory exists and is writable (Multer disk storage in `documentRoutes`).

### frontend (`frontend`)

```bash
cd frontend
npm install
# Optional: .env.local
# NEXT_PUBLIC_API_BASE=http://localhost:8000/api
npm run dev
# http://localhost:3000
```

`app/lib/api.js` defaults `API_BASE` to `http://localhost:8000/api`, matching the `/api` mount on the server.

## API overview (`B2`)

- **`/api/users`** — Register, login, logout, `/me`, profile updates, password flows, public profile by username (`userRoutes.js`).
- **`/api/doc`** — `uploadDoc`, `queryDoc`, `deleteDoc`, `getDoc` (all behind `protect`).
- **`/api/team`** — Team CRUD and invites.
- **`/auth`** — e.g. `GET /auth/verify` for email verification.

A global limiter applies under **`/api`**; stricter limiters apply to login, register, forgot password, and reset password.

## Development notes

- Backend mixes **TS and JS**; imports often use `*.js` extensions—check whether the source is `.ts` or `.js`.
- There is **no single root command** to run API + UI; use two terminals for `B2` + `frontend` (or `B1`).
