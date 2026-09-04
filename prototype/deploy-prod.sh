#!/bin/bash
# Деплой прототипа «АртНаЗавод» на боевой ВПС (art.sibur.ru, Debian 13):
# локальная сборка -> rsync dist/ -> статика, которую отдаёт системный nginx.
#
# Сборка делается здесь, а не на сервере: на ВПС нет Node и он ему не нужен —
# туда уезжает только готовая статика. Если когда-нибудь понадобится собирать
# на сервере, учти, что штатный Node в Debian 13 старее требований Vite 8
# (нужен >= 20.19), ставить из NodeSource.
#
# Раздел на sibur.ru подключается проксированием на этот сервер. Все пути в
# сборке относительные (vite base './'), поэтому прокси обязан отдавать URL
# раздела с завершающим слэшем — иначе браузер разрешит пути уровнем выше.
set -euo pipefail

SSH_KEY=~/.ssh/artnazavod_prod
HOST=root@194.58.118.240
REMOTE_DIR=/var/www/artnazavod
LOCAL_PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Локальная сборка (vite build)"
cd "$LOCAL_PROJECT"
NODE_EXTRA_CA_CERTS="${NODE_EXTRA_CA_CERTS:-$HOME/Documents/sibur-dev-vpn/devrootca.crt}" npm run build

echo "==> Синхронизация dist/ на сервер (~500 МБ, в основном видео)"
rsync -az --delete \
  -e "ssh -i $SSH_KEY -o BatchMode=yes" \
  "$LOCAL_PROJECT/dist/" "$HOST:$REMOTE_DIR/"

echo "==> Права и перезагрузка конфигурации"
ssh -i "$SSH_KEY" -o BatchMode=yes "$HOST" "
  find $REMOTE_DIR -type d -exec chmod 755 {} + &&
  find $REMOTE_DIR -type f -exec chmod 644 {} + &&
  nginx -t && systemctl reload nginx
"

echo "==> Проверка"
code=$(curl -s -o /dev/null -w "%{http_code}" http://194.58.118.240/)
echo "    index.html: $code"
[ "$code" = "200" ] || { echo "    ОШИБКА: сайт не отдаётся"; exit 1; }
echo "==> Готово: http://194.58.118.240/"
