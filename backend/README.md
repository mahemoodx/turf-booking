# TurfBook API

Spring Boot 3 / Java 21 / PostgreSQL backend for the TurfBook React frontend.

## Start locally

1. Install Java 21+ and Maven 3.9+.
2. Start PostgreSQL from this folder:

   ```bash
   docker compose up -d
   ```

3. Copy `.env.example` to your shell environment (or leave the local Docker defaults in place), then run:

   ```bash
   mvn spring-boot:run
   ```

The API is available at `http://localhost:9090/api`, and Swagger UI at `http://localhost:9090/swagger-ui.html`.

## Environment

| Variable | Local default | Purpose |
| --- | --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/turfbook` | PostgreSQL JDBC URL |
| `DB_USERNAME` / `DB_PASSWORD` | `turfbook` / `turfbook` | Database credentials |
| `JWT_SECRET` | development value | Base64-encoded 256-bit signing secret |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173,http://localhost:8080` | Comma-separated frontend origins |

Set a unique `JWT_SECRET` and a strong database password before deploying. The checked-in JWT secret exists only to make first local startup easy.

## Seeded accounts and data

Flyway loads 7 cities, 20 turfs, facilities, and the core roles. On the first application startup it also adds seven days of slots plus these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@turfbook.com` | `Admin@123` |
| Admin | `admin@gmail.com` | `Mahemood` |
| User | `user@turfbook.com` | `User@123` |

Change both passwords immediately outside local development.

## API quick checks

```bash
# Browse venues
curl "http://localhost:9090/api/turfs?city=Hyderabad&sport=FOOTBALL"

# Login and receive JWT access/refresh tokens
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@turfbook.com","password":"User@123"}'

# Fetch an authenticated user's bookings
curl http://localhost:9090/api/bookings -H "Authorization: Bearer ACCESS_TOKEN"
```

All endpoints use the shape `{ success, message, data, timestamp }`; validation failures also contain an `errors` array. Swagger documents every endpoint, request body, and protected operation.

## Design notes

- `time_slots` is locked pessimistically inside the booking transaction; a partial unique PostgreSQL index prevents two non-cancelled bookings from sharing a slot.
- Turf deletion is soft deletion, so historic bookings remain intact.
- Access JWTs last 15 minutes; refresh JWTs last seven days and are persisted/revocable.
- Passwords use BCrypt. Password reset and email verification use single-use, hashed tokens. Their development delivery adapter logs the raw token; replace that adapter with SMTP before production.
- Payments are deliberately modelled but not charged: bookings are initially `CONFIRMED` with `PENDING` payment status, ready for a payment provider webhook to mark them `PAID`.
