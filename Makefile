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
	docker-compose stop backend || true
	docker-compose rm -f backend || true
	docker rmi priority-backend:latest || true
	docker-compose up --build -d backend
	docker image prune -f

frontend:
	make update-repo
	docker-compose stop frontend || true
	docker-compose rm -f frontend || true
	docker rmi priority-frontend:latest || true
	docker-compose up --build -d frontend
	docker image prune -f

postgres:
	make update-repo
	docker-compose rm -f postgres || true
	docker-compose up --build -d postgres 