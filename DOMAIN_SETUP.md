# Домен / HTTPS: что нужно сделать при аренде нового домена

Сейчас сервис работает по IP, без HTTPS. Ниже — что было отключено/изменено и
как вернуть работу через домен, когда он появится.

## Что сейчас изменено ради работы по IP

1. **`docker-compose.yml`** — build-arg `REACT_APP_BACKEND_URL` для фронта
   выставлен в `/api` (относительный путь) вместо
   `https://prior.ariyo.ru/api`. Фронт теперь всегда ходит на бэкенд через тот
   же хост, с которого его открыли — работает и по IP, и по любому домену,
   менять при возврате домена **не обязательно**.
2. **`nginx/default.conf`** — оставлен один `server` блок на порту 80 без
   `server_name` (без HTTPS, без редиректа, без блока acme-challenge).
   Старый вариант с доменом `prior.ariyo.ru`, редиректом на HTTPS и SSL-блоком
   удалён из файла (см. `git log` / `git show <commit>:nginx/default.conf` до
   этого изменения, чтобы достать оригинал целиком).
3. **`docker-compose.yml`** — сервис `certbot` закомментирован, порт `443` и
   монтирование `./certbot/www`, `./certbot/conf` убраны у сервиса `nginx`.
   Без домена Let's Encrypt не выдаёт и не продлевает сертификаты (для IP это
   невозможно в принципе), поэтому certbot просто падал бы в цикле.

## Что нужно поменять руками на сервере (не в репозитории)

4. **`env/backend.env`** (в `.gitignore`, хранится только на сервере) —
   переменная `CORS_ORIGINS` должна содержать Origin, с которого реально
   открывают фронт. Сейчас нужно выставить туда `http://<IP_СЕРВЕРА>`
   (без пути, без слэша на конце). Если открываете фронт не с порта 80 —
   добавить и его, например `http://<IP>:8081`.

## Как вернуть домен + HTTPS

1. Направить DNS A-запись нового домена на IP сервера.
2. В `nginx/default.conf` восстановить два `server` блока:
   - `listen 80` с `server_name <новый_домен>`, `location /.well-known/acme-challenge/` (root `/var/www/certbot`) и редиректом `return 301 https://$host$request_uri;` на всё остальное;
   - `listen 443 ssl` с `server_name <новый_домен>`, `ssl_certificate`/`ssl_certificate_key` на `/etc/letsencrypt/live/<новый_домен>/...` и теми же `location /api/` и `location /` (proxy_pass на `backend:8080` и `frontend:80`), что сейчас в HTTP-блоке.
3. В `docker-compose.yml`:
   - у сервиса `nginx` вернуть порт `443:443` и монтирования
     `./certbot/www:/var/www/certbot:ro` и `./certbot/conf:/etc/letsencrypt:ro`;
   - раскомментировать сервис `certbot`.
4. Первичный выпуск сертификата (после того как nginx поднят и слушает 80-й
   порт с location для acme-challenge):
   ```
   docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
     -d <новый_домен>
   ```
   затем перезапустить nginx (`docker compose restart nginx`), чтобы он подхватил сертификат.
5. `docker-compose.yml`: build-arg `REACT_APP_BACKEND_URL` можно оставить как
   `/api` — менять не нужно, он не завязан на домен.
6. `env/backend.env`: обновить `CORS_ORIGINS` на `https://<новый_домен>`
   (именно `https`, без пути и слэша на конце).
