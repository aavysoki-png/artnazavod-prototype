#!/bin/bash
# Деплой прототипа «АртНаЗавод» на dribble: локальная сборка -> rsync dist/ -> nginx-контейнер.
#
# ВАЖНО: сборка ("npm run build" ниже) возможна ТОЛЬКО на этой машине —
# package.json подключает @sibur/design-system-react и @sibur/design-tokens
# через file:-ссылки на ../../ux-rules-mcp/... (соседняя папка вне этого
# репозитория). На боевом ВПС НИКОГДА не делать "git clone" + "npm install"
# — только собрать здесь и залить готовый dist/, как делает этот скрипт.
set -euo pipefail

SSH_KEY=~/.ssh/server_key
HOST=dribble@192.168.31.29
REMOTE_BASE=/opt/dev-projects
LOCAL_PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTAINER_NAME=artnazavod-prototype
HOST_PORT=8881

echo "==> Локальная сборка (vite build)"
cd "$LOCAL_PROJECT" && npm run build

echo "==> Метаданные деплоя (для дашборда)"
DEPLOY_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DEPLOY_HOST=$(hostname -s)
cat > "$LOCAL_PROJECT/dist/deploy-meta.json" <<EOF
{"app":"$CONTAINER_NAME","lastSync":"$DEPLOY_TIME","commit":"no-git","dirty":null,"deployedFrom":"$DEPLOY_HOST"}
EOF

echo "==> Синхронизация dist/ на сервер"
ssh -i "$SSH_KEY" -o BatchMode=yes "$HOST" "mkdir -p $REMOTE_BASE/$CONTAINER_NAME/dist"
rsync -az --delete \
  -e "ssh -i $SSH_KEY -o BatchMode=yes" \
  "$LOCAL_PROJECT/dist/" "$HOST:$REMOTE_BASE/$CONTAINER_NAME/dist/"

echo "==> Перезапуск контейнера"
ssh -i "$SSH_KEY" -o BatchMode=yes "$HOST" "
  sudo docker rm -f $CONTAINER_NAME 2>/dev/null || true
  sudo docker run -d \
    --name $CONTAINER_NAME \
    --network dev-net \
    --restart unless-stopped \
    -p $HOST_PORT:80 \
    -v $REMOTE_BASE/$CONTAINER_NAME/dist:/usr/share/nginx/html:ro \
    nginx:alpine
"

echo "==> Готово: http://192.168.31.29:$HOST_PORT/"
