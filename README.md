# TurfBook

TurfBook is a responsive sports-turf booking app. It includes a React + TanStack Start frontend, a Spring Boot REST API, and PostgreSQL/Flyway database scripts.

## Download once

Install these free tools on your laptop before starting the full version:

1. **Node.js (current LTS)** — this includes `npm`.
2. **Java 21 JDK** and **Maven 3.9+** — needed for the Spring Boot API.
3. **Docker Desktop** — the simplest way to run the included PostgreSQL database. If you already run PostgreSQL yourself, Docker is optional.

After installation, reopen PowerShell and confirm these commands print versions:

```powershell
node --version
npm --version
java --version
mvn --version
docker --version
```

## Fastest way to see the frontend

From this project folder, run:

```powershell
npm ci
npm run dev
```

Open the local address shown in the terminal (your current local frontend is `http://localhost:8080`). Start the Spring Boot API before using login, bookings, contact, or the admin dashboard.

## Run the complete app

Open a second PowerShell window and start the database and backend:

```powershell
cd backend
docker compose up -d
mvn spring-boot:run
```

Then keep the frontend running with `npm run dev`. The frontend `.env` points to the real API at `http://localhost:9090/api`; this avoids a conflict with the frontend on port `8080`. The API documentation is at `http://localhost:9090/swagger-ui.html`.

To stop the database later, run `docker compose down` from the `backend` folder. This retains the database volume; use `docker compose down -v` only when you intentionally want a fresh database.

## Included features

- Home, turf search/filtering, venue details, date/slot selection, booking confirmation, booking history, login/sign-up, contact, about, navbar and footer
- Turf filters for city, sport, price, rating, facilities, and availability
- JWT registration/login/refresh/logout; `USER`, `ADMIN`, and venue-owner access rules
- Booking availability checks, transaction locking, cancellation, validation, standard error responses, and admin routes
- PostgreSQL schema, foreign keys, indexes, 7 city seeds, sports/facility seeds, and 20 turf seeds
- A role-protected admin dashboard at `/admin`, with all customer bookings and recently registered users; it refreshes booking data every 15 seconds

## Development admin sign-in

After the backend has started, use:

- Email: `admin@gmail.com`
- Password: `Mahemood`

The customer booking is stored in PostgreSQL immediately and appears in the Admin Dashboard. Read [GitHub publishing steps](GITHUB_SETUP.md) before pushing this extracted ZIP project to GitHub.

See [the backend guide](backend/README.md) for API examples, seeded accounts, configuration and deployment notes.
