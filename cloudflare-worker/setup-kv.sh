#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Khulna News 24 v9 - Cloudflare KV setup"
out="$(npx wrangler kv namespace create NEWS_KV 2>&1 || true)"
echo "$out"
id="$(printf '%s\n' "$out" | sed -nE 's/.*id[[:space:]]*=[[:space:]]*[\"'"'"']([^\"'"'"']+)[\"'"'"'].*/\1/p' | head -1)"
if [ -z "$id" ]; then id="$(printf '%s\n' "$out" | grep -Eo '[0-9a-f]{32}' | head -1 || true)"; fi
if [ -z "$id" ]; then read -rp "Paste KV namespace ID: " id; fi
python3 - "$id" <<'PY'
from pathlib import Path
import sys
p=Path('wrangler.toml')
s=p.read_text()
id=sys.argv[1]
if '[[kv_namespaces]]' not in s:
    s=s.split('\n# Persistent free-tier storage',1)[0].rstrip()+f'\n\n[[kv_namespaces]]\nbinding = "NEWS_KV"\nid = "{id}"\n'
else:
    s=s.replace('id = "YOUR_KV_NAMESPACE_ID"', f'id = "{id}"')
p.write_text(s)
PY
echo "KV binding configured. Next: npx wrangler deploy"
