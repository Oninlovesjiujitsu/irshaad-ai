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
- `Supabase` (Database & Authentication)
- `Node.js + Express` (Context API Server, Apache Tika service)
- `TypeScript`

## 🦄 Features

- **Real-Time AI Voice Coaching**: Interact with an AI guide seamlessly using LiveKit-powered voice agents equipped with Voice Activity Detection (VAD) and specialized coaching prompts.
- **Cross-Platform Ecosystem**: A unified Turborepo containing a dynamic Next.js Web Application and a React Native mobile application sharing utilities and database schemas.
- **Immersive Web Interface**: Premium, highly interactive web application built with modern design principles (glassmorphism, neon accents), dynamic canvas backgrounds, and 3D objects using React Three Fiber.
- **Intelligent Context Server**: A dedicated Node.js backend handling document parsing (via Apache Tika) to construct rich contextual memory for the AI coach.
- **Secure Authentication**: End-to-end authentication flow powered by Supabase Auth with custom-designed, fully responsive authentication widgets.

## 👩🏽‍🍳 The Process

Irshaad AI was built to provide accessible, intelligent, and highly responsive real-time coaching across both web and mobile platforms. 

**Stack choice:** The project uses a **Turborepo** monorepo structure to share code seamlessly between the Next.js web frontend, the React Native mobile app, and the backend microservices. **Supabase** acts as the unified data layer for authentication and robust PostgreSQL storage.

**The Architecture:**
- **Web App**: Built with Next.js App Router, styled with Tailwind CSS, and enriched with `framer-motion` and `three.js` to create an engaging, premium user experience.
- **Agent Worker**: A dedicated LiveKit worker running custom agent logic (`coach.ts`) that listens to user audio, processes conversational context, and responds in real-time.
- **API Server**: An Express server handling heavy context-processing tasks, including file ingestion and document parsing via Apache Tika.
- **Shared Packages**: Shared configurations (ESLint, TSConfig), UI components, database types, and utility functions live in the `packages/` directory, ensuring strict typing and reusability across all apps.
## 🚀 Running the Agent Worker Locally (Recommended)

Due to strict CPU limits (0.1 vCPU) and aggressive health-check timeouts on free cloud tiers (like Render or Hugging Face Spaces), the deployed agent may occasionally experience cold-start delays or forceful restarts when initializing the heavy WebRTC and Gemini WebSocket connections.

For the best, zero-latency experience, we highly recommend running the `agent-worker` on your local machine. Because LiveKit acts as a central cloud router, your local worker will seamlessly pick up jobs from the production website!

**Steps to run locally:**
1. Clone the repository: `git clone https://github.com/Oninlovesjiujitsu/irshaad-ai.git`
2. Install dependencies (from the monorepo root): `pnpm install`
3. Configure your `.env` file in `apps/agent-worker/.env` with your `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and `GEMINI_API_KEY`.
4. Start the worker: 
   ```bash
   pnpm --filter @irshaad/agent-worker dev
   ```
5. Go to the deployed production website and start an interview. The audio will stream directly to your local machine!

## 💭 How can it be improved?

- **Dedicated Infrastructure**: Migrate the background worker to a VPS or container host (like Fly.io or Koyeb) with dedicated CPU cores to bypass the CPU throttling and health-check restarts experienced on Render's free tier.
- **Geographic Routing Optimization**: Dynamically spin up worker nodes in the closest region to the user (e.g., Singapore, Oregon, Frankfurt) to minimize the network path of the real-time audio streams.
- **Persistent AI Memory**: Integrate a vector database (like Supabase pgvector) to store and recall feedback from previous sessions, allowing the AI to track user progress across multiple interviews.
- **Advanced RAG (Retrieval-Augmented Generation)**: Implement dynamic context loading within the API server to feed company-specific documentation, wikis, or target job postings directly into the coach prompt.
- **Visual Analytics Dashboard**: Build interactive progress tracking dashboards (e.g., using Recharts) to map the user's improvement in score, speech pacing, and feedback trends.
- **Comprehensive E2E Testing**: Set up automated end-to-end testing utilizing Playwright for the Next.js web application and Detox for the React Native mobile client.


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
│   │   ├── src/              # Routes, Tika service, session management (Flattened)
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