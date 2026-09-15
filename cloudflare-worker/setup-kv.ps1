$ErrorActionPreference = 'Stop'
Write-Host "Khulna News 24 v9 - Cloudflare KV setup" -ForegroundColor Cyan
Write-Host "This creates the free Workers KV namespace used for persistent news storage." -ForegroundColor Gray

$out = npx wrangler kv namespace create NEWS_KV 2>&1 | Out-String
Write-Host $out

if ($out -match 'id\s*=\s*["'']([^"'']+)["'']') {
  $id = $matches[1]
} elseif ($out -match '([0-9a-f]{32})') {
  $id = $matches[1]
} else {
  $id = Read-Host "Paste the KV namespace ID shown by Wrangler"
}

if (-not $id) { throw "KV namespace ID was not provided." }

$path = Join-Path $PSScriptRoot 'wrangler.toml'
$cfg = Get-Content $path -Raw
if ($cfg -notmatch '\[\[kv_namespaces\]\]') {
  $cfg = $cfg -replace '(?ms)\n# Persistent free-tier storage.*$', "`n[[kv_namespaces]]`nbinding = \"NEWS_KV\"`nid = \"$id\"`n"
} else {
  $cfg = $cfg -replace 'id\s*=\s*"YOUR_KV_NAMESPACE_ID"', "id = \"$id\""
}
Set-Content -Path $path -Value $cfg -Encoding UTF8
Write-Host "KV binding configured in cloudflare-worker/wrangler.toml" -ForegroundColor Green
Write-Host "Next: cd cloudflare-worker ; npx wrangler deploy" -ForegroundColor Yellow
