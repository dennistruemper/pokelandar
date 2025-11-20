# Pokelandar Admin

This is a SvelteKit + Bun project for managing quiz questions stored in MongoDB.
It provides an admin-only view at `/questions/all` where each question shows its answer and motivational reward inside a `details` block.

## Tech Stack

- SvelteKit 2 + Typescript
- Bun runtime (dev + prod)
- MongoDB (Dockerized)
- Tailwind utilities via `@tailwindcss/vite`

## Local Development

1. Install dependencies (Bun only):
   ```bash
   bun install
   ```
2. Start the dev server:
   ```bash
   bun run dev
   ```
3. Visit `http://localhost:5173`.

## Docker & Coolify

- `docker-compose.yml` defines MongoDB, the Bun/SvelteKit app, and a one-off `seed` service.
- `docker-compose.dev.yml` adds local port mappings. Use the scripts:
  ```bash
  bun run docker:up        # up with ports
  bun run docker:down
  bun run docker:up:build
  ```
- Coolify should only use `docker-compose.yml` (no ports exposed). The seed service runs once per deploy before the app starts.

## Seeding MongoDB

- Seed data lives in `scripts/seed.ts`. It inserts sample questions if the collection is empty.
- Run manually (outside Docker):
  ```bash
  bun run seed
  ```
- In Docker, the `seed` service runs automatically and exits after success.

## API

- `GET /api/questions` returns all questions as JSON.

## Admin UI

- Navigate to `/questions/all`
- Each card shows the question; expand to reveal answer + reward.

## Tests & Linting

```bash
bun run test         # unit tests via Vitest
bun run lint
bun run check        # type + svelte-check
```

## Environment Variables

- `MONGODB_URI`, `MONGODB_DB_NAME`, etc. See `docker-compose.yml` for defaults.

Feel free to extend this README with deployment notes or future features as the project evolves.
