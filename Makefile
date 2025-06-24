.PHONY: backend frontend postgres up down update-repo

update-repo:
	git pull

down:
	docker-compose down --rmi all --volumes --remove-orphans

up:
	make update-repo
	make down
	docker-compose up --build -d

backend:
	make update-repo
	docker-compose rm -f backend || true
	docker-compose up --build -d backend

frontend:
	make update-repo
	docker-compose rm -f frontend || true
	docker-compose up --build -d frontend

postgres:
	make update-repo
	docker-compose rm -f postgres || true
	docker-compose up --build -d postgres 