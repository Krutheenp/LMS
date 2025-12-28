# Copilot Instructions for LMS Project

## Project Overview
This is a **Learning Management System (LMS)** for managing activities and member progress. It tracks 600+ members through activity submissions, badges, and progression levels (BEGINNER → ADVANCED → EXPERT).

**Tech Stack**: Next.js 14 + TypeScript + Prisma + SQLite + Tailwind CSS

---

## Architecture Essentials

### Core Data Model (5 entities)
All relationships cascade on delete. Key patterns:

- **User**: Roles (MEMBER | ADMIN), tracks totalScore and level (BEGINNER → EXPERT)
- **Activity**: Time-bounded tasks with maxScore and gradeLevel (A-F). Relations: submissions, badges, progress
- **Submission**: Tracks task completion (NOT_STARTED → SUBMITTED → APPROVED/REJECTED). Stores files as JSON string
- **Badge**: Earned when activity completed; userId+activityId unique constraint
- **ActivityProgress**: Completion percentage tracking (0-100)

**Location**: [prisma/schema.prisma](prisma/schema.prisma)

### Service Layer Architecture
Services encapsulate all database logic, separated from components/routes.

```typescript
// Pattern: Pure functions returning Promise<T>
export const activityService = {
  async getAll(page, limit) { /* pagination logic */ },
  async getById(id) { /* include relations */ },
  async create(data) { /* validation + insert */ },
}
```

**Location**: [src/services/index.ts](src/services/index.ts) - centralizes activityService, userService, submissionService

### API Response Pattern
All endpoints return consistent shape:

```json
{ "success": boolean, "data": T, "total"?: number, "error"?: string }
```

**Location**: [src/app/api/activities/route.ts](src/app/api/activities/route.ts) - exemplar GET/POST pattern

---

## Key Patterns & Conventions

### 1. **Import Path Aliases**
Always use `@/` for absolute imports:
```typescript
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { activityService } from '@/services'
```

### 2. **Component Structure**
- **UI Components** (`components/ui/`): Pure, reusable (Button, Card). Use `cn()` from utils for class merging
- **Feature Components** (`components/features/`): Business logic, use hooks for data. Prefix with feature: `activity-card.tsx`, `badge-grid.tsx`
- **Client vs Server**: Mark client components with `'use client'`

Example pattern:
```typescript
'use client'
import { Button } from '@/components/ui/button'

export const ActivityCard = ({ activity, onSubmit }) => {
  return <Card><Button onClick={onSubmit}>Submit</Button></Card>
}
```

### 3. **Hook Conventions**
Hooks are in [src/hooks/](src/hooks/) and follow React Query/fetch patterns:

```typescript
// Pattern: State + callback + return object
export function useActivities(options = {}) {
  const [activities, setActivities] = useState([])
  const fetchActivities = useCallback(async () => { /* fetch logic */ }, [])
  return { activities, loading, error, fetchActivities }
}
```

### 4. **Route Protection (Middleware)**
Token-based auth via cookies. Routes protected by [src/middleware.ts](src/middleware.ts):
- `/activities`, `/profile`, `/`: Require token (redirect → /login)
- `/admin/*`: Require token (role check needed)
- `/login`, `/register`: Redirect to `/` if token exists

No JWT decoding yet—add role verification in middleware when implementing admin gates.

### 5. **Pagination Pattern**
Standard across API: `?page=1&limit=10`. Skip-based (offset):
```typescript
const skip = (page - 1) * limit
const [activities, total] = await Promise.all([
  prisma.activity.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
  prisma.activity.count(),
])
```

---

## Development Workflows

### Setup & Database
```bash
npm install                    # Install deps
npm run prisma:generate       # Generate Prisma client (run after schema changes)
npm run prisma:migrate        # Create/apply migrations
npm run prisma:seed          # Populate seed data (seed.ts)
```

**Database**: SQLite at `prisma/dev.db` (local development only)

### Running
```bash
npm run dev                   # Start dev server (http://localhost:3000)
npm run build && npm start    # Production build/start
npm run lint                  # Run ESLint
npm run prisma:studio        # Open Prisma Studio (visual DB explorer)
```

### Prisma Workflow
1. Edit [prisma/schema.prisma](prisma/schema.prisma)
2. Run `npm run prisma:migrate` (creates migration file + applies)
3. Run `npm run prisma:generate` (regenerates types)
4. Restart dev server to reload types

---

## Common Tasks

### Adding a New API Endpoint
1. Create file: `src/app/api/{feature}/route.ts`
2. Implement GET/POST/PUT handlers following response pattern
3. Use service layer: `activityService.getAll()`
4. Return `NextResponse.json({ success: bool, data: T })`

Example: See [src/app/api/activities/route.ts](src/app/api/activities/route.ts)

### Creating a Feature Component
1. `src/components/features/{feature}/{name}.tsx` with `'use client'`
2. Use hook for data: `const { activities } = useActivities()`
3. Compose UI components from `@/components/ui/`
4. Export component, not default

### Querying Data in Components
```typescript
'use client'
import { useActivities } from '@/hooks/use-activities'

export function ActivityList() {
  const { activities, loading } = useActivities()
  useEffect(() => { fetchActivities() }, [])
  return activities.map(a => <ActivityCard key={a.id} activity={a} />)
}
```

### File Upload Handling
Submissions store files as JSON string in DB:
```typescript
const fileUrls = JSON.stringify(files.map(f => f.url))
await prisma.submission.create({ data: { fileUrls, ... } })
// Later: JSON.parse(submission.fileUrls) to retrieve
```

---

## Important Gotchas & Decision Points

1. **SQLite for Dev**: Great for local iteration, but migrations are `.sql` files in `prisma/migrations/`. No schema.sql auto-sync.
2. **No JWT Decoding Yet**: Middleware only checks token existence. Add role verification for admin gates.
3. **File URLs as JSON Strings**: Due to SQLite limitation, parsed on retrieval. Safe but requires `JSON.parse()`
4. **Cascade Deletes**: All relations cascade, so deleting User/Activity cascades to submissions/badges.
5. **Pagination Required**: Always include limit/skip for large queries to prevent memory issues.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| [prisma/schema.prisma](prisma/schema.prisma) | Data model & relationships |
| [src/services/index.ts](src/services/index.ts) | Business logic layer |
| [src/middleware.ts](src/middleware.ts) | Route protection & auth |
| [src/hooks/use-activities.ts](src/hooks/use-activities.ts) | Data-fetching hook pattern |
| [src/app/api/activities/route.ts](src/app/api/activities/route.ts) | API endpoint exemplar |
| [src/lib/utils.ts](src/lib/utils.ts) | Utility functions (cn, etc.) |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Extended architecture docs |

---

## Questions to Ask Before Implementing

- **New entity or relation?** Update schema → migrate → regenerate types
- **Admin-only feature?** Add role check in middleware (currently missing)
- **Large data set?** Implement pagination via service layer
- **File storage?** Verify upload route exists; store URLs as JSON string in Submission.fileUrls
- **Cross-component state?** Use hooks + callbacks, not global state
