# Build the application JAR
build-jar:
	mvn clean install

# Build the Docker image
build:
	docker-compose build

# Start the application stack (App, DB, Redis)
run:
	docker-compose up

# Stop the application stack
down:
	docker-compose down

# A clean command to stop containers and remove the data volume
clean: down
	docker volume rm sample-app-2_postgres_data || true
	rm -rf data/postgres

.PHONY: build-jar build run down clean
