# HireLens

HireLens is an AI-powered resume analyzer that helps candidates improve resumes with ATS-focused scoring, keyword alignment insights, and actionable recommendations.

## Project Links

- Live Demo : hirelens7.netlify.app

## Features

- PDF resume upload and preview
- ATS score and section-wise evaluation
- Feedback on tone, content, structure, and skills
- Actionable improvement suggestions
- Clean, responsive dashboard UI

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS v4
- Zustand
- PDF.js

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/sahil-narula7/hirelens.git
cd hirelens
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Run production server

```bash
npm start
```

## Deployment (Netlify)

For static deployment on Netlify:

1. Set `ssr: false` in `react-router.config.ts`.
2. Add a `netlify.toml` file in the project root with:

```toml
[build]
	command = "npm run build"
	publish = "build/client"

[[redirects]]
	from = "/*"
	to = "/index.html"
	status = 200
```

3. In Netlify site settings:
   - Build command: `npm run build`
   - Publish directory: `build/client`

## Docker

```bash
docker build -t hirelens .
docker run -p 3000:3000 hirelens
```

## License

This project is proprietary and all rights are reserved.
