#!/usr/bin/env bash
# One-shot install of the WhatsApp bridge on a fresh or existing Ubuntu VPS.
# Safe to re-run: it also updates an existing install, and never touches a linked
# WhatsApp session (auth_info) or an existing .env.
#
#   curl -fsSL https://raw.githubusercontent.com/alfredmuriu/kimita/main/whatsapp-bot/deploy/setup-server.sh -o setup-server.sh
#   bash setup-server.sh
#
# It stops short of starting the bot: the QR scan comes next, see RESUME-TOMORROW.md.

set -euo pipefail

REPO_URL="https://github.com/alfredmuriu/kimita.git"
APP_ROOT="/opt/agrikima"
BOT_DIR="$APP_ROOT/whatsapp-bot"
OLD_ENV="$HOME/agrikimawebsiterevamp/whatsapp-bot/.env"
BRIDGE_URL="https://www.agrikima.co.ke/api/whatsapp/bridge"
PM2_NAME="agrikima-whatsapp"

say() { printf '\n==> %s\n' "$1"; }

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this as root." >&2
  exit 1
fi

# git is required by npm as well as for the clone: Baileys pulls libsignal from
# GitHub rather than the npm registry.
say "Installing system packages"
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq git curl ca-certificates

node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }
if [ "$(node_major)" -lt 20 ]; then
  say "Installing Node 22 (Baileys 7 needs 20 or newer)"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs
fi
echo "Node $(node -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  say "Installing pm2"
  npm install -g pm2
fi

# Anything still running under this name is the old install, and two copies on
# one session kick each other off WhatsApp.
pm2 delete "$PM2_NAME" >/dev/null 2>&1 || true

say "Fetching the bot code into $APP_ROOT"
if [ -d "$APP_ROOT/.git" ]; then
  git -C "$APP_ROOT" pull --ff-only
else
  git clone --depth 1 "$REPO_URL" "$APP_ROOT"
fi

cd "$BOT_DIR"
say "Installing dependencies"
npm ci --omit=dev

say "Checking configuration"
if [ ! -f .env ]; then
  if [ -f "$OLD_ENV" ]; then
    cp "$OLD_ENV" .env
    echo "Reused .env from the previous install."
  else
    cp .env.example .env
  fi
fi

current_secret() { sed -n 's/^AGENT_CRON_SECRET=//p' .env | tr -d '\r"'; }

if [ -z "$(current_secret)" ]; then
  # Vercel hides the value once saved, so it comes from your own records.
  read -rsp "Paste AGENT_CRON_SECRET (nothing shows while you paste): " secret
  echo
  sed -i '/^AGENT_CRON_SECRET=/d' .env
  printf 'AGENT_CRON_SECRET=%s\n' "$secret" >> .env
fi

# An old open-wa .env can carry a stale URL, so pin it to the live endpoint.
sed -i '/^CHAT_API_URL=/d' .env
printf 'CHAT_API_URL=%s\n' "$BRIDGE_URL" >> .env
chmod 600 .env

# An empty body makes no conversation row: 400 means the secret was accepted and
# only the body was rejected.
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BRIDGE_URL" \
  -H "x-cron-secret: $(current_secret)" -H 'content-type: application/json' -d '{}')
case "$code" in
  400) echo "Secret accepted by the live site." ;;
  401)
    echo "The live site rejected AGENT_CRON_SECRET. Fix it in $BOT_DIR/.env and re-run." >&2
    exit 1
    ;;
  *)
    echo "Unexpected response $code from $BRIDGE_URL. Check the site, then re-run." >&2
    exit 1
    ;;
esac

say "Making pm2 start on boot"
pm2 startup systemd -u root --hp "$HOME" >/dev/null
systemctl enable pm2-root >/dev/null 2>&1 || true
# Unrotated logs would eventually fill the disk and take the bot down.
pm2 install pm2-logrotate >/dev/null 2>&1 || echo "pm2-logrotate skipped; the bot is unaffected."

if [ -f auth_info/creds.json ]; then
  session_note="A linked WhatsApp session already exists, so no scan is needed."
else
  session_note="No WhatsApp session yet. Run the scan next."
fi

cat <<EOF

Setup complete. $session_note

  cd $BOT_DIR
  npm start                         # scan the QR, wait for "Connected", test, Ctrl+C
  pm2 start ecosystem.config.cjs
  pm2 save

EOF
