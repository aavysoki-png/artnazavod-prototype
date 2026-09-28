#!/usr/bin/env bash
# Обмен с GitHub-зеркалом (github.com/aavysoki-png/artnazavod-prototype, main).
#
# Рабочая линия — корп-GitLab (origin), в ней есть видео (LFS). Зеркало —
# та же история без prototype/public/media и prototype/public/hero: права на
# видео вне sibur.ru не оговорены, а LFS съел бы бесплатную квоту GitHub.
# Фото в зеркале есть (с 23.09) — через них коллеги обновляют галерею по
# PHOTOS.md.
#
#   GITHUB_TOKEN=... tools/sync-github-mirror.sh pull   # забрать смерженные PR коллег
#   GITHUB_TOKEN=... tools/sync-github-mirror.sh push   # выложить новые коммиты рабочей линии
#
# Коммиты зеркала собираются plumbing'ом (commit-tree), а не filter-branch:
# каждый коммит рабочей линии даёт один коммит зеркала с тем же автором и
# сообщением и трейлером `Source-Commit: <sha>` — по нему следующий push
# находит, откуда продолжать. Пуш всегда fast-forward, без --force.
#
# Порядок, если коллеги что-то смержили: сначала pull (их фото ложатся в
# рабочую линию коммитом), потом сборка/выкладка, потом push. push сам
# откажется, если в зеркале есть коммиты не из рабочей линии — иначе
# следующий снимок рабочей линии молча откатил бы их фото.

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

URL=https://github.com/aavysoki-png/artnazavod-prototype.git
EXCLUDE=(prototype/public/media prototype/public/hero)
# То, что коллеги меняют по PHOTOS.md. Всё прочее из их PR не забираем.
PULL_PATHS=(prototype/public/photos prototype/scripts/final-content-manifest.json)

: "${GITHUB_TOKEN:?нужен GITHUB_TOKEN (PAT с доступом к репозиторию)}"
# Basic, не Bearer, и без credential helper — см. память
# reference_git_push_auth_workaround: osxkeychain на этой машине сломан.
AUTH=(-c credential.helper= -c "http.extraHeader=Authorization: Basic $(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64)")
export GIT_TERMINAL_PROMPT=0

git "${AUTH[@]}" fetch -q "$URL" main
TIP=$(git rev-parse FETCH_HEAD)

# Последний коммит зеркала, собранный из рабочей линии, и его источник.
SYNCED=$(git log --format='%H %(trailers:key=Source-Commit,valueonly,separator=)' "$TIP" | awk 'NF==2 && !f{print; f=1}')  # без exit: иначе SIGPIPE у git log + pipefail роняют скрипт молча
SYNCED_MIRROR=${SYNCED%% *}
SYNCED_SOURCE=${SYNCED##* }
[ -n "$SYNCED_MIRROR" ] || { echo "В зеркале нет коммита с Source-Commit — начальную синхронизацию делать вручную (журнал, 23.09)"; exit 1; }

filtered_tree() {
	local idx; idx=$(mktemp)
	GIT_INDEX_FILE=$idx git read-tree "$1"
	GIT_INDEX_FILE=$idx git rm -r -q --cached --ignore-unmatch "${EXCLUDE[@]}" >/dev/null
	GIT_INDEX_FILE=$idx git write-tree
	rm -f "$idx"
}

case "${1:-}" in
pull)
	if [ "$TIP" = "$SYNCED_MIRROR" ]; then echo "В зеркале ничего нового"; exit 0; fi
	[ -z "$(git status --porcelain -- "${PULL_PATHS[@]}")" ] || { echo "Незакоммиченные правки в ${PULL_PATHS[*]} — сначала разобраться с ними"; exit 1; }
	echo "Новое в зеркале с ${SYNCED_MIRROR:0:7}:"
	git log --oneline "$SYNCED_MIRROR..$TIP"
	echo; git diff --stat "$SYNCED_MIRROR" "$TIP"
	OTHER=$(git diff --name-only "$SYNCED_MIRROR" "$TIP" -- . "${PULL_PATHS[@]/#/:!}")
	[ -z "$OTHER" ] || { echo; echo "Не забираются (вне PHOTOS.md):"; echo "$OTHER"; }
	git diff --quiet "$SYNCED_MIRROR" "$TIP" -- "${PULL_PATHS[@]}" \
		|| git diff --binary "$SYNCED_MIRROR" "$TIP" -- "${PULL_PATHS[@]}" | git apply --index
	# objects.ts в зеркале не трогают (там нет видео) — пересобираем здесь,
	# где видео есть.
	(cd prototype && node scripts/build-objects-ts.mjs >/dev/null)
	git add prototype/src/data/objects.ts
	SUBJECTS=$(git log --format='- %s' "$SYNCED_MIRROR..$TIP" | grep -v '^- Merge ' || true)
	# --allow-empty: PR и его откат в сумме могут ничего не менять, а отметка
	# Mirror-Pulled всё равно нужна — по ней push и deploy-prod.sh видят, что
	# коммиты зеркала забраны.
	git commit -q --allow-empty -m "Фото из GitHub-зеркала (правки коллег по PHOTOS.md)

${SUBJECTS}" --trailer "Mirror-Pulled: $TIP" --trailer "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
	git log --oneline -1
	echo
	echo "Дальше: cd prototype && npm run build && ./deploy-prod.sh, затем $0 push"
	;;
push)
	# Коммиты коллег поверх последней синхронизации: продолжать можно, только
	# если pull их уже забрал в рабочую линию — иначе снимок рабочей линии
	# молча откатил бы их фото.
	if [ "$TIP" != "$SYNCED_MIRROR" ] \
		&& ! git log --format='%(trailers:key=Mirror-Pulled,valueonly)' "$SYNCED_SOURCE..HEAD" | grep -qx "$TIP"; then
		echo "В зеркале есть коммиты, которых нет в рабочей линии — сначала $0 pull"
		git log --oneline "$SYNCED_MIRROR..$TIP"
		exit 1
	fi
	PARENT=$TIP
	COUNT=0
	for c in $(git rev-list --reverse --first-parent "$SYNCED_SOURCE..HEAD"); do
		TREE=$(filtered_tree "$c")
		[ "$TREE" != "$(git rev-parse "$PARENT^{tree}")" ] || continue
		MSG=$(git log -1 --format=%B "$c" | git interpret-trailers --trailer "Source-Commit: $c")
		PARENT=$(GIT_AUTHOR_NAME=$(git log -1 --format=%an "$c") GIT_AUTHOR_EMAIL=$(git log -1 --format=%ae "$c") \
			GIT_AUTHOR_DATE=$(git log -1 --format=%aD "$c") git commit-tree "$TREE" -p "$PARENT" -m "$MSG")
		echo "  ${c:0:7} -> ${PARENT:0:7} $(git log -1 --format=%s "$c")"
		COUNT=$((COUNT + 1))
	done
	[ "$COUNT" -gt 0 ] || { echo "Нечего выкладывать"; exit 0; }
	git "${AUTH[@]}" push -q "$URL" "$PARENT:refs/heads/main"
	git branch -f github-main "$PARENT"
	echo "Зеркало: main = ${PARENT:0:7} (+$COUNT)"
	;;
*)
	echo "Использование: GITHUB_TOKEN=... $0 pull|push"; exit 1 ;;
esac
