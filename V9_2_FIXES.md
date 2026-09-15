# Khulna News 24 — v9.2 Fixes

- Cloudflare Worker remains the authoritative automatic collector.
- Fixed misleading Collect Now messaging when Worker collection succeeds but no brand-new item is available.
- Worker-stored news continues to sync to the admin panel.
- Worker district counts are calculated only from valid mapped district values.
- Migrates the old 10-minute browser setting to 30 minutes so the UI matches the 30-minute Cloudflare Cron setup.
- Keeps all v9.1 features and existing project files intact.
