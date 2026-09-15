# Khulna News 24 — v9.4 Fixes

Built on v9.3 as a full replacement.

## v9.4 changes
- Fixed identical `48.5K` article view fallback on auto-collected articles.
- Added stable per-article engagement numbers so different posts show different view/like/share counts without changing randomly on every render.
- Preserved real stored engagement values when meaningful values exist.
- Removed fixed `3450` like / `1280` share fallbacks from article sharing UI.
- Improved article share controls with cleaner responsive styling.
- Share labels now follow the selected site language.
- Added multilingual UI labels for the supported language selector and extra locale support.
- Website defaults to Bangla when no language has been selected.
- Explicitly updates `<html lang>` when language changes.
- Existing v9.2/v9.3 Worker, Cron, auto-news, homepage and district-news logic remains intact.

## Important
Cloudflare Worker/Cron code was not changed in v9.4.
Actual article title/body translation for non-Bangla languages continues through the site's Google Translate integration.
