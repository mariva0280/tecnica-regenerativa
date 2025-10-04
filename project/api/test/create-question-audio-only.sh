#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

AUTH_TOKEN=${AUTH_TOKEN:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGE4M2JiMDhiNGUyMjhhOTAxNDIxMTgiLCJyb2xlIjoicmVndWxhciIsImlhdCI6MTc1NjEzMTYyNX0.ivCysVDYfWid3zCzM6VrYMJA400_8TtNi7ifk9UfvO0}
API_URL=${API_URL:-http://localhost:8080}

UPLOAD_RESPONSE=$(curl -s \
  -X POST \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -F "audio=@fixtures/sample.mp3;type=audio/mpeg" \
  "${API_URL}/upload-audio")

printf 'Upload response: %s\n' "$UPLOAD_RESPONSE"

AUDIO_URL=$(printf '%s' "$UPLOAD_RESPONSE" | node -pe "(() => { const fs = require('fs'); const data = JSON.parse(fs.readFileSync(0, 'utf8')); if (!data.url) { throw new Error('missing url'); } return data.url; })()")

printf 'Using audioUrl: %s\n' "$AUDIO_URL"

PAYLOAD=$(printf '{"zone":"%s","audioUrl":"%s"}' "manos" "$AUDIO_URL")

curl -v \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d "$PAYLOAD" \
  "${API_URL}/questions"