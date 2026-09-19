<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a24eb73a-51e8-4e16-bce1-1614c60b6391

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## v9 deployment notes

- Frontend fetches up to 5,000 available Worker news items; public list/category/district/search pages operate on the synchronized dataset.
- Cloudflare Worker uses Workers KV for persistent news storage when the `NEWS_KV` binding is configured.
- Cron is configured for every 30 minutes.
- Before deploying the Worker, create a free KV namespace: `npx wrangler kv namespace create NEWS_KV`, then uncomment/add the `[[kv_namespaces]]` block in `cloudflare-worker/wrangler.toml` with the returned namespace ID.
- Worker health endpoint: `/api/health`.
- Worker news endpoint: `/api/news?limit=5000`.
- Worker collection endpoint: `/api/collect`.
- The app never assigns a shared district/elephant image to a story when the source has no image; it uses a neutral placeholder in the UI.

## v9.3
Homepage now displays the full merged published Worker feed in the main latest-news section, with responsive styling and the existing in-post sharing controls preserved.


## v9.6 Update

Advertising placements were polished using the supplied Adsterra formats, and the public advertising contact page was redesigned so contact details are not printed on-screen; the configured phone, WhatsApp and email actions remain directly clickable.
