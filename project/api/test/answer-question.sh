#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
API_URL=${API_URL:-http://localhost:8080}
STUDENT_TOKEN=${STUDENT_TOKEN:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGE4M2JiMDhiNGUyMjhhOTAxNDIxMTgiLCJyb2xlIjoicmVndWxhciIsImlhdCI6MTc1NjEzMTYyNX0.ivCysVDYfWid3zCzM6VrYMJA400_8TtNi7ifk9UfvO0}
ADMIN_TOKEN=${ADMIN_TOKEN:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGE4M2FmZTU5YWUyZmY0NjQ0Nzc2ZWEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYxMzQzNTR9.SFJvyCVBCjWd9JMX1H_tMDYkREB58CqNO0huEjlmmFw}

CREATE_PAYLOAD='{"zone":"manos","title":"Molestia en la muneca","body":"Me duele al girarla"}'
CREATE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "$CREATE_PAYLOAD" \
  "$API_URL/questions")

echo "Create question response: $CREATE_RESPONSE"

QUESTION_ID=$(printf '%s' "$CREATE_RESPONSE" | node -pe "(() => { const fs = require('fs'); const data = JSON.parse(fs.readFileSync(0, 'utf8')); if (!data.id) throw new Error('missing id'); return data.id; })()")

echo "Answering question $QUESTION_ID"

ANSWER_PAYLOAD='{"text":"Revisa la movilidad y aplica frío local 10 minutos."}'

curl -v -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "$ANSWER_PAYLOAD" \
  "$API_URL/questions/$QUESTION_ID/answers"

