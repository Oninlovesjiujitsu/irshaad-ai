# 📜 Irshaad AI

Irshaad comes from the Arabic root word (r-sh-d) which relates to guidance, direction, and instruction. An advanced AI coaching and guidance platform featuring real-time voice interactions, immersive 3D web interfaces, and contextual knowledge processing.

> **Irshaad** (Arabic: إرشاد) — "guidance / instruction."

## 📦 Technologies

- `Next.js 16` (App Router)
- `React Native / Expo` (Mobile App)
- `Turborepo` (Monorepo architecture)
- `LiveKit` (Real-time Voice Agent Worker & WebRTC)
- `Tailwind CSS` + `Framer Motion` + `Reactbits`
- `Three.js` / `React Three Fiber` (3D web interactions)
- `Supabase` (Database, Authentication, Webhooks)
- `Node.js + Express` (Context API Server, Apache Tika service)
- `TypeScript`

## 🦄 Features

- **Real-Time AI Voice Coaching**: Interact with an AI guide seamlessly using LiveKit-powered voice agents equipped with Voice Activity Detection (VAD) and specialized coaching prompts.
- **Cross-Platform Ecosystem**: A unified Turborepo containing a dynamic Next.js Web Application and a React Native mobile application sharing utilities and database schemas.
- **Immersive Web Interface**: Premium, highly interactive web application built with modern design principles (glassmorphism, neon accents), dynamic canvas backgrounds, and 3D objects using React Three Fiber.
- **Intelligent Context Server**: A dedicated Node.js backend handling document parsing (via Apache Tika) and Supabase webhooks to construct rich contextual memory for the AI coach.
- **Secure Authentication**: End-to-end authentication flow powered by Supabase Auth with custom-designed, fully responsive authentication widgets.

## 👩🏽‍🍳 The Process

Irshaad AI was built to provide accessible, intelligent, and highly responsive real-time coaching across both web and mobile platforms. 

**Stack choice:** The project uses a **Turborepo** monorepo structure to share code seamlessly between the Next.js web frontend, the React Native mobile app, and the backend microservices. **Supabase** acts as the unified data layer for authentication and robust PostgreSQL storage.

**The Architecture:**
- **Web App**: Built with Next.js App Router, styled with Tailwind CSS, and enriched with `framer-motion` and `three.js` to create an engaging, premium user experience.
- **Agent Worker**: A dedicated LiveKit worker running custom agent logic (`coach.ts`) that listens to user audio, processes conversational context, and responds in real-time.
- **API Server**: An Express server handling heavy context-processing tasks, including file ingestion via Apache Tika and responding to database event hooks.
- **Shared Packages**: Shared configurations (ESLint, TSConfig), UI components, database types, and utility functions live in the `packages/` directory, ensuring strict typing and reusability across all apps.

## 💭 How can it be improved?

- Implement advanced RAG (Retrieval-Augmented Generation) within the API server for deeper, personalized coaching context.
- Expand 3D web features with interactive data visualizations of the user's coaching progress.
- Migrate context processing to Edge Functions where possible to reduce latency.
- Add support for multilingual processing in the LiveKit voice agent worker.
- Add comprehensive e2e testing (Playwright/Detox) across the Turborepo workspaces.

## Project Structure - Monorepo (Turborepo):

```
irshaad-ai/
├── apps/
│   ├── web/                  # Next.js Web Application
│   │   ├── src/app/          
│   │   └── package.json
│   ├── mobile/               # React Native (Expo) Application
│   │   ├── src/              
│   │   └── package.json
│   ├── api-server/           # Node.js + Express Context Server
│   │   ├── src/              # Routes, Tika service, Supabase hooks (Flattened)
│   │   └── package.json
│   └── agent-worker/         # LiveKit Voice Agent Worker
│       ├── src/              # coach.ts, prompt.ts, VAD settings (Flattened)
│       └── package.json
├── packages/
│   ├── database/             # Shared Supabase/Firebase client & generated types
│   ├── shared-types/         # Interfaces (SessionContext, etc.)
│   ├── utils/                # NEW: Shared helper functions and Zod schemas
│   ├── tsconfig/             
│   └── eslint-config/        
├── turbo.json
└── package.json
```