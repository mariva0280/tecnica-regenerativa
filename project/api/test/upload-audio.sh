#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

AUTH_TOKEN=${AUTH_TOKEN:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGE4M2JiMDhiNGUyMjhhOTAxNDIxMTgiLCJyb2xlIjoicmVndWxhciIsImlhdCI6MTc1NjEzMTYyNX0.ivCysVDYfWid3zCzM6VrYMJA400_8TtNi7ifk9UfvO0}
API_URL=${API_URL:-http://localhost:8080}

curl -v \
  -X POST \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -F "audio=@fixtures/sample.mp3;type=audio/mpeg" \
  "${API_URL}/upload-audio"