# Setup & Installation Guide

## Prerequisites

- Node.js 18+
- npm หรือ yarn
- PostgreSQL database
- Git

## Step 1: Clone & Install

```bash
git clone <repo-url>
cd LMS
npm install
```

## Step 2: Environment Setup

```bash
# Copy .env.example ไป .env
cp .env.example .env

# Edit .env file
# DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
# NEXTAUTH_SECRET="generate-random-secret-key"
```

## Step 3: Database Setup

```bash
# Create database
createdb lms_db

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed data
npm run prisma:seed
```

## Step 4: Start Development Server

```bash
npm run dev
```

Server จะเริ่มที่: http://localhost:3000

## Step 5: First Login

Default credentials:
- **Admin:** admin@example.com / password
- **Member:** member@example.com / password

(คุณสามารถสร้างบัญชีใหม่ผ่าน Register page)

## Project Structure

```
LMS/
├── public/                    # Static files
├── prisma/                    # Database schema
├── src/
│   ├── app/                  # Next.js pages & API routes
│   ├── components/           # React components
│   ├── lib/                  # Utilities & configs
│   ├── hooks/                # Custom hooks
│   ├── services/             # Business logic
│   └── types/                # TypeScript definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example
```

## Available Scripts

```bash
# Development
npm run dev                    # Start dev server

# Build & Production
npm run build                  # Build for production
npm start                      # Start production server

# Database
npm run prisma:generate       # Generate Prisma Client
npm run prisma:migrate        # Run migrations
npm run prisma:studio         # Open Prisma Studio

# Linting
npm run lint                   # Run ESLint
```

## Common Issues

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- ตรวจสอบว่า PostgreSQL running
- ตรวจสอบ DATABASE_URL ใน .env

### Prisma Migration Error

```
npm run prisma:migrate -- --name initial
```

### Port 3000 Already in Use

```bash
npm run dev -- -p 3001
```

## Architecture Overview

### Frontend (Next.js)
- Pages: Dashboard, Activities, Profile (Member)
- Pages: Dashboard, Members, Activities, Reviews (Admin)
- Components: Reusable UI, Feature-specific

### Backend (API Routes)
- Activities CRUD
- Submissions CRUD
- Members CRUD
- File Upload
- Badge Management

### Database (PostgreSQL)
- Users (Members/Admin)
- Activities
- Submissions
- Badges
- ActivityProgress

## Security Considerations

1. **Authentication:**
   - Use NextAuth.js for session management
   - Hash passwords with bcrypt
   - Implement JWT tokens

2. **Authorization:**
   - Middleware checks user role
   - Admin-only routes protected
   - User data isolation

3. **File Upload:**
   - Validate file types
   - Limit file size (10MB)
   - Store in cloud storage (S3/Cloudinary)

4. **Database:**
   - Use environment variables
   - SQL injection prevention (Prisma)
   - Data encryption for sensitive fields

## Performance Optimization

- Image optimization (Next.js Image)
- Code splitting (automatic)
- Caching strategies (React Query)
- Database indexing
- API response pagination

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build passes without errors
- [ ] All tests passing
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Backup strategy in place

## Next Steps

1. Customize branding & colors
2. Implement authentication (NextAuth)
3. Add email notifications
4. Create analytics dashboard
5. Set up CI/CD pipeline
6. Deploy to production

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
