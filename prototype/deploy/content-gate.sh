#!/bin/bash
# Шлюз для ключей CI GitHub-зеркала: forced command в authorized_keys root'а.
# Ставится deploy-prod.sh в /usr/local/bin/artnazavod-content-gate.
#
#   command="/usr/local/bin/artnazavod-content-gate prod",restrict ssh-ed25519 ... artnazavod-ci-prod
#   command="/usr/local/bin/artnazavod-content-gate preview",restrict ssh-ed25519 ... artnazavod-ci-preview
#
# Ключи лежат в секретах GitHub, до которых дотягивается workflow из ветки
# коллеги, поэтому каждый умеет ровно одно:
#   prod    — rsync в /var/www/artnazavod/photos (и больше никуда);
#   preview — «open pr-N» (копия боевого сайта жёсткими ссылками), «close pr-N»
#             и rsync в /var/www/preview/pr-N/photos.
# Shell, чтения, записи вне этих папок нет. Что попало в photos/, nginx отдаёт
# только если это .jpg/.json (см. nginx-artnazavod.conf) — HTML через шлюз на
# домен не подложить.
set -euo pipefail

SITE=/var/www/artnazavod
PREVIEWS=/var/www/preview
CMD=${SSH_ORIGINAL_COMMAND:-}
deny() { echo "content-gate: запрещено: $1" >&2; exit 1; }

case "${1:-}" in
prod)
	[[ $CMD == "rsync --server "* ]] || deny "$CMD"
	exec /usr/bin/rrsync -wo "$SITE/photos"
	;;
preview)
	read -r verb rest <<<"$CMD"
	case "$verb" in
	open)
		[[ $rest =~ ^pr-[0-9]{1,6}$ ]] || deny "$CMD"
		mkdir -p "$PREVIEWS"
		# Брошенные превью (PR не закрыли) — через две недели сами.
		find "$PREVIEWS" -mindepth 1 -maxdepth 1 -name 'pr-*' -mtime +14 -exec rm -rf {} +
		rm -rf "${PREVIEWS:?}/$rest"
		# Жёсткие ссылки: видео (~450 МБ) не копируются. rsync пишет новые
		# файлы через временный + rename, так что боевые файлы не задеваются.
		cp -al "$SITE" "$PREVIEWS/$rest"
		touch "$PREVIEWS/$rest"
		echo "open $rest"
		;;
	close)
		[[ $rest =~ ^pr-[0-9]{1,6}$ ]] || deny "$CMD"
		rm -rf "${PREVIEWS:?}/$rest"
		echo "close $rest"
		;;
	pr-*)
		# rsync с --rsync-path=pr-N: имя превью приходит вместо имени программы.
		[[ $verb =~ ^pr-[0-9]{1,6}$ && $rest == "--server "* ]] || deny "$CMD"
		[ -d "$PREVIEWS/$verb/photos" ] || deny "превью $verb не открыто"
		SSH_ORIGINAL_COMMAND="rsync $rest" exec /usr/bin/rrsync -wo "$PREVIEWS/$verb/photos"
		;;
	*) deny "$CMD" ;;
	esac
	;;
*) deny "режим ${1:-}" ;;
esac
