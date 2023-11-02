compose-up:
	docker compose up --build -d

compose-up-prod:
	docker compose -f compose.yml -f compose.prod.yml up --build -d

compose-down:
	docker compose down