# Khulna News 24 v9.1

Final auto-news sync fix.

- Cloudflare Worker is the source of truth for automatic news.
- Admin Auto News Manager reads the Worker feed directly, so stored news and district counts do not depend on localStorage timing.
- Worker payload district aliases (Bangla/English) are normalized to the app's 10 district keys.
- Worker payload image/title/description/link aliases are normalized.
- Worker collection is triggered by Collect Now; direct RSS is only a fallback when the Worker is unavailable.
- Browser background no longer repeatedly scrapes RSS; it only syncs the Worker feed.
- Default frequency is 30 minutes; Cloudflare Cron remains the 24/7 collector.
- Home/district/article lookup uses up to 5000 stored Worker items.
- Existing manual news remains separate from automatic Worker news.
