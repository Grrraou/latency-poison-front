.PHONY: dev build down migrate seed clean

# Development commands
dev:
	@echo "Starting development environment..."
	docker-compose up --build

build:
	@echo "Building containers..."
	docker-compose build

down:
	@echo "Stopping containers..."
	docker-compose down

migrate:
	@echo "Running database migrations..."
	docker-compose exec app pnpm db:migrate

seed:
	@echo "Seeding database..."
	docker-compose exec app pnpm db:seed

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	rm -rf .next 