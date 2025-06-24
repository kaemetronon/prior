#!/bin/bash

git pull
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD)

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
