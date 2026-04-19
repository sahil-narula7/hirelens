# HireLens

HireLens is a resume review web app with secure Supabase authentication, PDF upload, resume preview, ATS-style scoring, and structured feedback.

## Live Demo

- https://hirelens7.netlify.app

## What It Does

- Sign up / sign in with Supabase Auth
- Upload PDF resumes
- Convert first PDF page to image preview using PDF.js
- Generate structured review feedback (overall score + ATS, tone, content, structure, skills)
- Save reviews locally in browser IndexedDB
- Browse past reviews from the dashboard

## Current Data Behavior

- Reviews are stored locally in the browser (IndexedDB)
- Reviews do not sync across devices or browsers
- Clearing browser site data removes saved reviews

## Tech Stack

- React 19
- React Router 7 (SPA mode)
- TypeScript
- Tailwind CSS v4
- Zustand
- Supabase JS
- PDF.js

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create `.env.local` with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

### 3. Run locally

```bash
npm run dev
```

### 4. Production build

```bash
npm run build
```

### 5. Optional local production serve

```bash
npm start
```

## Netlify Deployment

This project is configured for static SPA hosting.

### Required settings

- Build command: `npm run build`
- Publish directory: `build/client`

### Environment variables

Set these in Netlify Site Settings -> Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional (also supported by app fallback logic):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

After changing env vars, trigger a new deploy. Vite injects env vars at build time.

### Routing

The existing `netlify.toml` SPA redirect is already correct:

```toml
[build]
	command = "npm run build"
	publish = "build/client"

[[redirects]]
	from = "/*"
	to = "/index.html"
	status = 200
```

### Supabase Auth callback setup

In Supabase dashboard, add your Netlify domain to allowed redirect URLs.

## Notes

- App runs in SPA mode (`ssr: false`)
- Build is currently passing (`npm run build`)

## License

This project is proprietary and all rights are reserved.
