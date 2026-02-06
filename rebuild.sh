#!/bin/bash

set -euo pipefail

OLD_REV=$(git rev-parse HEAD)
git pull --ff-only
NEW_REV=$(git rev-parse HEAD)

if [[ "$OLD_REV" == "$NEW_REV" ]]; then
  echo "Repo already up to date."
  CHANGED_FILES=""
else
  CHANGED_FILES=$(git diff --name-only "$OLD_REV" "$NEW_REV")
fi

FRONT_MODIFIED=false
BACK_MODIFIED=false

for file in $CHANGED_FILES; do
    if [[ $file == frontend/* ]]; then
        FRONT_MODIFIED=true
    fi
    if [[ $file == backend/* ]]; then
        BACK_MODIFIED=true
    fi
done

if $FRONT_MODIFIED; then
    echo "Изменения в front, запускаю rebuild front"
    make frontend
fi

if $BACK_MODIFIED; then
    echo "Изменения в back, запускаю rebuild back"
    make backend
fi

if ! $FRONT_MODIFIED && ! $BACK_MODIFIED; then
    echo "Изменённые части проекта не требуют ребилда front или back."
fi
