# AI Control Studio — Project Map

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 24.15.0 |
| Monorepo | Turborepo | 2.5.0 |
| Web | Next.js | 16.2.6 |
| API | Hono | 4.12.18 |
| Database | SQLite (dev) / PostgreSQL (prod) | — |
| ORM | Prisma | 6.5.0 |
| Realtime | Socket.IO | 4.8.3 |
| Auth | JWT (jsonwebtoken + bcryptjs) | — |
| Validation | Zod | 4.4.3 |
| UI | Tailwind CSS | 4.3.0 |
| Icons | Lucide React | 1.14.0 |

## Architecture
```
ai-control-studio/
├── apps/
│   ├── web/          # Next.js 16 (App Router, RSC)
│   └── api/          # Hono 4 (HTTP + WebSocket)
├── packages/
│   └── shared/       # Shared types, schemas, constants
├── turbo.json
├── package.json
└── PROJECT_MAP.md
```

## Database Models (SQLite)
- **User** — Owner account (role: "owner")
- **Session** — JWT session tracking
- **Project** — Projects with slug-based uniqueness
- **AiProvider** — Encrypted API keys per provider
- **Task** — Execution tasks with status/progress tracking
- **Command** — User commands linked to tasks
- **Log** — Structured activity logs
- **AiMemory** — Persistent key-value memory per user/project

## Security
- JWT authentication with Bearer tokens
- AES-256-GCM API key encryption
- Rate limiting (100 req/min)
- Zod validation on all inputs
- Owner-only permission system
- CORS whitelist

## System Flows
```
1. Auth → Login/Register → JWT
2. Dashboard → Stats overview
3. Command Input → Task Creation → Execution → Result
4. Projects → CRUD + linked tasks
5. AI Providers → Encrypted storage → Test connection
6. Memory → Save/retrieve context
7. Logs → Activity tracking with filters
8. Realtime → Socket.IO for live updates
```

## Modules
| Module | Status |
|--------|--------|
| Project Scaffold | ✅ Done |
| Auth System | ✅ Done |
| Landing Page | ✅ Done |
| Dashboard & Overview | ✅ Done |
| Projects CRUD | ✅ Done |
| AI Providers | ✅ Done |
| AI Command Center | ✅ Done |
| Tasks & Execution | ✅ Done |
| AI Memory | ✅ Done |
| Logs & Monitoring | ✅ Done |
| WebSocket (Socket.IO) | ✅ Done |
| Settings Page | ✅ Done |
| Multi-Agent AI System | ✅ Done |

### Agents
| Agent | Role | Status |
|-------|------|--------|
| 🧠 Orchestrator | توزيع المهام وتنسيقها | ✅ |
| 🔍 Analyzer | تحليل الأخطاء وتشخيصها | ✅ |
| ⚙️ Backend | مراجعة API وتحسين الأداء | ✅ |
| 🎨 Frontend | تحسين واجهة المستخدم | ✅ |
| 🔌 Integration | ربط الخدمات والتكامل | ✅ |
| 🧾 Logger | تسجيل وتحليل العمليات | ✅ |
| 🚀 Performance | تحسين السرعة و caching | ✅ |

## New Files (Surgical Addition)
| File | Purpose |
|------|---------|
| `apps/api/src/services/agents/types.ts` | Agent service types |
| `apps/api/src/services/agents/orchestrator.ts` | Orchestrator agent |
| `apps/api/src/services/agents/analyzer.ts` | Analyzer agent |
| `apps/api/src/services/agents/backend.ts` | Backend agent |
| `apps/api/src/services/agents/frontend.ts` | Frontend agent |
| `apps/api/src/services/agents/integration.ts` | Integration agent |
| `apps/api/src/services/agents/logger-debug.ts` | Logger agent |
| `apps/api/src/services/agents/performance.ts` | Performance agent |
| `apps/api/src/services/agents/index.ts` | Agent orchestrator + export |
| `apps/api/src/routes/agents.ts` | Agents API route |
| `apps/web/app/dashboard/agents/page.tsx` | Agents dashboard page |

## Modified Files (Surgical Edit)
| File | Change |
|------|--------|
| `apps/api/src/routes/commands.ts` | Uses Orchestrator instead of mock |
| `apps/api/src/routes/index.ts` | Added agents export |
| `apps/api/src/index.ts` | Registered /api/agents route |
| `apps/web/components/dashboard/Sidebar.tsx` | Added Agents link |
| `apps/web/app/dashboard/console/page.tsx` | Shows agent analysis results |
| `packages/shared/src/types/index.ts` | Added AgentName, AgentResult, AgentTask |
| `packages/shared/src/constants/index.ts` | Added AGENTS, AGENT_LIST |

## Orphans & Pending
- [ ] Real AI provider integration for agents (currently pattern-based)
- [ ] Log retention auto-cleanup cron job
- [ ] Session cleanup cron job
- [ ] Error boundary components
- [ ] Loading skeletons
- [ ] Responsive testing
- [ ] E2E integration tests
- [ ] PostgreSQL migration script
- [ ] Docker setup

## API Endpoints
| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/auth/me | Yes |
| GET | /api/projects | Yes |
| POST | /api/projects | Yes |
| PATCH | /api/projects/:id | Yes |
| DELETE | /api/projects/:id | Yes |
| POST | /api/commands | Yes |
| GET | /api/commands | Yes |
| GET | /api/tasks | Yes |
| POST | /api/tasks/:id/cancel | Yes |
| POST | /api/tasks/:id/retry | Yes |
| GET | /api/providers | Yes |
| POST | /api/providers | Yes |
| DELETE | /api/providers/:id | Yes |
| POST | /api/providers/:id/test | Yes |
| GET | /api/memory | Yes |
| POST | /api/memory | Yes |
| DELETE | /api/memory/:id | Yes |
| GET | /api/logs | Yes |
| GET | /api/stats/overview | Yes |
| GET | /health | No |

## WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| task:update | Server→Client | Task progress update |
| user:* | Server→Client | User-specific events |
| subscribe:project | Client→Server | Join project room |
| unsubscribe:project | Client→Server | Leave project room |
