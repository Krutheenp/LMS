# Development Guide

## Architecture Decisions

### Technology Choices
- **Next.js**: React framework with built-in API routes, SSR, and deployment
- **Prisma**: Type-safe ORM for database operations
- **Tailwind CSS**: Utility-first CSS framework for styling
- **PostgreSQL**: Relational database for structured data

### Folder Organization
- `components/ui` - Basic UI components (Button, Card)
- `components/features` - Feature-specific components
- `components/layout` - Layout components
- `services/` - Business logic separated from components
- `hooks/` - Reusable React hooks
- `types/` - Centralized TypeScript definitions

## Component Development

### Creating a New Component

```typescript
'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  children: React.ReactNode
  className?: string
}

export const Component: React.FC<ComponentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  )
}
```

### Using Existing Components

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <Button variant="primary">Click Me</Button>
    </Card>
  )
}
```

## API Development

### Creating an API Route

```typescript
// src/app/api/activities/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const activities = await prisma.activity.findMany()
    return NextResponse.json({
      success: true,
      data: activities,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const activity = await prisma.activity.create({ data: body })
    return NextResponse.json(
      { success: true, data: activity },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 400 }
    )
  }
}
```

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}
```

## State Management

### Using Custom Hooks

```typescript
// src/hooks/use-activities.ts
import { useState, useCallback } from 'react'

export function useActivities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/activities')
      const data = await res.json()
      setActivities(data.data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { activities, loading, fetch }
}
```

### Using in Components

```typescript
'use client'

import { useActivities } from '@/hooks/use-activities'
import { useEffect } from 'react'

export default function ActivitiesPage() {
  const { activities, loading, fetch } = useActivities()

  useEffect(() => {
    fetch()
  }, [fetch])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {activities.map((activity) => (
        <div key={activity.id}>{activity.title}</div>
      ))}
    </div>
  )
}
```

## Database Operations

### Using Prisma Services

```typescript
// src/services/index.ts
import { prisma } from '@/lib/db'

export const activityService = {
  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    return prisma.activity.findMany({ skip, take: limit })
  },

  async getById(id: string) {
    return prisma.activity.findUnique({ where: { id } })
  },

  async create(data: any) {
    return prisma.activity.create({ data })
  },
}
```

### Using in API Routes

```typescript
import { activityService } from '@/services'

export async function GET(request: NextRequest) {
  const activities = await activityService.getAll()
  return NextResponse.json({ success: true, data: activities })
}
```

## Styling

### Tailwind CSS Classes

```tsx
// Use `cn()` utility to merge classes
import { cn } from '@/lib/utils'

const variant = 'primary'
const className = cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  'custom-classes'
)
```

### Custom CSS

In `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom components */
.badge-circle {
  @apply rounded-full flex items-center justify-center;
}

.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded;
}
```

## Type Safety

### Define Types

```typescript
// src/types/db.ts
export interface Activity {
  id: string
  title: string
  maxScore: number
  startDate: Date
  endDate: Date
}

export interface Submission extends Activity {
  status: 'NOT_STARTED' | 'SUBMITTED' | 'APPROVED'
  score?: number
}
```

### Use Types in Components

```typescript
import { Activity } from '@/types'

interface ActivityCardProps {
  activity: Activity
  onSubmit?: () => void
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onSubmit,
}) => {
  // Type-safe component
}
```

## Error Handling

### Try-Catch in API Routes

```typescript
try {
  const data = await someOperation()
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { success: false, error: 'Operation failed' },
    { status: 500 }
  )
}
```

### Error Handling in Components

```typescript
const [error, setError] = useState<string | null>(null)

const handleSubmit = async () => {
  try {
    await submitActivity()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error')
  }
}

if (error) return <div className="text-red-500">{error}</div>
```

## Testing

### Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### API Testing

```typescript
describe('GET /api/activities', () => {
  it('returns activities', async () => {
    const response = await fetch('/api/activities')
    expect(response.status).toBe(200)
  })
})
```

## Best Practices

1. **Component Props**: Use TypeScript interfaces
2. **Error Handling**: Always handle errors gracefully
3. **Loading States**: Show loading indicators
4. **Type Safety**: Use types throughout the app
5. **Code Reusability**: Extract common logic
6. **Comments**: Document complex logic
7. **Performance**: Use React.memo, useMemo
8. **Security**: Validate inputs, use CORS
9. **Accessibility**: Use semantic HTML, ARIA labels
10. **Testing**: Write tests for critical features

## Common Patterns

### Fetch with Loading

```typescript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  fetch('/api/endpoint')
    .then(r => r.json())
    .then(d => setData(d))
    .catch(e => setError(e))
    .finally(() => setLoading(false))
}, [])
```

### Form Handling

```typescript
const [formData, setFormData] = useState({ name: '', email: '' })

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

const handleSubmit = async (e) => {
  e.preventDefault()
  await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
}
```

## Debugging

```typescript
// console.log with formatting
console.log('User:', user, 'Activities:', activities)

// Use React DevTools
// Use Nextjs DevTools
// Use Prisma Studio: npm run prisma:studio
```

## Performance Tips

- Use Next.js Image component
- Implement pagination
- Use React.memo for expensive components
- Lazy load components
- Optimize database queries
- Implement caching strategies
