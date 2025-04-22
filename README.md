# 📊 Search Console ETL & Analytics

This project fetches **Google Search Console** data, stores it in a PostgreSQL database, processes it via RabbitMQ, and exposes summarized analytics via a secured **GraphQL API**.

---

## ✅ Features

- Google OAuth2 Authentication
- Site selection + token storage (`tokens.json`)
- Scheduled data fetch (clicks, impressions, CTR, position)
- PostgreSQL + Prisma ORM
- RabbitMQ job producer & worker
- GraphQL API with Apollo Server v4
- Basic Auth security
- Unit-tested with Jest
- Dockerized services (Node.js, PostgreSQL, RabbitMQ)

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone <your-repo-url>
cd search-console-etl
```

### 2. Install Dependencies

npm install

3. Setup .env

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/searchconsole
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=supersecret

RABBITMQ_URL=amqp://localhost

🐳 Docker Setup (Recommended)
Start PostgreSQL & RabbitMQ:
docker-compose up -d

Run Prisma Migration:
npx prisma generate
npx prisma migrate dev --name init

🔐 OAuth2 Authentication (Phase 1)
GET http://localhost:3000/auth

📥 Fetch & Store (Phase 2)
npm run fetch

📨 RabbitMQ Queue (Phase 3)
Start Worker:
npm run worker

Send Job to Queue:
npm run produce

📊 GraphQL API (Phase 4)
Start Server:
npm run dev

Open: http://localhost:3000/graphql
🔐 Basic Auth required

Credentials (from .env):

Username: admin

Password: supersecret

Sample Query:
query {
metricsSummary(startDate: "2024-01-01", endDate: "2024-04-01") {
sumClicks
sumImpressions
avgCtr
avgPosition
}
}

🧪 Run Tests
npm run test

📁 Project Structure
src/
├── auth/ # Google OAuth logic
├── config/ # Constants (env variables)
├── graphql/ # Schema + resolvers
├── queue/ # Producer + Worker
├── scripts/ # CLI fetch trigger
├── services/ # GSC + DB logic
├── db.ts # Prisma client
└── server.ts # Apollo server

tests/ # Unit tests
Prisma/ # Prisma schema

⚙️ Tech Stack
Node.js + TypeScript

Apollo Server v4 + GraphQL

Express + Basic Auth

PostgreSQL + Prisma

RabbitMQ + amqplib

Google Search Console API

Jest for unit testing

Docker for environment

🔐 Security Notes
Tokens stored in tokens.json — restrict access or mount as Docker volume

Never commit .env or tokens.json

Use node:20-slim or distroless for secure images

Enable refresh token handling for long-term deployments
