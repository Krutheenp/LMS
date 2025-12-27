# Database Setup Options

## ⚠️ Current Status
- ❌ PostgreSQL not installed locally
- ❌ Docker daemon not running
- ✅ Docker installed but not running

## Quick Solution: Use SQLite (Fastest Option)

SQLite requires **zero setup** and is perfect for testing. Let me convert your project to use SQLite:

### Step 1: Update Prisma Schema
Change `prisma/schema.prisma` first line from:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Run Migrations
```bash
npm run prisma:migrate
```

### Step 3: Seed Data
```bash
npm run prisma:seed
```

### Step 4: Start Server
```bash
npm run dev
```

---

## Alternative Solutions

### Option A: Start Docker Desktop
If you have Docker Desktop installed but it's not running:
1. Open **Docker Desktop** application from Start menu
2. Wait for it to fully start (check system tray)
3. Then run:
```bash
docker run --name lms-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lms_db -p 5432:5432 -d postgres:15
```

### Option B: Install PostgreSQL Locally
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. During installation, remember the password you set
4. Update `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lms_db"
```
5. Create database (using pgAdmin that installs with PostgreSQL):
```sql
CREATE DATABASE lms_db;
```
6. Run: `npm run prisma:migrate`

### Option C: Use Cloud Database (Recommended for Production)

**Railway.app** (5 min setup):
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Add PostgreSQL
4. Copy connection string to `.env` as `DATABASE_URL`
5. Run: `npm run prisma:migrate`

**Supabase** (Free PostgreSQL):
1. Go to https://supabase.com
2. Create project
3. Copy connection string (Settings → Database)
4. Paste in `.env`
5. Run: `npm run prisma:migrate`

---

## Recommendation

For **immediate testing**, use **SQLite** (no setup).
For **production**, use **PostgreSQL** (either Docker, local, or cloud).

Would you like me to:
1. ✅ **Convert to SQLite** (instant, for testing)
2. 🐳 **Help start Docker Desktop** (for PostgreSQL)
3. 📖 **Provide detailed PostgreSQL installation** steps

Let me know! 👇
