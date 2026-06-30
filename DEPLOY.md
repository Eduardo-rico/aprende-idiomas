# Deploy — Manual Lusitano

Single-user Portuguese learning app. The ~451 MB audio corpus lives in
`public/audio` and is baked into the image, so the container is fully
self-contained.

## Local (your Mac)

```bash
npm run dev          # dev server, http://localhost:3000 (hot reload)
# or a production build locally:
npm run build && npm start
```

Auth gate uses the dev fallback password `charalito4` (see
`lib/auth/session.ts`) unless `APP_PASSWORD` + `APP_SECRET` are set.

## VPS with Docker

Prereqs on the VPS: Docker + Docker Compose, and ~2 GB free RAM for the
build. The build copies the whole repo including `public/audio`, so make
sure the audio is committed/pulled before building.

```bash
git clone <repo> portugues-app && cd portugues-app
docker compose up -d --build      # first build is slow (~451 MB audio)
docker compose logs -f            # watch it boot ("Ready in ...")
```

The app listens on **127.0.0.1:3000** only — it is intentionally NOT
exposed to `0.0.0.0`. Put a reverse proxy in front:

### Reverse proxy (nginx example)

```nginx
server {
  server_name portugues.tudominio.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then add TLS (certbot / Cloudflare). A Cloudflare Tunnel also works and
needs no open inbound port at all.

### Securing the gate (if internet-reachable)

The dev password is public (it's in the repo). Before exposing this,
edit `docker-compose.yml` and set:

```yaml
environment:
  APP_SECRET: "<openssl rand -hex 32>"
  APP_PASSWORD: "<your private password>"
```

`isAuthConfigured()` flips off the dev fallback automatically once both
are present.

## Updating

```bash
git pull
docker compose up -d --build
```

## Regenerating audio (after editing content)

Not part of serving — only needed when lesson/story text changes. Run on
a machine with `MINIMAX_API_KEY` in `.env.local`:

```bash
npm run generate:audio -- --block N    # only re-synthesizes changed text
npm run verify:content                 # integrity check
```

Commit the new `public/audio/*.mp3` and updated JSON, then rebuild the image.
