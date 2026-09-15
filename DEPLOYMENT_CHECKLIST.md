# Khulna News 24 v9 — Deployment Checklist

## 1. Website (VS Code)

```powershell
cd "PATH\TO\khulnanews24_v9"
npm install
npm run lint
npm run build
npm run dev
```

Open the local preview and verify the public pages and `/admin`.

## 2. Cloudflare Worker

```powershell
cd cloudflare-worker
npx wrangler login
.\setup-kv.ps1
npx wrangler deploy
```

The setup script creates the free Workers KV namespace and binds it as `NEWS_KV`.

After deployment verify:

- `https://YOUR-WORKER.workers.dev/api/health`
- `https://YOUR-WORKER.workers.dev/api/news?limit=5000`
- `https://YOUR-WORKER.workers.dev/api/collect`

The Worker cron is configured for every 30 minutes.

## 3. Admin Worker URL

In Admin → Auto News Manager, use only the Worker base URL, for example:

`https://YOUR-WORKER.workers.dev`

The connection test uses `/api/health` automatically.

## 4. GitHub

Create a GitHub repository and upload the complete `khulnanews24_v9` project.
Do not upload `.env.local`, API keys, or secrets.

## 5. Hosting

Use Netlify, Cloudflare Pages, or another static React/Vite host.
Build command:

`npm run build`

Publish directory:

`dist`

The included `netlify.toml` and `public/_redirects` preserve SPA routes.

## 6. Domain

After the hosting deployment is working on its temporary URL, connect the custom domain.
Do not change the Worker URL unless you intentionally deploy a new Worker.

## 7. Final live checks

- Home loads and displays the newest Worker news.
- Latest page can access the synchronized dataset.
- Category/district/search/archive pages work.
- Article pages open by ID/slug.
- Source images remain attached to their own stories.
- Missing images use the neutral placeholder instead of a shared elephant image.
- Admin Worker test reports HTTP 200.
- Worker KV survives a new Worker isolate/deployment.
- Cron runs every 30 minutes.
