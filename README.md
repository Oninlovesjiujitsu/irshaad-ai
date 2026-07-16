

## Project Structure - Monorepo (Turborepo):

`
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
`