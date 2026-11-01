# Sygnals
Monorepo for Sygnals – Angular web app and .NET Core API

Sygnals is a real-time one-to-one chat application that randomly connects users for instant conversations, built using a modern monorepo architecture. 
It uses Angular for the web UI and ASP.NET Core with SignalR for real-time messaging.

---

## 🚀 Live Demo

- **Web App (Vercel)**  
  https://connecto-web.vercel.app/

---

## 🏗️ Architecture Overview

- **Frontend**: Angular (SPA with hydration support)
- **Backend**: ASP.NET Core (.NET 8) with SignalR (Hub-only, no controllers)
- **Repo Type**: Monorepo
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Koyeb (free Hobby plan)
- **Communication**: WebSockets via SignalR

---
## 🔧 Tech Stack

### Frontend
- Angular
- SignalR Client
- TypeScript
- Deployed on Vercel

### Backend
- ASP.NET Core (.NET 8)
- SignalR
- Docker
- Deployed on Koyeb

---

## ☁️ Deploying the backend (Koyeb, free)

The API image is built from `src/api/Sygnals.Api/Dockerfile`. It listens on port **8080** and answers `GET /healthz`.

1. Sign up at koyeb.com with GitHub. The Hobby plan includes one free web service.
2. Choose **Create Web Service**, then **GitHub**, then pick this repo and the `main` branch.
3. Set the builder to **Dockerfile**, with work directory `src/api/Sygnals.Api` and Dockerfile location `Dockerfile`.
4. Set the instance to **Free**, and pick the region closest to your users.
5. Port: `8080`, HTTP, public path `/`. Health check: HTTP `/healthz` on port 8080.
6. Optional: add environment variables `Cors__AllowedOrigins__0`, `Cors__AllowedOrigins__1` and so on to replace the allowed frontend origins. The defaults are `http://localhost:4200` and `https://sygnals-web.vercel.app`.
7. Deploy, then copy the service URL (`https://<name>.koyeb.app`) into `apiBaseUrl` in `src/web/Connecto-web/src/app/environments/environment.dev.ts`. Push that change and Vercel redeploys the frontend.

The free instance sleeps when idle and wakes on the next request. The landing page drops its live "online now" connection when the tab is hidden for 30 seconds or idle for 5 minutes, and reconnects on return. That way, a forgotten tab can't keep the backend awake.

---
