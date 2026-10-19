#!/bin/bash
# מתקין תלויות בתחילת כל סשן ענן של Claude Code, כדי ש-lint/typecheck/build יעבדו מיד.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
# npm install (ולא ci): משתמש במה שכבר מותקן מהמטמון של הסביבה ומהיר יותר
npm install --no-audit --no-fund --loglevel=error
