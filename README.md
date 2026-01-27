<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1buegOzm_7TgLfoby1Bgh4EqkkMZ8ONcn

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Database (Supabase Postgres) + Vercel Roadmap

This project’s serverless API uses `process.env.DATABASE_URL` (see `api/_lib/db.ts`) to connect to Postgres.

### 1) Create a Supabase project

1. Create a project in Supabase.
2. Go to:
   Project Settings
   Database
   Connection string
3. Copy the **Postgres connection string** (URI). It looks like:

   `postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require`

Important:
- Do **not** use the Supabase project URL (`https://<ref>.supabase.co`) as `DATABASE_URL`.
- Do **not** use the “publishable/anon key” for server SQL connections.

### 2) Configure Vercel environment variables

In Vercel:

1. Go to:
   Project
   Settings
   Environment Variables
2. Add:

   `DATABASE_URL` = your Supabase Postgres connection string

3. Apply it to:
- Production
- Preview
- Development (optional, if you use Vercel’s dev environment)

### 3) Deploy / redeploy

After setting `DATABASE_URL`, trigger a new deployment (Redeploy) so Vercel picks up the new env var.

### 4) Verify DB connectivity

Once deployed, test the health endpoint:

- `GET /api/health`

Expected response:
- `ok: true`
- `db: true`

If `db` is false:
- Double-check the `DATABASE_URL` value in Vercel.
- Make sure the connection string includes `sslmode=require`.

### 5) Initialize tables

This repo includes an init endpoint that creates required tables:

- `POST /api/db/init`

If you already have tables, it should be safe to run again (uses `IF NOT EXISTS`).

### 6) Common deployment gotchas

- If your local `.env` works but Vercel fails, it’s almost always missing/incorrect `DATABASE_URL` in Vercel env vars.
- If you rotate your Supabase DB password, update the connection string in Vercel and redeploy.
