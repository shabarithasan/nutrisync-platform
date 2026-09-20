# NutriSync — AI Powered Nutrition Companion

NutriSync is a polished full-stack nutrition dashboard designed for a BCA final-year project. It provides a responsive wellness workspace with food logging, calorie and macro tracking, AI diet-plan generation, progress visualisation, hydration tracking, workouts, report downloads, and an admin overview.

## Included modules

- Secure registration, verification, password reset, JWT access tokens, rotating refresh sessions, rate limiting and role checks
- Personal dashboard with calorie, macros, water, streak, meals and weekly momentum
- Searchable food diary with instant meal logging and nutrition values
- AI diet-plan intake and generated recommendation state
- Weight/BMI progress chart, hydration tracker, workouts, reports and admin analytics
- Dark appearance toggle and responsive desktop/tablet/mobile navigation

## Run locally

1. From this folder, copy `.env.example` to `.env` and set `DATABASE_URL` plus `JWT_ACCESS_SECRET`.
2. Create a PostgreSQL database, then run `npm run prisma:migrate -- --name init`.
3. Start the API and web app together with `npm.cmd run dev` on Windows (or `npm run dev` elsewhere).
4. Visit `http://localhost:5173`.

For a frontend-only visual demo, `npm.cmd run build` produces the deployable site in `dist/`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account and verification token |
| POST | `/api/auth/verify-email` | Verify account email |
| POST | `/api/auth/login` | Authenticate and issue session |
| POST | `/api/auth/refresh` | Rotate the HttpOnly refresh session |
| POST | `/api/auth/logout` | End current session |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Complete password reset |
| GET | `/api/auth/me` | Get authenticated profile |
| GET | `/api/admin/health` | Admin-only authorization check |
